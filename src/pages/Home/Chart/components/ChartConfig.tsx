/** @format */

import * as React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

import { IWaveformOptions } from '../../../../@types/model';
import { chartConfigs } from '../../utils';

interface Props {
  waveformOption: IWaveformOptions;
}

export default function ChartConfig({ waveformOption }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [colorHexCode, setColorHexCode] = React.useState<string>(waveformOption.borderColor as string);
  const [openLineStyleDialog, setOpenLineStyleDialog] = React.useState<boolean>(false);

  const handleLineStyleChange = (event: SelectChangeEvent) => {
    waveformOption.lineStyle = event.target.value as string;
  };

  const handleColorPickerChoose = (color: ColorResult) => {
    waveformOption.borderColor = waveformOption.backgroundColor = color.hex;
    setColorHexCode(color.hex);
  };

  const handleLineWidthChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    waveformOption.borderWidth = Number(event.target.value);
  };

  return (
    <Stack spacing={2} direction='row' sx={{ alignItems: 'center' }}>
      <Typography>{t('Color')}</Typography>
      <Box
        bgcolor={colorHexCode}
        sx={{
          width: 60,
          height: 20,
          borderRadius: 1,
          '&:hover': {
            cursor: 'pointer'
          }
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
      />
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}>
        <SketchPicker color={colorHexCode} onChange={handleColorPickerChoose} />
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
        slotProps={{
          htmlInput: {
            style: {
              height: 22,
              paddingTop: 1,
              paddingBottom: 1,
              paddingRight: 2,
              paddingLeft: 5
            }
          }
        }}
      />
      <Typography>{t('Style')}</Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          variant='outlined'
          open={openLineStyleDialog}
          onClose={() => setOpenLineStyleDialog(false)}
          onOpen={() => setOpenLineStyleDialog(true)}
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
