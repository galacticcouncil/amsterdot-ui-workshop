import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ApiPromise } from "@polkadot/api";

export const invalidateCachePerBlock = async (client: ApolloClient<NormalizedCacheObject>, apiInstance: ApiPromise) => {
  return await apiInstance.derive.chain.bestNumber(() => {
    client.refetchQueries({
      include: 'all'
    });
  })
}