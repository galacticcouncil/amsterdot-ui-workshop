import { gql, QueryHookOptions, useQuery } from "@apollo/client";

export const getHistoricalBalancesQuery = gql`
  query GetHistoricalBalances($poolId: ID!) {
    historicalBalances(where: {pool: {id_eq: $poolId}}, limit: 100) {
      assetABalance
      assetBBalance
      blockHeight
      createdAt
    }
  }
`

export interface HistoricalBalance {
  assetABalance: string,
  assetBBalance: string,
  blockHeight: string,
  createdAt: string
}

export interface GetHistoricalBalancesQueryResponse {
  historicalBalances: HistoricalBalance[]
}

export interface GetHistoricalBalancesQueryVariables {
  poolId?: string
}

export const useGetHistoricalBalancesQuery = (options: QueryHookOptions<GetHistoricalBalancesQueryResponse, GetHistoricalBalancesQueryVariables>) =>
  useQuery(
    getHistoricalBalancesQuery,
    options
  )