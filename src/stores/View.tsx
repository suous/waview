/** @format */

import * as React from 'react';
import { ViewActionType, ViewContextType } from '@/types/view';
import { useActionCreator } from '@/stores/Action';

const initialState: ViewContextType = {
  preference: false,
  drawer: false,
  split: false,
  loading: false,
  theme: 'system',
  updatePreference: () => {},
  updateDrawer: () => {},
  updateSplit: () => {},
  updateLoading: () => {},
  updateTheme: () => {}
};

function ViewReducer(state: ViewContextType, action: ViewActionType): ViewContextType {
  return { ...state, [action.type.split('_')[1].toLowerCase()]: action.payload };
}

// eslint-disable-next-line react-refresh/only-export-components
export const ViewContext = React.createContext<ViewContextType>(initialState);

export function ViewProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = React.useReducer(ViewReducer, initialState);
  const createAction = useActionCreator<ViewActionType>(dispatch);
  const value = {
    ...state,
    updatePreference: createAction('UPDATE_PREFERENCE'),
    updateDrawer: createAction('UPDATE_DRAWER'),
    updateSplit: createAction('UPDATE_SPLIT'),
    updateLoading: createAction('UPDATE_LOADING'),
    updateTheme: createAction('UPDATE_THEME')
  };

  return <ViewContext value={value}>{children}</ViewContext>;
}
