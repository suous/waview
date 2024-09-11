/** @format */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import { IWaveformOptions } from '../../../../@types/model';
import useModelConfig from '../../../../stores/Model';
import CustomDialog from '../../../components/CustomDialog';
import ChartConfig from './ChartConfig';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  waveformOptions: IWaveformOptions[];
}

export default function WaveformConfig({ open, setOpen, waveformOptions }: Props): JSX.Element {
  const { t } = useTranslation();
  const { updateWaveformOptions } = useModelConfig();

  const handleCancel = React.useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  const handleEnsure = React.useCallback((): void => {
    updateWaveformOptions(waveformOptions);
    handleCancel();
  }, [updateWaveformOptions, waveformOptions, handleCancel]);

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
