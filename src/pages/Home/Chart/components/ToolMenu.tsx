/** @format */

import * as React from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PermDataSettingRoundedIcon from '@mui/icons-material/PermDataSettingRounded';
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';

import { save } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { dirname } from '@tauri-apps/api/path';

import { useTranslation } from 'react-i18next';

import { IWaveform, IWaveformOptions } from '../../../../@types/model';
import WaveformConfig from './WaveformConfig';
import useModelConfig from '../../../../stores/Model';
import { colToCSV } from '../../utils';

interface Props {
  waveform: IWaveform;
  waveformOptions: IWaveformOptions[];
}

export default function ToolMenu({ waveform, waveformOptions }: Props): JSX.Element {
  const { t } = useTranslation();
  const { openedFile } = useModelConfig();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [configOpen, setConfigOpen] = React.useState(false);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => setAnchorEl(null), []);

  const openConfig = React.useCallback(() => {
    setConfigOpen(true);
    handleClose();
  }, [handleClose]);

  const handleSaveWaveform = React.useCallback(async (csv: string, path: string) => {
    try {
      const defaultPath = await dirname(path);
      const savePath = await save({ defaultPath, filters: [{ name: 'CSV', extensions: ['csv'] }] });
      if (savePath) {
        await writeTextFile(savePath, csv);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const saveWaveform = React.useCallback(() => {
    if (waveform && openedFile) {
      handleSaveWaveform(colToCSV(waveform), openedFile.path).then(handleClose).catch(console.error);
    }
  }, [waveform, openedFile, handleSaveWaveform, handleClose]);

  const disabled = React.useMemo(() => !waveformOptions || waveformOptions.length === 0, [waveformOptions]);

  return (
    <>
      <Tooltip title={t('More')}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={openConfig} disableRipple disabled={disabled}>
          <PermDataSettingRoundedIcon />
          <ListItemText sx={{ paddingLeft: 1 }}>{t('Chart Config')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={saveWaveform} disableRipple disabled={disabled}>
          <SaveAltRoundedIcon />
          <ListItemText sx={{ paddingLeft: 1 }}>{t('Data Export')}</ListItemText>
        </MenuItem>
      </Menu>
      <WaveformConfig open={configOpen} setOpen={setConfigOpen} waveformOptions={waveformOptions} />
    </>
  );
}
