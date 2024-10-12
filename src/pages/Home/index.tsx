/** @format */

import * as React from 'react';

import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';

import { invoke } from '@tauri-apps/api/core';
import { listen, TauriEvent } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { basename } from '@tauri-apps/api/path';

import { getName } from '@tauri-apps/api/app';
import { Menu, MenuItem, Submenu } from '@tauri-apps/api/menu';

import Chart from './Chart';
import { IWaveform, IFile } from '../../@types/model';
import { getOptions, chartConfigs } from './utils';
import useModelConfig from '../../stores/Model';
import useViewConfig from '../../stores/View';

export default function Main(): React.JSX.Element {
  const { addFiles, updateOpenedFile, waveform, updateWaveform, waveformOptions, addWaveformOptions } = useModelConfig();
  const { split, drawer, preference, updateSplit, updateLoading, updateDrawer, updatePreference } = useViewConfig();
  const theme = useTheme();

  const handleFiles = async (paths: string[]): Promise<IWaveform | undefined> => {
    if (paths.length === 0) return;
    const files: IFile[] = await Promise.all(paths.map(async (path: string) => ({ path, name: await basename(path) })));
    addFiles(files);
    updateOpenedFile(files[0]);
    return await invoke('read_csv', { path: paths[0] });
  };

  const updateWaveformOptions = (waveform: IWaveform) => {
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
  };

  const processFiles = async (paths: string[]) => {
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
  };

  const handleFileOpen = async () => {
    const paths = await open({ multiple: true, filters: [{ name: 'transient', extensions: ['csv', 'gz'] }] });
    if (Array.isArray(paths)) {
      await processFiles(paths);
    }
  };

  const handleFileDrop = async (event: { payload: { paths: string[] } }) => {
    const paths = event.payload.paths.filter(path => path.endsWith('.csv') || path.endsWith('.gz'));
    await processFiles(paths);
  };

  const handleSplit = () => updateSplit(!split);
  const handleDrawer = () => updateDrawer(!drawer);
  const handlePreference = () => updatePreference(!preference);
  async function createMenu() {
    const name = await getName();
    const menu = await Menu.default();
    const items = await menu.items();
    const file = items[1] as Submenu;
    const customs = [
      await MenuItem.new({ id: `__${name}_pref`, text: 'Preference', accelerator: 'CmdOrCtrl+P', action: handlePreference }),
      await MenuItem.new({ id: `__${name}_disp`, text: 'Display', accelerator: 'CmdOrCtrl+D', action: handleDrawer }),
      await MenuItem.new({ id: `__${name}_split`, text: 'Split', accelerator: 'CmdOrCtrl+S', action: handleSplit }),
      await MenuItem.new({ id: `__${name}_file`, text: 'File', accelerator: 'CmdOrCtrl+O', action: handleFileOpen })
    ];
    await file.prepend(customs);
    await menu.removeAt(items.length - 1); // remove the help menu
    menu.setAsAppMenu();
  }
  createMenu();

  React.useEffect(() => {
    const dropPromise = listen(TauriEvent.DRAG_DROP, handleFileDrop);

    return () => {
      dropPromise.then(unsubscribe => unsubscribe()).catch(console.error);
    };
  });

  const filteredWaveformOptions = React.useMemo(() => {
    return waveformOptions.filter(option => waveform[option.label]);
  }, [waveform, waveformOptions]);

  return (
    <Stack spacing={1}>
      {split && Object.keys(waveformOptions).length > 0 ? (
        <>
          {filteredWaveformOptions
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((waveformOption, index) => (
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
