
<p align="middle" ><img src="https://daybrush.com/selecto/images/logo.png" /></p>
<h2 align="middle">React Selecto</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/react-selecto" target="_blank"><img src="https://img.shields.io/npm/v/react-selecto.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/selecto/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/selecto.svg?style=flat-square&label=license&color=08CE5D"/></a>
<a href="https://github.com/daybrush/selecto/tree/master/packages/react-selecto" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61daeb"></a>
<a href="https://github.com/daybrush/selecto/tree/master/packages/preact-selecto" target="_blank"><img alt="Preact" src="https://img.shields.io/static/v1.svg?label=&message=Preact&style=flat-square&color=673ab8"></a>
<a href="https://github.com/daybrush/selecto/tree/master/packages/ngx-selecto" target="_blank"><img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38"></a>
<a href="https://github.com/daybrush/selecto/tree/master/packages/vue-selecto" target="_blank"><img
    alt="Vue"
    src="https://img.shields.io/static/v1.svg?label=&message=Vue&style=flat-square&color=3fb984"></a>
<a href="https://github.com/daybrush/selecto/tree/master/packages/svelte-selecto" target="_blank"><img
    alt="Svelte"
    src="https://img.shields.io/static/v1.svg?label=&message=Svelte&style=flat-square&color=C82B38"></a>
<a href="https://github.com/daybrush/selecto/tree/master/packages/lit-selecto" target="_blank"><img
    alt="Lit"
    src="https://img.shields.io/static/v1.svg?label=&message=Lit&style=flat-square&color=4E8EE0"></a>
</p>
<p align="middle">React Selecto is a React component that allows you to select elements in the drag area using the mouse or touch.</p>

<p align="middle">
    <a href="https://daybrush.com/selecto" target="_blank"><strong>Demo</strong></a> /
    <a href="https://daybrush.com/selecto/release/latest/doc/" target="_blank"><strong>API</strong></a> /
    <a href="https://github.com/daybrush/scena" target="_blank"><strong>Main Project</strong></a>
</p>

## ⚙️ Installation
### npm
```bash
$ npm install react-selecto
```

## 🚀 How to use
```tsx
import Selecto from "react-selecto";

<Selecto
    // The container to add a selection element
    container={document.body}
    // The area to drag selection element (default: container)
    dragContainer={window}
    // Targets to select. You can register a queryselector or an Element.
    selectableTargets={[".target", document.querySelector(".target2")]}
    // Whether to select by click (default: true)
    selectByClick={true}
    // Whether to select from the target inside (default: true)
    selectFromInside={true}
    // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
    continueSelect={false}
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect={"shift"}
    // The container for keydown and keyup events
    keyContainer={window}
    // The rate at which the target overlaps the drag area to be selected. (default: 100)
    hitRate={100}
    onSelect={e => {
        e.added.forEach(el => {
            el.classList.add("selected");
        });
        e.removed.forEach(el => {
            el.classList.remove("selected");
        });
    }}
    />
```

## ⚙️ Developments
### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!


## 👏 Contributing

If you have any questions or requests or want to contribute to `selecto` or other packages, please write the [issue](https://github.com/daybrush/selecto/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/selecto/issues) on GitHub.


## 📝 License

This project is [MIT](https://github.com/daybrush/selecto/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2020 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
