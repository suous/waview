/** @format */

import * as React from 'react';
import { ViewActionType, ViewContextType } from '../@types/view';
import { createActionCreator, useConfig } from './Action';

const initialState: ViewContextType = {
  drawer: false,
  split: true,
  loading: false,
  theme: 'system',
  updateDrawer: () => {},
  updateSplit: () => {},
  updateLoading: () => {},
  updateTheme: () => {}
};

function ViewReducer(state: ViewContextType, action: ViewActionType): ViewContextType {
  return { ...state, [action.type.split('_')[1].toLowerCase()]: action.payload };
}

const ViewContext = React.createContext<ViewContextType>(initialState);

export function ViewProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = React.useReducer(ViewReducer, initialState);
  const createAction = createActionCreator<ViewActionType>(dispatch);
  const value = {
    ...state,
    updateDrawer: createAction('UPDATE_DRAWER'),
    updateSplit: createAction('UPDATE_SPLIT'),
    updateLoading: createAction('UPDATE_LOADING'),
    updateTheme: createAction('UPDATE_THEME')
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export default function useViewConfig(): ViewContextType {
  return useConfig(ViewContext, 'view');
}
