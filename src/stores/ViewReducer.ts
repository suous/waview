/** @format */

import { ViewActionType, ViewContextType } from '../@types/context';

export const initialState: ViewContextType = {
  drawerOpen: false,
  updateDrawerOpen: () => {},
  waveformSplit: true,
  updateWaveformSplit: () => {},
  loading: false,
  updateLoading: () => {},
  themeMode: 'system',
  updateThemeMode: () => {}
};

export default function ViewReducer(state: ViewContextType, { type, payload }: ViewActionType): ViewContextType {
  switch (type) {
    case 'UPDATE_DRAWER_OPEN':
      return { ...state, drawerOpen: payload.drawerOpen };
    case 'UPDATE_WAVEFORM_SPLIT':
      return { ...state, waveformSplit: payload.waveformSplit };
    case 'UPDATE_LOADING':
      return { ...state, loading: payload.loading };
    case 'UPDATE_THEME_MODE':
      return { ...state, themeMode: payload.themeMode };
    default:
      throw new Error('No case for type found in file meta reducer.');
  }
}
