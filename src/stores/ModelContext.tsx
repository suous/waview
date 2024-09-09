/** @format */

import * as React from 'react';

import { ModelContextType } from '../@types/context';
import ModelReducer, { initialState } from './ModelReducer';
import { IFile, IWaveform, IWaveformOptions } from '../@types/model';

const ModelContext = React.createContext<ModelContextType>(initialState);

export function ModelProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = React.useReducer(ModelReducer, initialState);

  const addFiles = React.useCallback(
    (files: IFile[]) => {
      dispatch({
        type: 'ADD_FILES',
        payload: {
          files: files.filter(file => !state.files.some(f => f.path === file.path))
        }
      });
    },
    [dispatch, state.files]
  );

  const deleteFile = React.useCallback(
    (file: IFile) => {
      dispatch({
        type: 'DELETE_FILE',
        payload: {
          file
        }
      });
    },
    [dispatch]
  );

  const clearFiles = React.useCallback(() => {
    dispatch({
      type: 'CLEAR_FILES',
      payload: null
    });
  }, [dispatch]);

  const updateOpenedFile = React.useCallback(
    (file: IFile) => {
      dispatch({
        type: 'UPDATE_OPENED_FILE',
        payload: {
          file
        }
      });
    },
    [dispatch]
  );

  const updateWaveform = React.useCallback(
    (waveform: IWaveform) => {
      dispatch({
        type: 'UPDATE_WAVEFORM',
        payload: {
          waveform
        }
      });
    },
    [dispatch]
  );

  const addWaveformOptions = React.useCallback(
    (waveformOptions: IWaveformOptions[]) => {
      dispatch({
        type: 'ADD_WAVEFORM_OPTIONS',
        payload: {
          waveformOptions
        }
      });
    },
    [dispatch]
  );

  const updateWaveformOptions = React.useCallback(
    (waveformOptions: IWaveformOptions[]) => {
      dispatch({
        type: 'UPDATE_WAVEFORM_OPTIONS',
        payload: {
          waveformOptions
        }
      });
    },
    [dispatch]
  );

  const value = {
    files: state.files,
    openedFile: state.openedFile,
    waveform: state.waveform,
    waveformOptions: state.waveformOptions,
    addFiles,
    deleteFile,
    clearFiles,
    updateOpenedFile,
    updateWaveform,
    addWaveformOptions,
    updateWaveformOptions
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export default function useModelConfig(): ModelContextType {
  const context = React.useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within ModelContext');
  }
  return context;
}
