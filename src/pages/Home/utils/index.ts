/** @format */

import * as React from 'react';
import { PaletteMode } from '@mui/material';
import { ChartOptions, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(LinearScale, LineElement, PointElement, Tooltip, Legend, zoomPlugin);

export const getOptions = (paletteMode: PaletteMode): ChartOptions<'line'> => {
  const lightColor = 'rgba(0, 0, 0, 0.5)';
  const darkColor = 'rgba(256, 256, 256, 0.5)';
  const gridColor = paletteMode === 'light' ? 'rgba(128, 128, 128, 0.5)' : darkColor;
  const tickColor = paletteMode === 'light' ? lightColor : darkColor;
  const backgroundColor = paletteMode === 'light' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.1)';

  const tickCallback = (value: number | string) => {
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value : value.toFixed(2);
    }
    return value;
  };

  const axisConfig = {
    border: { display: false, dash: [4, 4] },
    grid: { display: true, drawOnChartArea: true, drawTicks: false, color: gridColor },
    ticks: { color: tickColor, padding: 0, minRotation: 0, maxRotation: 0, callback: tickCallback }
  };

  return {
    maintainAspectRatio: false,
    responsive: true,
    parsing: false,
    animation: false,
    normalized: true,
    spanGaps: true,
    borderColor: backgroundColor,
    backgroundColor,
    scales: {
      x: {
        type: 'linear',
        bounds: 'data',
        ...axisConfig
      },
      y: {
        ...axisConfig
      }
    },
    datasets: {
      line: {
        pointRadius: 0 // disable for all `'line'` datasets
      }
    },
    elements: {
      point: {
        radius: 0 // default to disabled in all datasets
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 6,
          boxHeight: 6,
          color: paletteMode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(256, 256, 256, 0.7)'
        }
      },
      decimation: {
        enabled: true,
        algorithm: 'min-max'
      },
      tooltip: {
        enabled: true
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          wheel: {
            enabled: false
          },
          pinch: {
            enabled: true
          },
          drag: {
            enabled: false,
            backgroundColor: paletteMode === 'light' ? 'rgba(128, 128, 128, 0.3)' : 'rgba(256, 256, 256, 0.3)'
          },
          mode: 'xy'
        }
      }
    }
  };
};

const lineStyles: Map<string, number[] | never[]> = new Map([
  ['solid', []],
  ['dashed', [5, 5]],
  ['dotted', [1, 1]]
]);

export const chartConfigs = {
  lineStyles,
  defaultLineStyle: 'solid' as const,
  defaultLineWidth: 2,
  defaultLineColors: [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
    '#8c564b',
    '#ffea00',
    '#008000',
    '#ff0000',
    '#e377c2',
    '#aec7e8',
    '#ffbb78'
  ]
};

export function useToggle(initialState = false): [boolean, () => void] {
  const [state, setState] = React.useState<boolean>(initialState);
  const toggle = React.useCallback((): void => setState(v => !v), []);
  return [state, toggle];
}

export function colToCSV<T = number>(cols: Record<string, readonly T[]>): string {
  const entries = Object.entries(cols);
  const headers = entries.map(([key]) => key).join(',');
  const minimumItems = Math.min(...entries.map(([, value]) => value.length));
  const rows = Array.from({ length: minimumItems }, (_, i) => entries.map(([, value]) => value[i]).join(','));
  return `${headers}\n${rows.join('\n')}`;
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
