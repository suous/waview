/** @format */

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';

type Props = React.PropsWithChildren<{
  open: boolean;
  title: string;
  label: string;
  handleEnsure: () => void;
  handleCancel: () => void;
  sx?: SxProps<Theme>;
}>;

export default function Modal({ open, title, label, children, handleEnsure, handleCancel, sx = null }: Props): React.JSX.Element {
  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle sx={{ p: 1.5 }}>
        {title}
        <IconButton onClick={handleCancel} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={sx}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleEnsure}>
          {label}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
