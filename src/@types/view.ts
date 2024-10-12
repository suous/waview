/** @format */

import { PaletteMode } from '@mui/material';

export type ThemeMode = PaletteMode | 'system';

export type ViewActionType =
  | { type: 'UPDATE_PREFERENCE'; payload: boolean }
  | { type: 'UPDATE_DRAWER'; payload: boolean }
  | { type: 'UPDATE_SPLIT'; payload: boolean }
  | { type: 'UPDATE_LOADING'; payload: boolean }
  | { type: 'UPDATE_THEME'; payload: ThemeMode };

export interface ViewContextType {
  preference: boolean;
  drawer: boolean;
  split: boolean;
  loading: boolean;
  theme: ThemeMode;
  updatePreference: (preference: boolean) => void;
  updateDrawer: (drawer: boolean) => void;
  updateSplit: (split: boolean) => void;
  updateLoading: (loading: boolean) => void;
  updateTheme: (theme: ThemeMode) => void;
}
