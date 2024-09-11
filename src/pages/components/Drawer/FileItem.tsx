/** @format */

import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { invoke } from '@tauri-apps/api';
import { confirm } from '@tauri-apps/api/dialog';
import { useTranslation } from 'react-i18next';

import { IFile, IWaveform } from '../../../@types/model';
import useModelConfig from '../../../stores/Model';
import useViewConfig from '../../../stores/View';

interface Props {
  file: IFile;
  underAnalysis: boolean;
}

export default function FileItem({ file, underAnalysis }: Props): JSX.Element {
  const { t } = useTranslation();
  const { updateOpenedFile, updateWaveform, deleteFile } = useModelConfig();
  const { updateLoading } = useViewConfig();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const openContextMenu = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleItemClick = React.useCallback(() => {
    if (underAnalysis) return;
    updateLoading(true);
    invoke<IWaveform>('read_csv', { path: file.path })
      .then(res => {
        if (res != null) {
          updateWaveform(res);
          updateOpenedFile(file);
        }
      })
      .catch(console.error)
      .finally(() => updateLoading(false));
  }, [underAnalysis, file, updateLoading, updateWaveform, updateOpenedFile]);

  const handleOpenFolder = React.useCallback(() => {
    invoke('open_folder', { path: file.path })
      .then(() => setAnchorEl(null))
      .catch(console.error);
  }, [file.path]);

  const handleDeleteFile = React.useCallback(() => {
    confirm(
      `${t('Will delete the file from the imported files list, ')}${t('You cannot undo this action.')}`,
      t('Delete the file form the imported file list?')
    )
      .then(res => {
        if (res) deleteFile(file);
      })
      .catch(console.error);
  }, [t, deleteFile, file]);

  return (
    <>
      <ListItemButton
        onContextMenu={openContextMenu}
        dense
        selected={underAnalysis}
        sx={{
          paddingLeft: 2,
          borderLeftColor: underAnalysis ? 'inherit' : 'transparent',
          borderLeftWidth: 2,
          borderLeftStyle: 'solid'
        }}
        onClick={handleItemClick}>
        <ListItemIcon sx={{ minWidth: 24 }}>
          {underAnalysis ? <FileOpenOutlinedIcon /> : <InsertDriveFileOutlinedIcon />}
        </ListItemIcon>
        <ListItemText primary={file.name} />
      </ListItemButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <MenuItem dense onClick={handleOpenFolder}>
          <ListItemIcon>
            <FolderOpenOutlinedIcon />
          </ListItemIcon>
          <ListItemText>{t('Open File Folder')}</ListItemText>
        </MenuItem>
        <MenuItem dense onClick={handleDeleteFile}>
          <ListItemIcon>
            <DeleteOutlinedIcon />
          </ListItemIcon>
          <ListItemText>{t('Delete Imported File')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
