import { useCallback, useMemo, useState } from "react";
import { Form } from "../components/Form";
import { Pool } from "../components/Pool";
import { useDependenciesLoading } from "../hooks/useDependencies";
import { useGetPoolByAssetsQuery } from "../hooks/useGetPoolByAssetsQuery"
import { AssetPair } from "../lib/pool";

export const Trade = () => {
  const [assets, setAssets] = useState<AssetPair>(['0', '1']);
  const dependenciesLoading = useDependenciesLoading();
  const { data: poolData, loading: poolDataLoading, error } = useGetPoolByAssetsQuery({
    variables: { assets },
    skip: dependenciesLoading
  });

  const loading = useMemo(() => dependenciesLoading || poolDataLoading, [dependenciesLoading, poolDataLoading]);

  error && console.error(error);

  const handleAssetsChange = useCallback((assets: AssetPair) => {
    setAssets(assets);
  }, [])

  return <>
    <h1>Basilisk UI Workshop</h1>
    <Pool pool={poolData?.pool} loading={loading} />
    <Form assets={assets} onAssetsChange={handleAssetsChange}/>
  </>
}