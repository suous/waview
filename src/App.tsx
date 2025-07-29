/** @format */

import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { emit } from '@tauri-apps/api/event';
import { Menu, MenuItem, Submenu } from '@tauri-apps/api/menu';

import Home from '@/components/Home';
import useViewConfig from '@/stores/View';
import { ModelProvider } from '@/stores/Model';

const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: { mode },
    components: {
      MuiIconButton: { defaultProps: { size: 'small', color: 'inherit' } },
      MuiButton: { defaultProps: { size: 'small', color: 'inherit' } },
      MuiSvgIcon: { defaultProps: { fontSize: 'small' } },
      MuiFormControl: { defaultProps: { size: 'small', hiddenLabel: true } }
    }
  });

async function createMenu() {
  const menu = await Menu.default();
  const items = await menu.items();
  const file = items[1] as Submenu;
  const customs = [
    await MenuItem.new({ id: '__pref', text: 'Preference', accelerator: 'CmdOrCtrl+P', action: emit }),
    await MenuItem.new({ id: '__disp', text: 'Display', accelerator: 'CmdOrCtrl+D', action: emit }),
    await MenuItem.new({ id: '__split', text: 'Split', accelerator: 'CmdOrCtrl+S', action: emit }),
    await MenuItem.new({ id: '__file', text: 'File', accelerator: 'CmdOrCtrl+O', action: emit })
  ];
  await file.prepend(customs);
  await menu.removeAt(items.length - 1); // remove the help menu
  await menu.setAsAppMenu();
}
createMenu().catch(console.error);

export default function App(): React.JSX.Element {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { theme } = useViewConfig();

  const systemTheme = prefersDarkMode ? 'dark' : 'light';
  const defaultTheme = createAppTheme(theme === 'system' ? systemTheme : theme);

  return (
    <ThemeProvider theme={defaultTheme}>
      <ModelProvider>
        <Home />
      </ModelProvider>
    </ThemeProvider>
  );
}
