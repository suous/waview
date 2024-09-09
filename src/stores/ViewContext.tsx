/** @format */

import * as React from 'react';

import { ViewContextType } from '../@types/context';
import ViewReducer, { initialState } from './ViewReducer';
import { ThemeMode } from '../@types/model';

const ViewContext = React.createContext<ViewContextType>(initialState);

export function ViewProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = React.useReducer(ViewReducer, initialState);

  const updateDrawerOpen = React.useCallback(
    (drawerOpen: boolean) => {
      dispatch({
        type: 'UPDATE_DRAWER_OPEN',
        payload: {
          drawerOpen
        }
      });
    },
    [dispatch]
  );

  const updateWaveformSplit = React.useCallback(
    (waveformSplit: boolean) => {
      dispatch({
        type: 'UPDATE_WAVEFORM_SPLIT',
        payload: {
          waveformSplit
        }
      });
    },
    [dispatch]
  );

  const updateLoading = React.useCallback(
    (loading: boolean) => {
      dispatch({
        type: 'UPDATE_LOADING',
        payload: {
          loading
        }
      });
    },
    [dispatch]
  );

  const updateThemeMode = React.useCallback(
    (themeMode: ThemeMode) => {
      dispatch({
        type: 'UPDATE_THEME_MODE',
        payload: {
          themeMode
        }
      });
    },
    [dispatch]
  );

  const value = {
    drawerOpen: state.drawerOpen,
    waveformSplit: state.waveformSplit,
    loading: state.loading,
    themeMode: state.themeMode,
    updateDrawerOpen,
    updateWaveformSplit,
    updateLoading,
    updateThemeMode
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export default function useViewConfig(): ViewContextType {
  const context = React.useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within ViewContext');
  }
  return context;
}
