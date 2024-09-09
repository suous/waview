/** @format */

import * as React from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ColorResult, SketchPicker } from 'react-color';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

import { useTranslation } from 'react-i18next';

import { IWaveformOptions } from '../../../../@types/model';
import { chartConfigs } from '../../utils';

interface State {
  anchorEl: HTMLElement | null;
  colorHexCode: string;
  openLineStyleDialog: boolean;
}

export default function ChartConfig({ waveformOption }: { waveformOption: IWaveformOptions }): JSX.Element {
  const { t } = useTranslation();
  const [lineConfigProps, setLineConfigProps] = React.useState<State>({
    anchorEl: null,
    colorHexCode: waveformOption.borderColor as string,
    openLineStyleDialog: false
  });

  const handleLineStyleChange = (event: SelectChangeEvent<typeof waveformOption.lineStyle>): void => {
    waveformOption.lineStyle = event.target.value;
  };

  const handleLineStyleClose = (): void => {
    setLineConfigProps({ ...lineConfigProps, openLineStyleDialog: false });
  };

  const handleLineStyleOpen = (): void => {
    setLineConfigProps({ ...lineConfigProps, openLineStyleDialog: true });
  };

  const handleColorPickerClose = (): void => {
    setLineConfigProps({ ...lineConfigProps, anchorEl: null });
  };

  const handleChangeColor = (event: React.MouseEvent<HTMLDivElement>): void => {
    setLineConfigProps({ ...lineConfigProps, anchorEl: event.currentTarget });
  };

  const handleColorPickerChoose = (color: ColorResult): void => {
    waveformOption.borderColor = color.hex;
    waveformOption.backgroundColor = color.hex;
    setLineConfigProps({ ...lineConfigProps, colorHexCode: color.hex });
  };

  const handleLineWidthChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    waveformOption.borderWidth = Number(event.target.value);
  };

  return (
    <Stack spacing={2} direction='row' sx={{ alignItems: 'center' }}>
      <Typography>{t('Color')}</Typography>
      <Box
        bgcolor={lineConfigProps.colorHexCode}
        sx={{
          width: 60,
          height: 20,
          borderRadius: 1,
          '&:hover': {
            cursor: 'pointer'
          }
        }}
        onClick={handleChangeColor}
      />
      <Popover
        anchorEl={lineConfigProps.anchorEl}
        open={Boolean(lineConfigProps.anchorEl)}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}>
        <SketchPicker color={lineConfigProps.colorHexCode} onChange={handleColorPickerChoose} />
      </Popover>
      <Typography>{t('Width')}</Typography>
      <TextField
        type='number'
        size='small'
        required
        margin='dense'
        defaultValue={waveformOption.borderWidth}
        sx={{ width: 64 }}
        onChange={handleLineWidthChange}
        inputProps={{
          style: {
            height: 22,
            paddingTop: 1,
            paddingBottom: 1,
            paddingRight: 2,
            paddingLeft: 5
          }
        }}
      />
      <Typography>{t('Style')}</Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          variant='outlined'
          open={lineConfigProps.openLineStyleDialog}
          onClose={handleLineStyleClose}
          onOpen={handleLineStyleOpen}
          value={waveformOption.lineStyle}
          onChange={handleLineStyleChange}
          sx={{ width: 70, height: 24 }}>
          {Array.from(chartConfigs.lineStyles.keys()).map((style, index) => (
            <MenuItem value={style} key={`line-style-${index}`}>
              <Box
                sx={{
                  color: 'inherit',
                  border: 1,
                  borderBlockStyle: style,
                  height: 1,
                  width: 26,
                  marginTop: 1,
                  marginBottom: 1
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
