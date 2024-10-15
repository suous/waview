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
import { useTranslation } from 'react-i18next';
import { listen } from '@tauri-apps/api/event';

import { ThemeMode } from '@/types/view';
import useViewConfig from '@/stores/View';

export default function Preference(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const { theme, updateTheme, preference, updatePreference } = useViewConfig();
  const [language, setLanguage] = React.useState('en');

  React.useEffect(() => {
    const preferencePromise = listen(`__pref`, () => updatePreference(!preference));
    return () => {
      preferencePromise.then(unsubscribe => unsubscribe()).catch(console.error);
    };
  }, [preference, updatePreference]);

  const handleCancel = () => updatePreference(false);

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
      updateTheme(newThemeMode);
    }
  };

  const themeOptions = [
    { label: 'light', icon: LightModeRoundedIcon },
    { label: 'dark', icon: DarkModeRoundedIcon },
    { label: 'system', icon: SettingsBrightnessIcon }
  ];

  return (
    <Drawer anchor='right' open={preference} onClose={handleCancel}>
      <DialogTitle sx={{ p: 1.5 }}>{t('Preference')}</DialogTitle>
      <IconButton onClick={handleCancel} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Divider />
      <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography>{t('Mode')}</Typography>
        <ToggleButtonGroup value={theme} exclusive onChange={handleThemeMode}>
          {themeOptions.map(({ label, icon: Icon }) => (
            <ToggleButton key={label} value={label} aria-label={`${label} mode`} sx={{ width: 100 }}>
              <Icon />
              <Typography variant='inherit'>{t(label.charAt(0).toUpperCase() + label.slice(1))}</Typography>
            </ToggleButton>
          ))}
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
