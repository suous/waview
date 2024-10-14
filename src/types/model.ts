/** @format */

import { CommonElementOptions } from 'chart.js';

export type IWaveform = Record<string, number[]>;

export interface IFile {
  readonly name: string;
  readonly path: string;
}

export interface IWaveformOptions extends CommonElementOptions {
  readonly label: string;
  lineStyle: string;
}

export type ModelActionType =
  | { type: 'ADD_FILES'; payload: IFile[] }
  | { type: 'DELETE_FILE'; payload: IFile }
  | { type: 'CLEAR_FILES'; payload: IFile[] | null }
  | { type: 'UPDATE_OPENED_FILE'; payload: IFile }
  | { type: 'UPDATE_WAVEFORM'; payload: IWaveform }
  | { type: 'UPDATE_WAVEFORM_OPTIONS'; payload: IWaveformOptions[] }
  | { type: 'ADD_WAVEFORM_OPTIONS'; payload: IWaveformOptions[] };

export interface ModelContextType {
  files: IFile[];
  openedFile: IFile | null;
  waveform: IWaveform;
  waveformOptions: IWaveformOptions[];
  addFiles: (files: IFile[]) => void;
  deleteFile: (file: IFile) => void;
  clearFiles: (files: IFile[] | null) => void;
  updateOpenedFile: (file: IFile) => void;
  updateWaveform: (waveform: IWaveform) => void;
  addWaveformOptions: (options: IWaveformOptions[]) => void;
  updateWaveformOptions: (options: IWaveformOptions[]) => void;
}
