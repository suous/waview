/** @format */

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import PlaylistRemoveRoundedIcon from '@mui/icons-material/PlaylistRemoveRounded';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { confirm } from '@tauri-apps/plugin-dialog';
import { useTranslation } from 'react-i18next';

import Search from '@/components/Search';
import FileItem from '@/components/Drawer/FileItem';
import { useToggle, drawerWidth } from '@/utils';
import { ViewContext } from '@/stores/View';
import { ModelContext } from '@/stores/Model';

export default function ClippedDrawer(): React.JSX.Element {
  const { t } = useTranslation();
  const { drawer } = React.use(ViewContext);
  const { files, openedFile, clearFiles } = React.use(ModelContext);
  const [filter, setFilter] = React.useState('');
  const [open, toggleOpen] = useToggle(files.length > 0);

  const handleClearFiles = () =>
    confirm(
      `${t('Will clear imported files immediately, ')}${t('You cannot undo this action.')}`,
      t('Clear imported files list?')
    )
      .then(res => res && clearFiles(null))
      .catch(console.error);

  const filteredFiles = files.filter(file => file.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <Drawer
      open={drawer}
      variant='persistent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        minWidth: 'fit-content',
        overflowX: 'auto'
      }}>
      <Box sx={{ minWidth: 'fit-content' }}>
        <Search
          onClick={() => setFilter('')}
          onChange={e => setFilter(e.target.value)}
          value={filter}
          placeholder={t('Search')}
          sxForm={{ paddingLeft: 1, paddingRight: 1, marginTop: 1 }}
          sx={{ height: 34 }}
        />
        <List dense>
          <ListItem
            disablePadding
            secondaryAction={
              <Tooltip title={t('Clear History')} enterDelay={1000}>
                <IconButton edge='end' onClick={handleClearFiles} sx={{ visibility: open ? 'visible' : 'hidden' }}>
                  <PlaylistRemoveRoundedIcon />
                </IconButton>
              </Tooltip>
            }>
            <ListItemButton dense sx={{ paddingLeft: 0 }} disableGutters onClick={toggleOpen}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <ArrowRightRoundedIcon sx={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} />
              </ListItemIcon>
              <ListItemText primary={t('Imported Files')} />
            </ListItemButton>
          </ListItem>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List sx={{ overflowY: 'auto', height: 'calc(100vh - 90px)' }} disablePadding>
              {filteredFiles.map((file, index) => (
                <FileItem key={`${file.name}-${index}`} file={file} underAnalysis={file.path === openedFile?.path} />
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
}
