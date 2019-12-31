
<p align="middle" >Logo</p>
<h2 align="middle">Selecto.js</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/selecto" target="_blank"><img src="https://img.shields.io/npm/v/selecto.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/selecto/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/selecto.svg?style=flat-square&label=license&color=08CE5D"/></a>
</p>
<p align="middle">Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.</p>

## 📄 API Documents
* [API documentation](https://daybrush.com/selecto/release/latest/doc/)

## ⚙️ Installation
### npm
```bash
$ npm install selecto
```

### scripts

```html
<script src="//daybrush.com/selecto/release/latest/dist/selecto.pkgd.min.js"></script>
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
    continueSelect: false;
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect: "shift",
    // The container for keydown and keyup events
    keyContainer: window,
    // The rate at which the target overlaps the drag area to be selected. (default: 100)
    hitRate: number;
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

Copyright (c) 2019 Daybrush

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