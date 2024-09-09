/** @format */

import { IFile, IWaveform, IWaveformOptions, ThemeMode } from './model';

type GeneralActionType<T extends object> = {
  [Key in keyof T]: { type: Key; payload: T[Key] };
}[keyof T];

export interface ViewContextType {
  drawerOpen: boolean;
  waveformSplit: boolean;
  loading: boolean;
  themeMode: ThemeMode;
  updateDrawerOpen: (drawerOpen: boolean) => void;
  updateWaveformSplit: (waveformSplit: boolean) => void;
  updateLoading: (loading: boolean) => void;
  updateThemeMode: (themeMode: ThemeMode) => void;
}

interface ViewActions {
  UPDATE_DRAWER_OPEN: { drawerOpen: boolean };
  UPDATE_WAVEFORM_SPLIT: { waveformSplit: boolean };
  UPDATE_LOADING: { loading: boolean };
  UPDATE_THEME_MODE: { themeMode: ThemeMode };
}

export type ViewActionType = GeneralActionType<ViewActions>;

export interface ModelContextType {
  files: IFile[];
  openedFile: IFile | null;
  addFiles: (files: IFile[]) => void;
  deleteFile: (file: IFile) => void;
  clearFiles: () => void;
  updateOpenedFile: (file: IFile) => void;
  waveform: IWaveform;
  updateWaveform: (waveform: IWaveform) => void;
  waveformOptions: IWaveformOptions[];
  addWaveformOptions: (options: IWaveformOptions[]) => void;
  updateWaveformOptions: (options: IWaveformOptions[]) => void;
}

interface ModelActions {
  ADD_FILES: { files: IFile[] };
  DELETE_FILE: { file: IFile };
  CLEAR_FILES: null;
  UPDATE_OPENED_FILE: { file: IFile };
  UPDATE_WAVEFORM: { waveform: IWaveform };
  UPDATE_WAVEFORM_OPTIONS: { waveformOptions: IWaveformOptions[] };
  ADD_WAVEFORM_OPTIONS: { waveformOptions: IWaveformOptions[] };
}

export type ModelActionType = GeneralActionType<ModelActions>;
