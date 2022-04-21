import { Balances } from "../lib/balances"
import { Pool as PoolModel, SpotPrice } from "../lib/pool"

export interface PoolProps {
  pool?: PoolModel & Balances & SpotPrice,
  loading: boolean
}

export const Pool: React.FC<PoolProps> = ({ pool, loading }) => {
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