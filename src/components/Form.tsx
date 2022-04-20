import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { AssetPair } from "../lib/pool"

export interface FormProps {
  assets: AssetPair,
  onAssetsChange: (assets: AssetPair) => void
}

export interface FormFields {
  assetIn: string
  assetOut: string
}

export const Form = ({ assets, onAssetsChange }: FormProps) => {
  const form = useForm<FormFields>({
    defaultValues: assets && {
      assetIn: assets[0],
      assetOut: assets[1]
    },
    mode: 'onChange'
  });

  const handleSubmit = useCallback((data: FormFields) => {
    onAssetsChange([data.assetIn, data.assetOut])
  }, [onAssetsChange]);

  return <div>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <input type="text" {...form.register('assetIn', { required: true })} />
      <input type="text" {...form.register('assetOut', { required: true })} />
      <p>
        {!form.formState.isValid
          ? 'oops, you need to input both assetIds'
          : <></>
        }
      </p>
      <input type="submit" />
    </form>
  </div>
}