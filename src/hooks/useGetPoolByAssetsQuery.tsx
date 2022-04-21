import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { Balances } from "../lib/balances";
import { AssetPair, getPoolById, SpotPrice } from "../lib/pool";

export const getPoolByAssetsQuery = gql`
  # Query that looks for a pool by a tuple of assets
  # Note: GraphQL doesnt have tuples, just arrays,
  # but country girls make do 🌽
  query GetPoolByAssets($assets: [String!]!) {
      # ⚠️ pass the parameter to the resolver here
      pool(assets: $assets) @client{
          id
          assets,
          balances(assets: $assets) {
            assetId,
            free
          },
          spotPrice
      },
  }
`

// we need to know what kind of data does the query return
export interface GetPoolByAssetsQueryResponse {
  pool: Awaited<ReturnType<ReturnType<typeof getPoolById>>> & Balances & SpotPrice
}

export interface GetPoolByAssetsQueryVariables {
  assets: AssetPair
}

// useQuery only works inside of an ApolloProvider context
export const useGetPoolByAssetsQuery = 
  (options: QueryHookOptions<GetPoolByAssetsQueryResponse, GetPoolByAssetsQueryVariables>) => 
    useQuery(
      getPoolByAssetsQuery,
      options
    );

