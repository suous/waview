<!-- @format -->

<div>
  <p align="center">
    <img width="200px" style="margin-top:-10px;margin-bottom:-30px" alt="WaView Logo" src="public/waview.svg">
  </p>
  <h3 align="center">
    Simple And Tiny CSV Waveform Viewer
  </h3>
  <p align="center">
    Built with <a href="https://tauri.app">Tauri 2</a> and <a href="https://mui.com">MUI 6</a> to inspect waveforms in CSV files. <br />
    Optimized for minimal size and waveform rendering. 
  </p>
  <img src="docs/static/screen.png" alt="waview-screen" />
</div>

## Features

1. 🦥 Simple: Built with simplicity in mind, less than 2K lines of code.

2. 🐜 Tiny: Optimized for minimal size, less than 2M bundle size.

3. 🥷 Customizable: Easy to customize the app and waveform style.

4. 🗿 Multi-language: Support for multiple languages, including English, Chinese.

5. 🛹 Cross-platform: Support for multiple platforms, including Windows, macOS, and Linux.

```bash
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 HTML                    1           16           13            1            2
 Rust                    5          132          114            1           17
 TSX                    17         1234         1089           19          126
 TypeScript              7          255          211           14           30
===============================================================================
 Total                  30         1637         1427           35          175
===============================================================================
```

## How to use

1. Drag any CSV file with columns of numerical values to the app. For example:

| epoch | train_loss | eval_loss | eval_top1 | eval_top5 |
| ----- | ---------- | --------- | --------- | --------- |
| 0     | 6.85       | 6.64      | 0.87      | 3.34      |
| 1     | 6.18       | 4.61      | 14.98     | 33.54     |
| 2     | 5.63       | 3.66      | 28.14     | 52.41     |
| 3     | 5.11       | 3.18      | 36.44     | 61.62     |
| 4     | 4.98       | 2.79      | 43.55     | 68.56     |
| 5     | 4.57       | 2.53      | 47.81     | 73.12     |

### Shortcuts

| Shortcut                          | Action                 |
| --------------------------------- | ---------------------- |
| ⌘ + , (Ctrl + , on Windows/Linux) | Open Preferences       |
| ⌘ + N (Ctrl + N on Windows/Linux) | Toggle Split Waveforms |
| ⌘ + O (Ctrl + O on Windows/Linux) | Open Files             |
| ⌘ + D (Ctrl + D on Windows/Linux) | Display Imported Files |

### Development

1. Install tauri [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites).

2. Install [bun](https://bun.sh) package manager.

3. Clone and cd to the repo.

```bash
# clone the repo
git clone https://github.com/suous/waview.git

# cd to the repo
cd waview
```

4. Install dependencies.

```bash
# install dependencies
bun install

# dev
bun run tauri dev

# build
bun run tauri build
```

## Why build this?

1. ⛷️ Learn: Learn about [Tauri](https://tauri.app), [React](https://react.dev), [Rust](https://www.rust-lang.org), and Modern APP development lifecycle.

2. 🔭 Explore: Explore some CSV files I have.

3. 🤷‍♂️ I have no idea.

## Limitations

1. 🏕️ Only support naive CSV files with numerical columns.

2. 🧟‍♂️ Performance is limited with a huge number of data points.

3. 🏗️ Lack of strong typing and test coverage.
