/** @format */

import * as React from 'react';
import { ModelContextType, ModelActionType } from '@/types/model';
import { useActionCreator, useConfig } from '@/stores/Action.tsx';

const initialState: ModelContextType = {
  files: [],
  openedFile: null,
  waveform: {},
  waveformOptions: [],
  addFiles: () => {},
  deleteFile: () => {},
  clearFiles: () => {},
  updateOpenedFile: () => {},
  updateWaveform: () => {},
  addWaveformOptions: () => {},
  updateWaveformOptions: () => {}
};

function ModelReducer(state: ModelContextType, action: ModelActionType): ModelContextType {
  switch (action.type) {
    case 'ADD_FILES':
      return {
        ...state,
        files: [...state.files, ...action.payload].filter((file, index, self) => {
          return index === self.findIndex(t => t.path === file.path);
        })
      };
    case 'DELETE_FILE':
      return { ...state, files: state.files.filter(file => file.path !== action.payload.path) };
    case 'CLEAR_FILES':
      return { ...state, files: [] };
    case 'UPDATE_OPENED_FILE':
      return { ...state, openedFile: action.payload };
    case 'UPDATE_WAVEFORM':
      return { ...state, waveform: action.payload };
    case 'ADD_WAVEFORM_OPTIONS':
      return {
        ...state,
        waveformOptions: [...state.waveformOptions, ...action.payload].filter((option, index, self) => {
          return index === self.findIndex(t => t.label === option.label);
        })
      };
    case 'UPDATE_WAVEFORM_OPTIONS':
      return {
        ...state,
        waveformOptions: state.waveformOptions.map(o => {
          const newOption = action.payload.find(c => c.label === o.label);
          return newOption ?? o;
        })
      };
    default:
      throw new Error('No case for type found in file meta reducer.');
  }
}

const ModelContext = React.createContext<ModelContextType>(initialState);

export function ModelProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = React.useReducer(ModelReducer, initialState);
  const createAction = useActionCreator<ModelActionType>(dispatch);

  const value = {
    ...state,
    addFiles: createAction('ADD_FILES'),
    deleteFile: createAction('DELETE_FILE'),
    clearFiles: createAction('CLEAR_FILES'),
    updateOpenedFile: createAction('UPDATE_OPENED_FILE'),
    updateWaveform: createAction('UPDATE_WAVEFORM'),
    addWaveformOptions: createAction('ADD_WAVEFORM_OPTIONS'),
    updateWaveformOptions: createAction('UPDATE_WAVEFORM_OPTIONS')
  };

  return <ModelContext value={value}>{children}</ModelContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useModelConfig(): ModelContextType {
  return useConfig(ModelContext, 'model');
}
