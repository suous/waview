/** @format */

import * as React from 'react';
import HighlightAltRoundedIcon from '@mui/icons-material/HighlightAltRounded';
import ExpandRoundedIcon from '@mui/icons-material/ExpandRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import PanToolAltRoundedIcon from '@mui/icons-material/PanToolAltRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { save } from '@tauri-apps/api/dialog';
import { dirname } from '@tauri-apps/api/path';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { useTranslation } from 'react-i18next';
// @ts-expect-error it exist
import { type ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { ChartOptions } from 'chart.js';

import { useToggle, base64ToUint8Array } from '../../utils';
import useModelConfig from '../../../../stores/Model';
import { IWaveformOptions } from '../../../../@types/model';

type ToolsButtonProps = IconButtonProps<'button', { title: string }>;

interface Props {
  chartRef: React.RefObject<ChartJSOrUndefined<'line', Array<Record<string, number>>>>;
  options: ChartOptions<'line'>;
  waveformOptions: IWaveformOptions[];
  fullScreen: boolean;
  toggleFullScreen: () => void;
}

export default function ToolsSet({
  chartRef,
  options,
  waveformOptions,
  fullScreen,
  toggleFullScreen
}: Props): JSX.Element {
  const { openedFile } = useModelConfig();
  const [, toggleUpdate] = useToggle(false);
  const { t } = useTranslation();

  const resetZoom = React.useCallback((): void => chartRef?.current?.resetZoom(), [chartRef]);
  const zoomIn = React.useCallback((): void => chartRef?.current?.zoom(1.1), [chartRef]);
  const zoomOut = React.useCallback((): void => chartRef?.current?.zoom(0.9), [chartRef]);

  const handleSaveImage = async (image: Uint8Array, path: string): Promise<void> => {
    const defaultPath = await dirname(path);
    save({ defaultPath, filters: [{ name: 'PNG', extensions: ['png'] }] })
      .then(path => {
        if (path != null) {
          writeBinaryFile(path, image).catch(console.error);
        }
      })
      .catch(console.error);
  };

  const saveImage = (): void => {
    const image = chartRef?.current?.toBase64Image();
    if (image != null && openedFile != null) {
      handleSaveImage(base64ToUint8Array(image.replace('data:image/png;base64,', '')), openedFile.path).catch(
        console.error
      );
    }
  };

  const togglePan = React.useCallback((): void => {
    if (options.plugins?.zoom?.pan != null && options.plugins?.zoom?.zoom?.drag != null) {
      options.plugins.zoom.pan.enabled = !options.plugins.zoom.pan.enabled;
      options.plugins.zoom.zoom.drag.enabled = false;
    }
    toggleUpdate();
  }, [options.plugins?.zoom, toggleUpdate]);

  const toggleDrag = React.useCallback(
    (mode: 'x' | 'y' | 'xy' = 'xy'): void => {
      if (options.plugins?.zoom?.pan != null && options.plugins?.zoom?.zoom?.drag != null) {
        options.plugins.zoom.pan.enabled = false;
        options.plugins.zoom.zoom.drag.enabled =
          options.plugins?.zoom?.zoom?.mode === mode ? !options.plugins?.zoom?.zoom?.drag?.enabled : true;
        options.plugins.zoom.zoom.mode = mode;
      }
      toggleUpdate();
    },
    [options.plugins?.zoom, toggleUpdate]
  );

  React.useEffect(() => {
    if (options.plugins?.legend != null) {
      options.plugins.legend.position = waveformOptions.length > 1 ? 'top' : 'chartArea';
      options.plugins.legend.align = waveformOptions.length > 1 ? 'center' : 'start';
    }
  }, [options.plugins?.legend, waveformOptions.length]);

  const dragColor = (mode: 'x' | 'y' | 'xy'): 'primary' | 'inherit' => {
    return options.plugins?.zoom?.zoom?.drag?.enabled && options.plugins?.zoom?.zoom?.mode === mode
      ? 'primary'
      : 'inherit';
  };

  React.useEffect(() => {
    // necessary to update the chart
    chartRef.current?.update();

    const changeCursor = (grab = false): string => {
      if (options.plugins?.zoom?.pan?.enabled) {
        return grab ? 'grabbing' : 'grab';
      }
      if (options.plugins?.zoom?.zoom?.drag?.enabled) {
        switch (options.plugins?.zoom?.zoom?.mode) {
          case 'x':
            return grab ? 'col-resize' : 'ew-resize';
          case 'y':
            return grab ? 'row-resize' : 'ns-resize';
          case 'xy':
            return grab ? 'zoom-in' : 'crosshair';
          default:
            return 'auto';
        }
      }
      return 'auto';
    };

    if (chartRef.current?.canvas != null) {
      const canvas = chartRef.current.canvas;
      canvas.onmousedown = () => {
        canvas.style.cursor = changeCursor(true);
      };
      canvas.onmouseup = () => {
        canvas.style.cursor = changeCursor();
      };
      canvas.style.cursor = changeCursor();
    }
  });

  const tools = React.useMemo<ToolsButtonProps[]>(
    () => [
      {
        title: t('Zoom XY'),
        color: dragColor('xy'),
        children: <HighlightAltRoundedIcon />,
        onClick: () => toggleDrag('xy')
      },
      {
        title: t('Zoom X'),
        color: dragColor('x'),
        children: <ExpandRoundedIcon />,
        onClick: () => toggleDrag('x'),
        sx: { '& svg': { transform: 'rotate(-90deg)' } }
      },
      {
        title: t('Zoom Y'),
        color: dragColor('y'),
        children: <ExpandRoundedIcon />,
        onClick: () => toggleDrag('y')
      },
      {
        title: t('Zoom In'),
        children: <ZoomInRoundedIcon />,
        onClick: zoomIn
      },
      {
        title: t('Zoom Out'),
        children: <ZoomOutRoundedIcon />,
        onClick: zoomOut
      },
      {
        title: t('Pan'),
        color: options.plugins?.zoom?.pan?.enabled === true ? 'primary' : 'inherit',
        children: <PanToolAltRoundedIcon />,
        onClick: togglePan
      },
      {
        title: t('Reset'),
        children: <AutorenewRoundedIcon />,
        onClick: resetZoom
      },
      {
        title: t('Full Screen'),
        children: fullScreen ? <FullscreenExitRoundedIcon /> : <FullscreenRoundedIcon />,
        onClick: toggleFullScreen
      },
      {
        title: t('Save Image'),
        children: <SaveRoundedIcon />,
        onClick: saveImage
      }
    ],
    [
      t,
      dragColor,
      toggleDrag,
      zoomIn,
      zoomOut,
      options.plugins?.zoom?.pan?.enabled,
      togglePan,
      resetZoom,
      fullScreen,
      toggleFullScreen,
      saveImage
    ]
  );

  const visibleTools = React.useMemo(
    () => (waveformOptions.length === 1 ? tools : tools.filter(tool => tool.title !== t('Full Screen'))),
    [waveformOptions.length, tools, t]
  );
  return (
    <>
      {visibleTools.map(({ title, ...rest }, index) => (
        <Tooltip title={title} key={`tools_${title}_${index}`}>
          <IconButton {...rest} />
        </Tooltip>
      ))}
    </>
  );
}
