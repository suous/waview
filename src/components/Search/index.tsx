/** @format */

import * as React from 'react';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FormControl from '@mui/material/FormControl';

interface Props extends Omit<OutlinedInputProps, 'endAdornment'> {
  onClick: () => void;
  sxForm?: OutlinedInputProps['sx'];
}

export default function Search({ onClick, sxForm = null, ...props }: Props): React.JSX.Element {
  return (
    <FormControl fullWidth margin='none' sx={sxForm}>
      <OutlinedInput
        {...props}
        endAdornment={
          <InputAdornment position='end' sx={{ visibility: props.value ? 'visible' : 'hidden' }}>
            <IconButton onClick={onClick} edge='end'>
              <CloseRoundedIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
