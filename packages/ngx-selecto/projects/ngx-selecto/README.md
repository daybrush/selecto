
<p align="middle" ><img src="https://daybrush.com/selecto/images/logo.png" /></p>
<h2 align="middle">Angular Selecto</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/ngx-selecto" target="_blank"><img src="https://img.shields.io/npm/v/ngx-selecto.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
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
<p align="middle">Angular Selecto is an Angular Component that allows you to select elements in the drag area using the mouse or touch.</p>

<p align="middle">
    <a href="https://daybrush.com/selecto" target="_blank"><strong>Demo</strong></a> /
    <a href="https://daybrush.com/selecto/release/latest/doc/" target="_blank"><strong>API</strong></a> /
    <a href="https://github.com/daybrush/scena" target="_blank"><strong>Main Project</strong></a>
</p>

## ⚙️ Installation
### npm
```bash
$ npm install ngx-selecto
```

## 🚀 How to use
```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxSelectoComponent, NgxSelectoModule } from "ngx-selecto";

@NgModule({
  declarations: [
    AppComponent,
    NgxSelectoComponent,
  ],
  imports: [
    BrowserModule,
    // NgxSelectoModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### Template
```html
<ngx-selecto
    [container]="document.body"
    dragContainer=".elements"
    [selectableTargets]='[".target", document.querySelector(".target2")]'
    [selectByClick]="true"
    [selectFromInside]="true"
    [continueSelect]="false"
    [toggleContinueSelect]="'shift'"
    [keyContainer]="window"
    [hitRate]="100"
    (dragStart)="onDragStart($event)"
    (selectStart)="onSelectStart($event)"
    (select)="onSelect($event)"
    (selectEnd)="onSelectEnd($event)"
></ngx-selecto>
```

## ⚙️ Developments
### `ng serve`

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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

