import { useCallback, useMemo, useState } from "react";
import { Form } from "../components/Form";
import { HistoricalSpotPriceChart } from "../components/HistoricalSpotPriceChart";
import { Pool } from "../components/Pool";
import { useDependenciesLoading } from "../hooks/useDependencies";
import { useGetHistoricalBalancesQuery } from "../hooks/useGetHistoricalBalancesQuery";
import { useGetPoolByAssetsQuery } from "../hooks/useGetPoolByAssetsQuery"
import { AssetPair } from "../lib/pool";

export const Trade: React.FC<{}> = () => {
  const [assets, setAssets] = useState<AssetPair>(['0', '1']);
  const dependenciesLoading = useDependenciesLoading();
  const { data: poolData, loading: poolDataLoading, error } = useGetPoolByAssetsQuery({
    variables: { assets },
    skip: dependenciesLoading
  });

  const poolId = useMemo(() => poolData?.pool.id, [poolData])
  const { data: historicalBalancesData, loading: historicalBalancesLoading } = useGetHistoricalBalancesQuery({
    variables: { poolId },
    // Skip seems to be br0ken in certain Apollo versions :/
    // we could workaround this using lazy queries
    // https://github.com/apollographql/apollo-client/issues/6190#issuecomment-1069368247
    skip: !poolId
  });

  const loading = useMemo(() => (
    dependenciesLoading || poolDataLoading || historicalBalancesLoading
  ), [dependenciesLoading, poolDataLoading, historicalBalancesLoading]);

  error && console.error(error);

  const handleAssetsChange = useCallback((assets: AssetPair) => {
    setAssets(assets);
  }, [])

  return <>
    <h1>Basilisk UI Workshop</h1>
    <Pool pool={poolData?.pool} loading={loading} />
    <HistoricalSpotPriceChart 
      historicalBalances={historicalBalancesData?.historicalBalances} 
      pool={poolData?.pool}
      loading={loading}
    />
    <Form assets={assets} onAssetsChange={handleAssetsChange}/>
  </>
}