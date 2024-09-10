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
  const open = Boolean(anchorEl);
  const [configOpen, setConfigOpen] = React.useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const openConfig = (): void => {
    setConfigOpen(true);
    handleClose();
  };

  const handleSaveWaveform = async (csv: string, path: string): Promise<void> => {
    const defaultPath = await dirname(path);
    save({ defaultPath, filters: [{ name: 'CSV', extensions: ['csv'] }] })
      .then(path => {
        if (path != null) {
          writeTextFile(path, csv).catch(console.error);
        }
      })
      .catch(console.error);
  };

  const saveWaveform = (): void => {
    if (waveform != null && openedFile != null) {
      handleSaveWaveform(colToCSV(waveform), openedFile.path).then(handleClose).catch(console.error);
    }
  };

  const disabled = waveformOptions == null || waveformOptions.length === 0;

  return (
    <>
      <Tooltip title={t('More')}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
