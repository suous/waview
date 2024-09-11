<!-- @format -->

<div>
  <p align="center">
    <img width="200px" style="margin-top:-10px;margin-bottom:-30px" alt="WaView Logo" src="public/waview.svg">
  </p>
  <h3 align="center">
    Simple And Tiny CSV Waveform Viewer
  </h3>
  <p align="center">
    Built with <a href="https://tauri.app">Tauri</a> and <a href="https://mui.com">MUI</a> to inspect waveforms in CSV files. <br />
    Optimized for minimal size and waveform rendering. 
  </p>
  <img src="docs/static/screen.png" alt="waview-screen" />
</div>

## Features

1. 🦥 Simple: Built with simplicity in mind, less than 2K lines of code.

2. 🐜 Tiny: Optimized for minimal size, less than 2M bundle size.

3. 🥷 Customizable: Easy to customize the app and waveform style.

4. 🗿 Multi-language: Support for multiple languages, including English, Chinese.

5. 🛹 Multi-platform: Support for multiple platforms, including Windows, macOS, and Linux.

```bash
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                     1           13           10            1            2
 HTML                    1           16           13            1            2
 Rust                    5          212          185            0           27
 TSX                    17         1398         1235           20          143
 TypeScript              7          254          208           14           32
===============================================================================
 Total                  31         1893         1651           36          206
===============================================================================
```

## How to use

1. Drag a CSV file with columns of numerical values to the app. For example:

```bash
epoch,train_loss,eval_loss,eval_top1,eval_top5
0,6.85080099105835,6.6424625,0.8720000042724609,3.3400000009155275
1,6.17962772505624,4.606329375,14.981999956054688,33.540000026855466
2,5.6329280989510675,3.661601875,28.136000048828127,52.41000006835937
3,5.105638538088117,3.17984125,36.43999999023438,61.622000014648435
4,4.978073426655361,2.793064375,43.54799995605469,68.5580000366211
5,4.5689898899623325,2.530873125,47.813999946289066,73.12199998535156
```

### Shortcuts

| Shortcut                          | Action                 |
| --------------------------------- | ---------------------- |
| ⌘ + , (Ctrl + , on Windows/Linux) | Open Preferences       |
| ⌘ + N (Ctrl + N on Windows/Linux) | Toggle Split Waveforms |
| ⌘ + O (Ctrl + O on Windows/Linux) | Open Files             |
| ⌘ + D (Ctrl + D on Windows/Linux) | Display Imported Files |

## Why build this?

1. ⛷️ Learn: Learn about [Tauri](https://tauri.app), [React](https://react.dev), [Rust](https://www.rust-lang.org), and Modern APP development lifecycle.

2. 🔭 Explore: Explore some CSV files I have.

3. 🤷‍♂️ I have no idea.

## Limitations

1. 🏕️ Only support naive CSV files with numerical columns.

2. 🧟‍♂️ Performance is limited with a huge number of data points.

3. 🏗️ Lack of strong typing and test coverage.
