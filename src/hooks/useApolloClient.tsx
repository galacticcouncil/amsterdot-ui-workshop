import { ApolloClient, ApolloProvider, InMemoryCache, Resolvers } from "@apollo/client";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react"
import { balancesResolver } from "../lib/balances";
import { poolResolver, spotPriceFieldPolicy } from "../lib/pool";
import { Dependencies, useDependencyContext } from "./useDependencies";
import { invalidateCachePerBlock } from "../lib/invalidateCachePerBlock";
import { VoidFn } from "@polkadot/api/types";

export const useResolvers = (dependencies?: Dependencies): Resolvers => {
  return useMemo(() => {
    return {
      Query: {
        pool: poolResolver(dependencies?.polkadotJs)
      },
      Pool: {
        balances: balancesResolver(dependencies?.polkadotJs)
      }
    }
  }, [dependencies])
}

export const useApolloClient = () => {
  const client = useMemo(() => {
    return new ApolloClient({
      uri: '',
      cache: new InMemoryCache({
        /**
         * 
         */
        typePolicies: {
          Pool: {
            fields: {
              spotPrice: spotPriceFieldPolicy
            }
          }
        }
      }),
      // you need at least an empty object here,
      // otherwise @client data aren't resolved
      resolvers: {}
    })
  }, []);

  // pass dependencies to resolvers
  const dependencies = useDependencyContext();
  const resolvers = useResolvers(dependencies);

  // set resolvers initially and when they change
  useEffect(() => {
    client.setResolvers(resolvers);
  }, [client, resolvers])

  const unsubscribeInvalidation = useRef<VoidFn>()
  useEffect(() => {
    (async () => {
      if (!dependencies?.polkadotJs) return;
      unsubscribeInvalidation.current = await invalidateCachePerBlock(client, dependencies.polkadotJs);
    })()
    return () => unsubscribeInvalidation.current && unsubscribeInvalidation.current();
  }, [client, dependencies])

  return client
}

export const ConfiguredApolloProvider = ({ children }: PropsWithChildren<{}>) => {
  const client = useApolloClient();
  return <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
}