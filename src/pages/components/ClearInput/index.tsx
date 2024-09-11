/** @format */

// @ts-expect-error make eslint happy
import * as React from 'react';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FormControl from '@mui/material/FormControl';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';

interface Props extends Pick<OutlinedInputProps, 'placeholder' | 'onChange' | 'sx'> {
  value: string;
  onClick: () => void;
  sxForm?: SxProps<Theme>;
}

function ClearInput({ value, placeholder, onChange, onClick, sx, sxForm }: Props) {
  return (
    <FormControl fullWidth margin='none' sx={sxForm}>
      <OutlinedInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={sx}
        endAdornment={
          value.length > 0 && (
            <InputAdornment position='end'>
              <IconButton onClick={onClick} edge='end'>
                <CloseRoundedIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </FormControl>
  );
}

ClearInput.defaultProps = {
  sxForm: null
};

export default ClearInput;
