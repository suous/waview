/** @format */

import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Home from './pages';

import useViewConfig, { ViewProvider } from './stores/ViewContext';
import { ModelProvider } from './stores/ModelContext';

const Wrapper = (): JSX.Element => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { themeMode } = useViewConfig();
  const systemTheme = prefersDarkMode ? 'dark' : 'light';

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode === 'system' ? systemTheme : themeMode
        },
        components: {
          MuiIconButton: {
            defaultProps: {
              size: 'small',
              color: 'inherit'
            }
          },
          MuiButton: {
            defaultProps: {
              size: 'small',
              color: 'inherit'
            }
          },
          MuiSvgIcon: {
            defaultProps: {
              fontSize: 'small'
            }
          },
          MuiFormControl: {
            defaultProps: {
              size: 'small',
              hiddenLabel: true
            }
          }
        }
      }),
    [systemTheme, themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <ModelProvider>
        <Home />
      </ModelProvider>
    </ThemeProvider>
  );
};

export default function App(): JSX.Element {
  return (
    <ViewProvider>
      <Wrapper />
    </ViewProvider>
  );
}
