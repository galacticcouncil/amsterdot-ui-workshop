import { ApiPromise } from "@polkadot/api";
import constate from "constate"
import { Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react"
import { createInstance } from "../lib/polkadotJs";

export interface Dependencies {
  polkadotJs?: ApiPromise
}

export const useCreatePolkadotJs = (setDependencies: Dispatch<SetStateAction<Dependencies | undefined>>) => {
  useEffect(() => {
    (async () => {
      const polkadotJs = await createInstance();
      setDependencies(dependencies => {
        return ({
          ...dependencies,
          polkadotJs
        })
      })
    })()
  }, [setDependencies])
};

export const useDependencies = (): Dependencies | undefined => {
  const [dependencies, setDependencies] = useState<Dependencies>();
  useCreatePolkadotJs(setDependencies)
  return dependencies;
}

export const [DependencyProvider, useDependencyContext] = 
  constate<PropsWithChildren<any>, ReturnType<typeof useDependencies>, never>(useDependencies)

export const useDependenciesLoading = (): boolean => {
  const dependencies = useDependencyContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dependencies?.polkadotJs) return;
    setLoading(false);
  }, [dependencies, setLoading]);

  return loading;
}