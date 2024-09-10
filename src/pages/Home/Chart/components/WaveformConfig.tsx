/** @format */

// @ts-expect-error make eslint happy
import * as React from 'react';

import Stack from '@mui/material/Stack';

import { useTranslation } from 'react-i18next';

import { IWaveformOptions } from '../../../../@types/model';
import useModelConfig from '../../../../stores/Model';
import CustomDialog from '../../../components/CustomDialog';
import ChartConfig from './ChartConfig';

export default function WaveformConfig({
  open,
  setOpen,
  waveformOptions
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  waveformOptions: IWaveformOptions[];
}): JSX.Element {
  const { t } = useTranslation();
  const { updateWaveformOptions } = useModelConfig();
  const handleCancel = (): void => {
    setOpen(false);
  };

  const handleEnsure = (): void => {
    updateWaveformOptions(waveformOptions);
    handleCancel();
  };

  return (
    <CustomDialog
      open={open}
      handleCancel={handleCancel}
      handleEnsure={handleEnsure}
      title={t('Chart Config')}
      label={t('OK')}>
      <Stack spacing={1} sx={{ width: 430 }}>
        {waveformOptions.map((waveformOption, index) => (
          <ChartConfig key={`waveform_line_config_${index}`} waveformOption={waveformOption} />
        ))}
      </Stack>
    </CustomDialog>
  );
}
