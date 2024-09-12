/** @format */

import * as React from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@mui/material/styles/styled';
import { listen } from '@tauri-apps/api/event';

import Main from './Home';
import Drawer from './components/Drawer';
import Preference from './components/Preference';
import useViewConfig from '../stores/View';
import { drawerWidth } from './constants';

const Container = styled('main', { shouldForwardProp: prop => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  marginLeft: open ? 0 : `-${drawerWidth}px`,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing[open ? 'easeOut' : 'sharp'],
    duration: theme.transitions.duration[open ? 'enteringScreen' : 'leavingScreen']
  })
}));

export default function Home(): JSX.Element {
  const { drawer, updateDrawer, loading } = useViewConfig();
  React.useEffect(() => {
    const displayListener = listen('main-toggle-display-files', () => {
      updateDrawer(!drawer);
    }).catch(console.error);

    return () => {
      displayListener
        .then(close => {
          if (close != null) {
            close();
          }
        })
        .catch(console.error);
    };
  }, [drawer, updateDrawer]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer />
      <Container open={drawer}>
        <Main />
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Preference />
    </Box>
  );
}
