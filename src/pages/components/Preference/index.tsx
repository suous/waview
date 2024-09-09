/** @format */

import * as React from 'react';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

import { listen } from '@tauri-apps/api/event';
import { useTranslation } from 'react-i18next';

import { ThemeMode } from '../../../@types/model';
import useViewConfig from '../../../stores/ViewContext';

export default function Preference(): JSX.Element {
  const { t, i18n } = useTranslation();
  const { themeMode, updateThemeMode } = useViewConfig();
  const [language, setLanguage] = React.useState('zh');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenPreference = () => setOpen(true);

    listen('main-open-preference', handleOpenPreference)
      .then(close => {
        return () => {
          close();
        };
      })
      .catch(console.error);
  }, []);

  const handleCancel = (): void => {
    setOpen(false);
  };

  const handleLanguageChange = async (event: SelectChangeEvent): Promise<void> => {
    try {
      await i18n.changeLanguage(event.target.value);
      setLanguage(event.target.value);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleThemeMode = (_: React.MouseEvent<HTMLElement>, newThemeMode: ThemeMode | null): void => {
    if (newThemeMode != null) {
      updateThemeMode(newThemeMode);
    }
  };

  return (
    <Drawer anchor='right' open={open} onClose={handleCancel}>
      <DialogTitle sx={{ p: 1.5 }}>
        <Typography variant='h6'>{t('Preference')}</Typography>
        <IconButton onClick={handleCancel} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography>{t('Mode')}</Typography>
        <ToggleButtonGroup value={themeMode} exclusive onChange={handleThemeMode}>
          <ToggleButton value='light' aria-label='light mode' sx={{ width: 100 }}>
            <LightModeRoundedIcon />
            <Typography>{t('Light')}</Typography>
          </ToggleButton>
          <ToggleButton value='dark' aria-label='dark mode' sx={{ width: 100 }}>
            <DarkModeRoundedIcon />
            <Typography>{t('Dark')}</Typography>
          </ToggleButton>
          <ToggleButton value='system' aria-label='system mode' sx={{ width: 100 }}>
            <SettingsBrightnessIcon />
            <Typography>{t('System')}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography>{t('Language')}</Typography>
        <FormControl fullWidth>
          <Select variant='outlined' value={language} onChange={handleLanguageChange}>
            <MenuItem value={'zh'}>{t('Chinese')}</MenuItem>
            <MenuItem value={'en'}>{t('English')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Drawer>
  );
}
