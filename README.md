
<p align="middle" ><img src="https://daybrush.com/selecto/images/logo.png" /></p>
<h2 align="middle">Selecto.js</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/selecto" target="_blank"><img src="https://img.shields.io/npm/v/selecto.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
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
<p align="middle">Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.</p>

<p align="middle">
    <a href="https://daybrush.com/selecto" target="_blank"><strong>Demo</strong></a> /
    <a href="https://daybrush.com/selecto/release/latest/doc/" target="_blank"><strong>API</strong></a> /
    <a href="https://github.com/daybrush/scena" target="_blank"><strong>Main Project</strong></a>
</p>

## ⚙️ Installation
### npm
```bash
$ npm install selecto
```

### scripts

```html
<script src="//daybrush.com/selecto/release/latest/dist/selecto.min.js"></script>
```

## 🚀 How to use
```js
import Selecto from "selecto";

const selecto = new Selecto({
    // The container to add a selection element
    container: document.body,
    // The area to drag selection element (default: container)
    dragContainer: Element,
    // Targets to select. You can register a queryselector or an Element.
    selectableTargets: [".target", document.querySelector(".target2")],
    // Whether to select by click (default: true)
    selectByClick: true,
    // Whether to select from the target inside (default: true)
    selectFromInside: true,
    // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
    continueSelect: false,
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect: "shift",
    // The container for keydown and keyup events
    keyContainer: window,
    // The rate at which the target overlaps the drag area to be selected. (default: 100)
    hitRate: 100,
});

selecto.on("select", e => {
    e.added.forEach(el => {
        el.classList.add("selected");
    });
    e.removed.forEach(el => {
        el.classList.remove("selected");
    });
});
```

## 📦 Packages
|Package&nbsp;Name|&nbsp;Version&nbsp;|Description|
|---|---|---|
|[**react-selecto**](https://github.com/daybrush/selecto/tree/master/packages/react-selecto)|[![](https://img.shields.io/npm/v/react-selecto.svg?style=flat-square)](https://npmjs.com/package/react-selecto)|A React Selecto Component that allows you to select elements in the drag area using the mouse or touch.|
|[**ngx-selecto**](https://github.com/daybrush/selecto/tree/master/packages/ngx-selecto)|[![](https://img.shields.io/npm/v/ngx-selecto.svg?style=flat-square)](https://npmjs.com/package/ngx-selecto)|An Angular Selecto Component that allows you to select elements in the drag area using the mouse or touch.|
|[**vue-selecto**](https://github.com/daybrush/selecto/tree/master/packages/vue-selecto)|[![](https://img.shields.io/npm/v/vue-selecto.svg?style=flat-square)](https://npmjs.com/package/vue-selecto)|A Vue Selecto Component that allows you to select elements in the drag area using the mouse or touch.|
|[**preact-selecto**](https://github.com/daybrush/selecto/tree/master/packages/preact-selecto)|[![](https://img.shields.io/npm/v/preact-selecto.svg?style=flat-square)](https://npmjs.com/package/preact-selecto)|A Preact Selecto Component that allows you to select elements in the drag area using the mouse or touch.|
|[**svelte-selecto**](https://github.com/daybrush/selecto/tree/master/packages/svelte-selecto)|[![](https://img.shields.io/npm/v/svelte-selecto.svg?style=flat-square)](https://npmjs.com/package/svelte-selecto)|A Svelte Selecto Component that allows you to select elements in the drag area using the mouse or touch.|
|[**lit-selecto**](https://github.com/daybrush/selecto/tree/master/packages/lit-selecto)|[![](https://img.shields.io/npm/v/lit-selecto.svg?style=flat-square)](https://npmjs.com/package/lit-selecto)|A Lit Selecto Component that allows you to select elements in the drag area using the mouse or touch.|


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
