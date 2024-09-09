/** @format */

import { ModelActionType, ModelContextType } from '../@types/context';
import { IWaveformOptions } from '../@types/model';

export const initialState: ModelContextType = {
  files: [],
  openedFile: null,
  addFiles: () => {},
  deleteFile: () => {},
  clearFiles: () => {},
  updateOpenedFile: () => {},
  waveform: {},
  updateWaveform: () => {},
  waveformOptions: [] as IWaveformOptions[],
  addWaveformOptions: () => {},
  updateWaveformOptions: () => {}
};

export default function ModelReducer(state: ModelContextType, { type, payload }: ModelActionType): ModelContextType {
  switch (type) {
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...payload.files] };
    case 'DELETE_FILE':
      return { ...state, files: state.files.filter(file => file.path !== payload.file.path) };
    case 'CLEAR_FILES':
      return { ...state, files: [] };
    case 'UPDATE_OPENED_FILE':
      return { ...state, openedFile: payload.file };
    case 'UPDATE_WAVEFORM':
      return { ...state, waveform: payload.waveform };
    case 'ADD_WAVEFORM_OPTIONS':
      return { ...state, ...payload };
    case 'UPDATE_WAVEFORM_OPTIONS':
      return {
        ...state,
        waveformOptions: state.waveformOptions.map(o => {
          const newOption = payload.waveformOptions.find(c => c.label === o.label);
          return newOption != null ? newOption : o;
        })
      };
    default:
      throw new Error('No case for type found in file meta reducer.');
  }
}
