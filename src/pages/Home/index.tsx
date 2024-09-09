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
import useModelConfig from '../../stores/ModelContext';
import useViewConfig from '../../stores/ViewContext';

export default function Main(): JSX.Element {
  const { addFiles, updateOpenedFile, waveform, updateWaveform, waveformOptions, addWaveformOptions } =
    useModelConfig();
  const { waveformSplit, updateWaveformSplit, updateLoading } = useViewConfig();
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
        const paths = await open({
          multiple: true,
          filters: [{ name: 'transient', extensions: ['csv'] }]
        });

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
      updateWaveformSplit(!waveformSplit);
    }).catch(console.error);
    return () => {
      waveformSplitListener
        .then(close => {
          if (close != null) {
            close();
          }
        })
        .catch(console.error);
    };
  });

  React.useEffect(() => {
    const channels = Object.keys(waveform);
    if (channels.length > chartConfigs.defaultLineColors.length) {
      for (let i = 0; i < channels.length - chartConfigs.defaultLineColors.length; i++) {
        chartConfigs.defaultLineColors.push(
          chartConfigs.defaultLineColors[Math.floor(Math.random() * chartConfigs.defaultLineColors.length)]
        );
      }
    }
    addWaveformOptions(
      channels.map((label, index) => ({
        label,
        borderColor: chartConfigs.defaultLineColors[index],
        backgroundColor: chartConfigs.defaultLineColors[index],
        borderWidth: chartConfigs.defaultLineWidth,
        lineStyle: chartConfigs.defaultLineStyle
      }))
    );
  }, [waveform, addWaveformOptions]);

  return (
    <Stack spacing={1}>
      {waveformSplit && Object.keys(waveformOptions).length > 0 ? (
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
