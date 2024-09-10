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
      updateLoading(true);
      return await invoke('handle_file', { path: paths[0] });
    },
    [addFiles, updateOpenedFile, updateLoading]
  );

  const disableLoading = React.useCallback(() => {
    updateLoading(false);
  }, [updateLoading]);

  React.useEffect(() => {
    const openFile = async (): Promise<void> => {
      try {
        const paths = await open({ multiple: true, filters: [{ name: 'transient', extensions: ['csv'] }] });
        if (Array.isArray(paths) && paths.length > 0) {
          const res = await handleFiles(paths);
          if (res) updateWaveform(res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        disableLoading();
      }
    };

    const openPromise = listen('main-open-files', openFile);
    return () => {
      openPromise.then(close => close()).catch(console.error);
    };
  }, [updateWaveform, disableLoading, handleFiles]);

  React.useEffect(() => {
    const handleFileDrop = async (event: { payload: string[] }) => {
      const paths = event.payload.filter(path => path.endsWith('.csv') || path.endsWith('.gz'));
      if (paths.length === 0) return;

      try {
        const res = await handleFiles(paths);
        if (res) updateWaveform(res);
      } catch (error) {
        console.error('Error handling dropped files:', error);
      } finally {
        disableLoading();
      }
    };

    const dropPromise = listen<string[]>('tauri://file-drop', handleFileDrop);
    return () => {
      dropPromise.then(unsubscribe => unsubscribe()).catch(console.error);
    };
  }, [disableLoading, updateWaveform, handleFiles]);

  React.useEffect(() => {
    const waveformSplitListener = listen('main-split-waveforms', () => {
      updateSplit(!split);
    });

    return () => {
      waveformSplitListener.then(unsubscribe => unsubscribe()).catch(console.error);
    };
  });

  React.useEffect(() => {
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
  }, [waveform]);

  return (
    <Stack spacing={1}>
      {split && Object.keys(waveformOptions).length > 0 ? (
        <>
          {waveformOptions.map((waveformOption, index) => (
            <Chart
              key={`waveform-plot-${index}`}
              waveform={{ [waveformOption.label]: waveform[waveformOption.label] }}
              options={getOptions(theme.palette.mode)}
              waveformOptions={[waveformOption]}
            />
          ))}
        </>
      ) : (
        <Chart waveform={waveform} options={getOptions(theme.palette.mode)} waveformOptions={waveformOptions} />
      )}
    </Stack>
  );
}
