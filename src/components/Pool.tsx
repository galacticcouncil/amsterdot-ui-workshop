import { GetPoolByAssetsQueryResponse } from "../hooks/useGetPoolByAssetsQuery"
import { Pool as PoolModel } from "../lib/pool"

export interface PoolProps {
  pool?: GetPoolByAssetsQueryResponse['pool'],
  loading: boolean
}

export const Pool = ({ pool, loading }: PoolProps) => {
  return <>
    {!loading
        ? pool
          ? <>
            <p>ID: {pool.id}</p>
            <p>Assets: {pool.assets[0]} / {pool.assets[1]}</p>
            <div>
              <p>Balances:</p>
              {pool.balances.map(balance => (
                <div key={balance.assetId}>
                  <p>AssetId: {balance.assetId}</p>
                  <p>Free balance: {balance.free}</p>
                </div>
              ))}
            </div>
            <p>Spot price: {pool.spotPrice || '???'}</p>
          </>
          : 'No pool found :/'
        : 'loading...'
    }
  </>
}