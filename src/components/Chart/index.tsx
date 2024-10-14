/** @format */

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

import ToolsSet from './components/ToolSet.tsx';
import ToolMenu from './components/ToolMenu.tsx';
import { IWaveform, IWaveformOptions } from '@/types/model.ts';
import { useToggle, chartConfigs } from '../../../utils';

interface Props {
  waveform: IWaveform;
  options: ChartOptions<'line'>;
  waveformOptions: IWaveformOptions[];
}

export default function Chart({ waveform, options, waveformOptions }: Props): React.JSX.Element {
  const [fullScreen, toggleFullScreen] = useToggle(false);
  const chartRef = React.useRef();
  const datasets = React.useMemo(
    () =>
      waveformOptions.map(({ label, lineStyle, ...elementOptions }) => ({
        label,
        data: waveform[label].map((y, x) => ({ x, y })),
        borderDash: chartConfigs.lineStyles.get(lineStyle),
        ...elementOptions
      })),
    [waveform, waveformOptions]
  );

  const height = fullScreen || waveformOptions.length !== 1 ? 'calc(99vh - 12px)' : '48vh';
  return (
    <Paper elevation={2} sx={{ height }}>
      <Stack spacing={0} direction='row'>
        <Box sx={{ flexGrow: 1 }} />
        <ToolsSet
          chartRef={chartRef}
          options={options}
          waveformOptions={waveformOptions}
          fullScreen={fullScreen}
          toggleFullScreen={toggleFullScreen}
        />
        <ToolMenu waveform={waveform} waveformOptions={waveformOptions} />
      </Stack>
      <Box sx={{ height: 'calc(100% - 32px)', width: '99%' }}>
        <Line ref={chartRef} data={{ datasets }} options={options} />
      </Box>
    </Paper>
  );
}
