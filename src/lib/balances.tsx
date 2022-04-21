import { Resolver } from "@apollo/client";
import { OrmlAccountData } from "@open-web3/orml-types/interfaces/tokens";
import { ApiPromise } from "@polkadot/api";
import { AssetId } from "./pool";

// generic Balance for both native and 3rd party assets
export type Balance = {
  __typename: string,
  id: string,
  assetId: AssetId,
  free: string
}

export interface Balances {
  balances: Balance[]
}

export const __typename = 'Balance';

export const getNativeBalance = (apiInstance: ApiPromise) => 
  async (address: string): Promise<Balance> => {
    const accountInfo =  await apiInstance.query.system.account(address);
    return {
      __typename,
      id: `0-${address}`,
      assetId: '0',
      free: accountInfo.data.free.toString()
    }
  }

export const getTokensBalances = (apiInstance: ApiPromise) =>
  async (address: string, assetIds: AssetId[]): Promise<Balance[]> => {
    assetIds = assetIds.filter(assetId => assetId !== '0');
    const queryParameter: string[][] = assetIds.map((assetId) => [
      address,
      assetId,
    ]);

    const accountData = await apiInstance.query.tokens.accounts.multi<OrmlAccountData>(
      queryParameter
    );

    return accountData.map((accountData, i) => {
      const assetId = assetIds[i];
      
      return {
        __typename,
        id: `${assetId}-${address}`,
        assetId,
        free: accountData.free.toString()
      }
    })
  }

export interface ParentEntity {
  id: string
}

export interface PoolResolverArgs {
  assets: AssetId[]
}

export const balancesResolver = (apiInstance?: ApiPromise): Resolver =>
  async (entity: ParentEntity, { assets }: PoolResolverArgs): Promise<Balance[] | undefined> => {
    if (!apiInstance) throw new Error('SDK instance is not ready yet');

    const nativeBalance = await getNativeBalance(apiInstance)(entity.id);
    const tokenBalances = await getTokensBalances(apiInstance)(entity.id, assets)
    return [nativeBalance].concat(tokenBalances);
  }