import { FieldReadFunction, gql, Resolver } from "@apollo/client";
import { AccountId } from "@open-web3/orml-types/interfaces/runtime";
import { ApiPromise } from "@polkadot/api";
import '@polkadot/api-augment'; // TODO: slides
import type { U32 } from '@polkadot/types';
import { IOption, ITuple } from "@polkadot/types-codec/types";
import BigNumber from "bignumber.js";
import { Balances } from "./balances";

export type Address = string;
export type AssetId = string;

// tuple of two asset IDs
export type AssetPair = [AssetId, AssetId];

export interface Pool {
  // entity identifier for Apollo cache
  __typename: string,
  // pool address
  id: Address,
  // ordered tuple of asset IDs
  assets: AssetPair,
}

export interface SpotPrice {
  spotPrice?: string
}

export const __typename = 'Pool';

export type PoolAssets = IOption<ITuple<[U32, U32]>>;

export const toPool = (id: Pool['id'], poolAssets: PoolAssets): Pool | undefined => {
  if (poolAssets.isSome) {
    return {
      id,
      __typename,
      assets: [
        poolAssets.unwrap()[0].toString(),
        poolAssets.unwrap()[1].toString()
      ]
    }
  }
}

export const getPoolById = 
  (apiPromise: ApiPromise) =>
  async (id: Pool['id']): Promise<Pool | undefined> => {
    const poolAssets = await apiPromise.query.xyk.poolAssets<PoolAssets>(id);
    return toPool(id, poolAssets);
  }

export const customRPC = (apiInstance: ApiPromise) => {
  type CustomRPC = {
    xyk: {
      getPoolAccount: (assetOutId: string, assetInId: string) => AccountId;
    }
  } & typeof apiInstance.rpc;

  return apiInstance.rpc as CustomRPC;
}

export const getPoolId = 
  (apiInstance: ApiPromise) =>
  async (assets: AssetPair): Promise<Pool['id'] | undefined> => {
    const poolId = await customRPC(apiInstance).xyk.getPoolAccount(assets[0], assets[1]);
    return poolId.toString();
  }

export interface PoolResolverArgs {
  assets: AssetPair
}

export const poolResolver = 
  (apiInstance?: ApiPromise): Resolver => 
  async (_entity: unknown, { assets }: PoolResolverArgs, context: unknown): Promise<Pool | undefined> => {
    // throw an error if the dependency isn't ready yet
    if (!apiInstance) throw new Error('SDK instance is not ready yet')
    // get the ID of the pool by its assets
    const id = await getPoolId(apiInstance)(assets);
    // if we can't find the requested pool, throw an error
    if (!id) throw new Error('Pool not found');
    // proceed with fetching the pool
    return getPoolById(apiInstance)(id);
  }

  export const calcualateSpotPrice = (pool: Balances, assets: AssetPair) => {
    const assetA = assets[0];
    const assetB = assets[1];
    
    const assetABalance = pool?.balances.filter(balance => balance.assetId === assetA)[0].free
    const assetBBalance = pool?.balances.filter(balance => balance.assetId === assetB)[0].free
  
    // This can go really bad - e.g. turn into scientific notation
    const spotPrice = new BigNumber(assetABalance).dividedBy(assetBBalance).toString();
    return spotPrice;
  }
  
  export const spotPriceFieldPolicy: FieldReadFunction<string | undefined> = (_spotPrice, { cache, readField, variables }) => {
    const id = `${__typename}:${readField('id')}`;
    const pool = cache.readFragment<Balances>({
      id,
      variables,
      fragment: gql`
        fragment DataFragment on Pool {
          balances(assets: $assets) {
            assetId,
            free
          },
        }
      `,
    });
  
    if (pool && variables) {
      return calcualateSpotPrice(pool, variables['assets'])
    }
  }