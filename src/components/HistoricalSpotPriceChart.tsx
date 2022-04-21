import { Line } from "react-chartjs-2"
import { HistoricalBalance } from "../hooks/useGetHistoricalBalancesQuery"
import { Chart, ChartData, registerables } from 'chart.js';
import { useMemo } from "react";
import { calcualateSpotPrice, Pool } from "../lib/pool";
import 'chartjs-adapter-moment';
import { Balances } from "../lib/balances";

Chart.register(...registerables);

export interface HistoricalBalancesChartProps {
  historicalBalances?: HistoricalBalance[]
  pool?: Pool & Balances
  loading: boolean
}

export const HistoricalSpotPriceChart: React.FC<HistoricalBalancesChartProps> = ({ historicalBalances, pool, loading }) => {
  const data: ChartData<'line'> | undefined = useMemo(() => {
    if (!historicalBalances || !pool) return;
    
    // turn historical balances into a dataset consumable by the chart library
    const data = historicalBalances.map((historicalBalance, i) => {
      const __typename = 'Balance'
      const id = __typename

      return {
        // createdAt is our x axis
        x: new Date(historicalBalance.createdAt).getTime(),
        // spot price is our y axis
        y: parseFloat(
          calcualateSpotPrice(
            // create a pretend pool at a historical point in time
            {
              balances: [
                { __typename, id, assetId: pool.assets[0], free: historicalBalance.assetABalance },
                { __typename, id, assetId: pool.assets[1], free: historicalBalance.assetBBalance }
              ]
            },
            pool.assets
          )
        )
      }
    })

    // return data in a format accepted by the chart library
    return {
      labels: data.map(dataPoint => dataPoint.x),
      datasets: [
        { data, label: 'Spot price' },
      ],
    }
  }, [historicalBalances, pool]);

  const options = useMemo(() => {
    return {
      scales: {
        xAxis: {
          type: 'time'
        }
      }
    }
  }, [])

  // little cheeky css
  return <div style={{ width: '800px' }}>
    {loading
      ? 'loading...'
      : (
        data
          ? <Line data={data} options={options as any}></Line>
          : 'No data available'
      )
    }
  </div>
}