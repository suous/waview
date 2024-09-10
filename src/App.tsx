/** @format */

import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Home from './pages';

import useViewConfig, { ViewProvider } from './stores/View';
import { ModelProvider } from './stores/Model';

const Wrapper = (): JSX.Element => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { theme } = useViewConfig();
  const systemTheme = prefersDarkMode ? 'dark' : 'light';

  const defaultTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme === 'system' ? systemTheme : theme
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
    [systemTheme, theme]
  );

  return (
    <ThemeProvider theme={defaultTheme}>
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
