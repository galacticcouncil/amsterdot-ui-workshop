import { ApiPromise, WsProvider } from "@polkadot/api";
import { ApiOptions } from "@polkadot/api/types";

const rpc: ApiOptions['rpc'] = {
  xyk: {
    getPoolAccount: {
      description: 'Get pool account id by asset IDs',
      params: [
        {
          name: 'assetInId',
          type: 'u32',
        },
        {
          name: 'assetOutId',
          type: 'u32',
        },
      ],
      type: 'AccountId',
    },
  },
};

export const createInstance = async (): Promise<ApiPromise> => {
  // const provider = new WsProvider('wss://amsterdot.eu.ngrok.io')
  const provider = new WsProvider('wss://basilisk-rpc.hydration.cloud/');
  const instance = await ApiPromise.create({ provider, rpc });

  // wait for the instance to finish setting up (e.g. connecting)
  await instance.isReady;

  return instance;
}