/** @format */

import { CommonElementOptions } from 'chart.js';
import { PaletteMode } from '@mui/material';

export type IWaveform = Record<string, number[]>;

export interface IFile {
  readonly name: string;
  readonly path: string;
}

export interface IWaveformOptions extends CommonElementOptions {
  readonly label: string;
  lineStyle: string;
}

export type ThemeMode = PaletteMode | 'system';
