/** @format */

import * as React from 'react';

import { PaletteMode } from '@mui/material';

import { ChartOptions, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(LinearScale, LineElement, PointElement, Tooltip, Legend, zoomPlugin);

export const getOptions = (paletteMode: PaletteMode): ChartOptions<'line'> => ({
  maintainAspectRatio: false,
  responsive: true,
  parsing: false,
  animation: false,
  normalized: true,
  spanGaps: true,
  borderColor: paletteMode === 'light' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.1)',
  backgroundColor: paletteMode === 'light' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.1)',
  scales: {
    x: {
      type: 'linear',
      bounds: 'data',
      border: {
        display: false,
        dash: [4, 4]
      },
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        color: paletteMode === 'light' ? 'rgba(128, 128, 128, 0.5)' : 'rgba(256, 256, 256, 0.5)'
      },
      ticks: {
        color: paletteMode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(256, 256, 256, 0.5)',
        padding: 0,
        minRotation: 0,
        maxRotation: 0,
        callback: (value: number | string) => {
          if (typeof value === 'number') {
            return Number.isInteger(value) ? value : value.toFixed(2);
          }
          return value;
        }
      }
    },
    y: {
      border: {
        display: false,
        dash: [4, 4]
      },
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        color: paletteMode === 'light' ? 'rgba(128, 128, 128, 0.5)' : 'rgba(256, 256, 256, 0.5)'
      },
      ticks: {
        color: paletteMode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(256, 256, 256, 0.5)',
        padding: 0,
        minRotation: 0,
        maxRotation: 0,
        callback: (value: number | string) => {
          if (typeof value === 'number') {
            return Number.isInteger(value) ? value : value.toFixed(2);
          }
          return value;
        }
      }
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
});

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
  const values = Object.values(cols);
  const minimumItems = Math.min(...values.map(v => v.length));
  const rows = [];
  for (let i = 0; i < minimumItems; i++) {
    rows.push(values.map(v => v[i]).join(','));
  }
  return `${Object.keys(cols).join(',')}\n${rows.join('\n')}`;
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
