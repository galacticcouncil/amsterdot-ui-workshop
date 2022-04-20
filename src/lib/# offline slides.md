# offline slides

## Resolving the requested data (1/3)

We know that our frontend will need to query a `Pool` by an `AssetPair`.
It's how we've structured our query previously. Let's do the following:
- Update `getPool` to accept a `assets` parameter
- Implement a `poolResolver` that will act as an interface between our 'query' and the 'lib'
  - It's an async function that wraps the `getPool` call, parsing out the query params
  - First param of the resolver is not relevant at this stage, but it might contain the parent entity the data is being resolved for. ⚠️ This will be important very soon
  - Second param of the resolver are the args, which in our case are the assets we're using to find our pool

---

## Resolving the requested data (2/3)

```typescript
// src/lib/pool.tsx
export const getPool = async (assets: AssetPair): Promise<Pool | undefined> => {
  return {
    __typename,
    id: '1',
    assets: ['0', '1'],
    balances: []
  }
}
```

```typescript
export const poolResolver: Resolver = 
  async (_entity: unknown, args: PoolResolverArgs, context: unknown): Promise<Pool | undefined> => {
    // no assets were specified, we don't have a pool for that
    // do not throw any errors - this is on purpose
    if (!args.assets) return;
    return getPool(args.assets);
  }
```

---

## Resolving the requested data (3/3)

We've already built the resolver, which wraps our internal data library. It's time to 
integrate it into our Apollo Client:
- Create a new `useResolvers` hook
- Set resolvers for the `client`, also if they change (thanks to `useEffect`)
  - This is a stepping stone for dependency injection and resolver memoization 🪜
  - Since our future dependencies will be *contextual* a.k.a. depending on the react context,
    we need our client & resolver setup to have access to the context as well.
  - Keeping our data layer within the confines of React gives us additional control over e.g. disconnecting from (websocket) data sources once we don't need them anymore (e.g. when a component is dismounted)

  > Rule of thumb is keep the `lib` as clean as possible, and only introduce hooks when you actually need them (e.g. to access contextual dependencies)

```typescript
// src/hooks/useApolloClient.tsx
export const useResolvers = () => {
  return useMemo(() => {
    return {
      Query: {
        pool: poolResolver
      }
    }
  }, [])
}
```

```typescript
// src/hooks/useApolloClient.tsx
export const useApolloClient = () => {
  const client = useMemo(() => {
    return new ApolloClient({
      uri: '',
      cache: new InMemoryCache(),
      // you need at least an empty object here,
      // otherwise @client data aren't resolved
      resolvers: {}
    })
  }, []);

  const resolvers = useResolvers();

  // set resolvers initially and when they change
  useEffect(() => {
    client.setResolvers(resolvers);
  }, [client, resolvers])

  return client
}
```

---

## Goodbye mock data, welcome Polkadot.js SDK

So far we've just consumed a bunch of mock data through our queries and resolvers. We only needed a place holder to connect a few dots together. In reality you'd want to fetch the given pool in the same way as you did with Polkadot.js apps. How can we conceptually fit this into our stack?

- We'll use the Polkadot.js JS SDK (a.k.a. API)
- We'll introduce dependency injection in our resolvers


