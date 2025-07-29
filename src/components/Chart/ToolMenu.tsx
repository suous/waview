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
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { dirname } from '@tauri-apps/api/path';
import { useTranslation } from 'react-i18next';

import { IWaveform, IWaveformOptions } from '@/types/model';
import WaveformConfig from '@/components/Chart/WaveformConfig';
import { ModelContext } from '@/stores/Model';
import { colToCSV } from '@/utils';

interface Props {
  waveform: IWaveform;
  waveformOptions: IWaveformOptions[];
}

export default function ToolMenu({ waveform, waveformOptions }: Props): JSX.Element {
  const { t } = useTranslation();
  const { openedFile } = React.use(ModelContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [configOpen, setConfigOpen] = React.useState(false);

  const handleClose = () => setAnchorEl(null);

  const openConfig = () => {
    setConfigOpen(true);
    handleClose();
  };

  const saveWaveform = async () => {
    if (waveform && openedFile) {
      try {
        const defaultPath = await dirname(openedFile.path);
        const savePath = await save({ defaultPath, filters: [{ name: 'CSV', extensions: ['csv'] }] });
        if (savePath) {
          await writeTextFile(savePath, colToCSV(waveform));
        }
      } catch (error) {
        console.error(error);
      }
      handleClose();
    }
  };

  const disabled = !waveformOptions || waveformOptions.length === 0;
  return (
    <>
      <Tooltip title={t('More')}>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
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
