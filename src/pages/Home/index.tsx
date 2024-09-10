/** @format */

import * as React from 'react';

import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';

import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/dialog';
import { basename } from '@tauri-apps/api/path';

import Chart from './Chart';
import { IWaveform, IFile } from '../../@types/model';
import { getOptions, chartConfigs } from './utils';
import useModelConfig from '../../stores/Model';
import useViewConfig from '../../stores/View';

export default function Main(): JSX.Element {
  const { addFiles, updateOpenedFile, waveform, updateWaveform, waveformOptions, addWaveformOptions } =
    useModelConfig();
  const { split, updateSplit, updateLoading } = useViewConfig();
  const theme = useTheme();

  const handleFiles = React.useCallback(
    async (paths: string[]): Promise<IWaveform | undefined> => {
      if (paths.length === 0) return;
      const files: IFile[] = await Promise.all(
        paths.map(async (path: string) => ({ path, name: await basename(path) }))
      );
      addFiles(files);
      updateOpenedFile(files[0]);
      return await invoke('read_csv', { path: paths[0] });
    },
    [addFiles, updateOpenedFile]
  );

  const updateWaveformOptions = React.useCallback(
    (waveform: IWaveform) => {
      const channels = Object.keys(waveform);
      const colorCount = chartConfigs.defaultLineColors.length;

      if (channels.length > colorCount) {
        chartConfigs.defaultLineColors = [
          ...chartConfigs.defaultLineColors,
          ...Array(channels.length - colorCount)
            .fill(0)
            .map(() => chartConfigs.defaultLineColors[Math.floor(Math.random() * colorCount)])
        ];
      }

      const newWaveformOptions = channels.map((label, index) => ({
        label,
        borderColor: chartConfigs.defaultLineColors[index],
        backgroundColor: chartConfigs.defaultLineColors[index],
        borderWidth: chartConfigs.defaultLineWidth,
        lineStyle: chartConfigs.defaultLineStyle
      }));
      addWaveformOptions(newWaveformOptions);
    },
    [addWaveformOptions]
  );

  const processFiles = React.useCallback(
    async (paths: string[]) => {
      if (paths.length === 0) return;
      updateLoading(true);
      try {
        const waveform = await handleFiles(paths);
        if (waveform) {
          updateWaveform(waveform);
          updateWaveformOptions(waveform);
        }
      } catch (error) {
        console.error('Error processing files:', error);
      } finally {
        updateLoading(false);
      }
    },
    [handleFiles, updateWaveform, updateWaveformOptions, updateLoading]
  );

  const handleFileOpen = React.useCallback(async () => {
    const paths = await open({ multiple: true, filters: [{ name: 'transient', extensions: ['csv', 'gz'] }] });
    if (Array.isArray(paths)) {
      await processFiles(paths);
    }
  }, [processFiles]);

  const handleFileDrop = React.useCallback(
    async (event: { payload: string[] }) => {
      const paths = event.payload.filter(path => path.endsWith('.csv') || path.endsWith('.gz'));
      await processFiles(paths);
    },
    [processFiles]
  );

  const handleWaveformSplit = React.useCallback(() => {
    updateSplit(!split);
  }, [split, updateSplit]);

  React.useEffect(() => {
    const openPromise = listen('main-open-files', handleFileOpen);
    const dropPromise = listen<string[]>('tauri://file-drop', handleFileDrop);
    const splitPromise = listen('main-split-waveforms', handleWaveformSplit);

    return () => {
      openPromise.then(unsubscribe => unsubscribe()).catch(console.error);
      splitPromise.then(unsubscribe => unsubscribe()).catch(console.error);
      dropPromise.then(unsubscribe => unsubscribe()).catch(console.error);
    };
  }, [split]);

  const filteredWaveformOptions = React.useMemo(() => {
    return waveformOptions.filter(option => waveform[option.label]);
  }, [waveform, waveformOptions]);

  return (
    <Stack spacing={1}>
      {split && Object.keys(waveformOptions).length > 0 ? (
        <>
          {filteredWaveformOptions.map((waveformOption, index) => (
            <Chart
              key={`waveform-plot-${index}`}
              waveform={{ [waveformOption.label]: waveform[waveformOption.label] }}
              options={getOptions(theme.palette.mode)}
              waveformOptions={[waveformOption]}
            />
          ))}
        </>
      ) : (
        <Chart waveform={waveform} options={getOptions(theme.palette.mode)} waveformOptions={filteredWaveformOptions} />
      )}
    </Stack>
  );
}
