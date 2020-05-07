/*
Copyright (c) 2020 Daybrush
name: selecto
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/selecto.git
version: 1.0.3
*/
'use strict';

var Component = require('@egjs/component');
var Dragger = require('@daybrush/drag');
var frameworkUtils = require('framework-utils');
var utils = require('@daybrush/utils');
var ChildrenDiffer = require('@egjs/children-differ');
var DragScroll = require('@scena/dragscroll');
var KeyController = require('keycon');
var styled = require('css-styled');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function getClient(e) {
  if ("touches" in e) {
    var touch = e.touches[0];
    return {
      clientX: touch.clientX,
      clientY: touch.clientY
    };
  } else {
    return {
      clientX: e.clientX,
      clientY: e.clientY
    };
  }
}
function createElement(jsx, prevTarget, container) {
  var tag = jsx.tag,
      children = jsx.children,
      attributes = jsx.attributes,
      className = jsx.className,
      style = jsx.style;
  var el = prevTarget || document.createElement(tag);

  for (var name in attributes) {
    el.setAttribute(name, attributes[name]);
  }

  var elChildren = el.children;
  children.forEach(function (child, i) {
    createElement(child, elChildren[i], el);
  });

  if (className) {
    className.split(" ").forEach(function (name) {
      if (!utils.hasClass(el, name)) {
        utils.addClass(el, name);
      }
    });
  }

  if (style) {
    var elStyle = el.style;

    for (var name in style) {
      elStyle[name] = style[name];
    }
  }

  if (!prevTarget && container) {
    container.appendChild(el);
  }

  return el;
}
function h(tag, attrs) {
  var children = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    children[_i - 2] = arguments[_i];
  }

  var _a = attrs || {},
      _b = _a.className,
      className = _b === void 0 ? "" : _b,
      _c = _a.style,
      style = _c === void 0 ? {} : _c,
      attributes = __rest(_a, ["className", "style"]);

  return {
    tag: tag,
    className: className,
    style: style,
    attributes: attributes,
    children: children
  };
}
function diffValue(prev, cur, func) {
  if (prev !== cur) {
    func(prev, cur);
  }
}

var injector = styled("\n:host {\n    position: fixed;\n    display: none;\n    border: 1px solid #4af;\n    background: rgba(68, 170, 255, 0.5);\n    z-index: 100;\n}\n");
/**
 * @memberof Selecto
 */

var CLASS_NAME = "selecto-selection " + injector.className;
/**
 * @memberof Selecto
 */

var OPTIONS = [// ignore target, container,
"dragContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "toggleContinueSelect", "keyContainer", "hitRate", "scrollOptions"];
var OPTION_TYPES = {
  target: null,
  container: null,
  dragContainer: null,
  selectableTargets: Array,
  selectByClick: Boolean,
  selectFromInside: Boolean,
  continueSelect: Boolean,
  toggleContinueSelect: Array,
  keyContainer: null,
  hitRate: Number,
  scrollOptions: Object
};
var PROPERTIES = ["selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "toggleContinueSelect", "keyContainer", "hitRate", "scrollOptions"];
/**
 * @memberof Selecto
 */

var EVENTS = ["dragStart", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll"];
/**
 * @memberof Selecto
 */

var METHODS = ["clickTarget", "setSelectedTargets"];

/**
 * Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.
 * @sort 1
 * @extends eg.Component
 */

var Selecto =
/*#__PURE__*/
function (_super) {
  __extends(Selecto, _super);
  /**
   *
   */


  function Selecto(options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this) || this;

    _this.selectedTargets = [];
    _this.differ = new ChildrenDiffer();
    _this.dragScroll = new DragScroll();

    _this.onDragStart = function (e, clickedTarget) {
      var datas = e.datas,
          clientX = e.clientX,
          clientY = e.clientY,
          inputEvent = e.inputEvent;
      var _a = _this.options,
          continueSelect = _a.continueSelect,
          selectFromInside = _a.selectFromInside,
          selectByClick = _a.selectByClick;

      var selectableTargets = _this.getSelectableTargets();

      var selectableRects = selectableTargets.map(function (target) {
        var rect = target.getBoundingClientRect();
        var left = rect.left,
            top = rect.top,
            width = rect.width,
            height = rect.height;
        return {
          left: left,
          top: top,
          right: left + width,
          bottom: top + height
        };
      });
      datas.selectableTargets = selectableTargets;
      datas.selectableRects = selectableRects;
      datas.startSelectedTargets = _this.selectedTargets;
      var pointTarget = clickedTarget || document.elementFromPoint(clientX, clientY);

      var firstPassedTargets = _this.hitTest({
        left: clientX,
        top: clientY,
        right: clientX,
        bottom: clientY
      }, clientX, clientY, selectableTargets, selectableRects).filter(function (target) {
        return target === pointTarget || target.contains(pointTarget);
      });

      var hasInsideTargets = firstPassedTargets.length > 0;
      var isPreventSelect = !selectFromInside && hasInsideTargets;

      if (isPreventSelect && !selectByClick) {
        return false;
      }

      if (!continueSelect) {
        _this.selectedTargets = [];
      } else {
        firstPassedTargets = _this.getSelectedTargets(firstPassedTargets);
      }

      var type = inputEvent.type;
      var isTrusted = type === "mousedown" || type === "touchstart";
      /**
       * When the drag starts, the dragStart event is called.
       * Call the stop () function if you have a specific element or don't want to raise a select
       * @memberof Selecto
       * @event dragStart
       * @param {OnDragStart} - Parameters for the dragStart event
       * @example
       * import Selecto from "selecto";
       *
       * const selecto = new Selecto({
       *   container: document.body,
       *   selectByClick: true,
       *   selectFromInside: false,
       * });
       *
       * selecto.on("dragStart", e => {
       *   if (e.inputEvent.target.tagName === "SPAN") {
       *     e.stop();
       *   }
       * }).on("select", e => {
       *   e.added.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.removed.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * });
       */

      var result = isTrusted ? _this.trigger("dragStart", e) : true;

      if (!result) {
        return false;
      }

      _this.select(firstPassedTargets, inputEvent, true);

      datas.startX = clientX;
      datas.startY = clientY;
      datas.selectedTargets = firstPassedTargets;
      _this.target.style.cssText += "left:" + clientX + "px;top:" + clientY + "px";

      if (isPreventSelect && selectByClick) {
        _this.onDragEnd(e);

        inputEvent.preventDefault();
        return false;
      } else {
        if (type === "touchstart") {
          inputEvent.preventDefault();
        }

        var scrollOptions = _this.options.scrollOptions;

        if (scrollOptions && scrollOptions.container) {
          _this.dragScroll.dragStart(e, scrollOptions);
        }

        return true;
      }
    };

    _this.onDrag = function (e) {
      var scrollOptions = _this.options.scrollOptions;

      if (scrollOptions && scrollOptions.container) {
        if (_this.dragScroll.drag(e, scrollOptions)) {
          return;
        }
      }

      _this.check(e);
    };

    _this.onDragEnd = function (_a) {
      var datas = _a.datas,
          inputEvent = _a.inputEvent;

      _this.dragScroll.dragEnd();

      _this.target.style.cssText += "display: none;";

      _this.selecteEnd(datas.startSelectedTargets, datas.selectedTargets, inputEvent);

      _this.selectedTargets = datas.selectedTargets;
    };

    _this.onKeyDown = function (e) {
      if (!_this.sameCombiKey(e)) {
        return;
      }

      _this.continueSelect = true;
      /**
       * When you keydown the key you specified in toggleContinueSelect, the keydown event is called.
       * @memberof Selecto
       * @event keydown
       * @example
       * import Selecto from "selecto";
       *
       * const selecto = new Selecto({
       *   container: document.body,
       *   toggleContinueSelect: "shift";
       *   keyContainer: window,
       * });
       *
       * selecto.on("keydown", () => {
       *   document.querySelector(".button").classList.add("selected");
       * }).on("keyup", () => {
       *   document.querySelector(".button").classList.remove("selected");
       * }).on("select", e => {
       *   e.added.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.removed.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * });
       */

      _this.trigger("keydown", {});
    };

    _this.onKeyUp = function (e) {
      if (!_this.sameCombiKey(e)) {
        return;
      }

      _this.continueSelect = false;
      /**
       * When you keyup the key you specified in toggleContinueSelect, the keyup event is called.
       * @memberof Selecto
       * @event keyup
       * @example
       * import Selecto from "selecto";
       *
       * const selecto = new Selecto({
       *   container: document.body,
       *   toggleContinueSelect: "shift";
       *   keyContainer: window,
       * });
       *
       * selecto.on("keydown", () => {
       *   document.querySelector(".button").classList.add("selected");
       * }).on("keyup", () => {
       *   document.querySelector(".button").classList.remove("selected");
       * }).on("select", e => {
       *   e.added.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.removed.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * });
       */

      _this.trigger("keyup", {});
    };

    _this.onBlur = function () {
      if (_this.toggleContinueSelect && _this.continueSelect) {
        _this.trigger("keyup", {});
      }
    };

    _this.onDocumentSelectStart = function (e) {
      if (!_this.dragger.isFlag()) {
        return;
      }

      var dragContainer = _this.dragContainer;

      if (dragContainer === window) {
        dragContainer = document.documentElement;
      }

      var containers = [].slice.call(dragContainer);
      containers.some(function (container) {
        if (container === e.target || container.contains(e.target)) {
          e.preventDefault();
          return true;
        }
      });
    };

    _this.target = options.target;
    _this.container = options.container;
    _this.options = __assign({
      target: null,
      container: null,
      dragContainer: null,
      selectableTargets: [],
      selectByClick: true,
      selectFromInside: true,
      hitRate: 100,
      continueSelect: false,
      toggleContinueSelect: null,
      keyContainer: null,
      scrollOptions: undefined
    }, options);

    _this.initElement();

    _this.initDragScroll();

    _this.setKeyController();

    return _this;
  }
  /**
   * You can set the currently selected targets.
   */


  var __proto = Selecto.prototype;

  __proto.setSelectedTargets = function (selectedTargets) {
    this.selectedTargets = selectedTargets;
    this.differ = new ChildrenDiffer(selectedTargets);
    return this;
  };

  __proto.setKeyContainer = function (keyContainer) {
    var _this = this;

    var options = this.options;
    diffValue(options.keyContainer, keyContainer, function () {
      options.keyContainer = keyContainer;

      _this.setKeyController();
    });
  };

  __proto.setToggleContinueSelect = function (toggleContinueSelect) {
    var _this = this;

    var options = this.options;
    diffValue(options.toggleContinueSelect, toggleContinueSelect, function () {
      options.toggleContinueSelect = toggleContinueSelect;

      _this.setKeyEvent();
    });
  };
  /**
   * Destroy elements, properties, and events.
   */


  __proto.destroy = function () {
    this.off();
    this.keycon && this.keycon.destroy();
    this.dragger.unset();
    this.injectResult.destroy();
    utils.removeEvent(document, "selectstart", this.onDocumentSelectStart);
    this.keycon = null;
    this.dragger = null;
    this.injectResult = null;
    this.target = null;
    this.container = null;
    this.options = null;
  };
  /**
   * External click or mouse events can be applied to the selecto.
   * @params - Extenal click or mouse event
   * @params - Specify the clicked target directly.
   */


  __proto.clickTarget = function (e, clickedTarget) {
    var _a = getClient(e),
        clientX = _a.clientX,
        clientY = _a.clientY;

    var dragEvent = {
      datas: {},
      clientX: clientX,
      clientY: clientY,
      inputEvent: e
    };

    if (this.onDragStart(dragEvent, clickedTarget)) {
      this.onDragEnd(dragEvent);
    }

    return this;
  };

  __proto.setKeyController = function () {
    var _a = this.options,
        keyContainer = _a.keyContainer,
        toggleContinueSelect = _a.toggleContinueSelect;

    if (this.keycon) {
      this.keycon.destroy();
      this.keycon = null;
    }

    if (toggleContinueSelect) {
      this.keycon = new KeyController(keyContainer || window);
      this.keycon.keydown(this.onKeyDown).keyup(this.onKeyUp).on("blur", this.onBlur);
    }
  };

  __proto.setKeyEvent = function () {
    var toggleContinueSelect = this.options.toggleContinueSelect;

    if (!toggleContinueSelect || this.keycon) {
      return;
    }

    this.setKeyController();
  };

  __proto.initElement = function () {
    this.target = createElement(h("div", {
      className: CLASS_NAME
    }), this.target, this.container);
    var target = this.target;
    var dragContainer = this.options.dragContainer;
    this.dragContainer = typeof dragContainer === "string" ? [].slice.call(document.querySelectorAll(dragContainer)) : this.options.dragContainer || this.target.parentNode;
    this.dragger = new Dragger(this.dragContainer, {
      container: window,
      preventDefault: false,
      dragstart: this.onDragStart,
      drag: this.onDrag,
      dragend: this.onDragEnd
    });
    utils.addEvent(document, "selectstart", this.onDocumentSelectStart);
    this.injectResult = injector.inject(target);
  };

  __proto.hitTest = function (selectRect, clientX, clientY, targets, rects) {
    var _a = this.options,
        hitRate = _a.hitRate,
        selectByClick = _a.selectByClick;
    var left = selectRect.left,
        top = selectRect.top,
        right = selectRect.right,
        bottom = selectRect.bottom;
    var passedTargets = [];
    rects.forEach(function (rect, i) {
      var rectLeft = rect.left,
          rectTop = rect.top,
          rectRight = rect.right,
          rectBottom = rect.bottom;
      var isStart = rectLeft <= clientX && clientX <= rectRight && rectTop <= clientY && clientY <= rectBottom;
      var rectSize = (rectRight - rectLeft) * (rectBottom - rectTop);
      var testLeft = Math.max(rectLeft, left);
      var testRight = Math.min(rectRight, right);
      var testTop = Math.max(rectTop, top);
      var testBottom = Math.min(rectBottom, bottom);

      if (selectByClick && isStart) {
        passedTargets.push(targets[i]);
        return;
      }

      if (testRight < testLeft || testBottom < testTop) {
        return;
      }

      var rate = Math.round((testRight - testLeft) * (testBottom - testTop) / rectSize * 100);

      if (rate >= hitRate) {
        passedTargets.push(targets[i]);
      }
    });
    return passedTargets;
  };

  __proto.initDragScroll = function () {
    var _this = this;

    this.dragScroll.on("scroll", function (_a) {
      var container = _a.container,
          direction = _a.direction;

      _this.trigger("scroll", {
        container: container,
        direction: direction
      });
    }).on("move", function (_a) {
      var offsetX = _a.offsetX,
          offsetY = _a.offsetY,
          inputEvent = _a.inputEvent;
      var datas = inputEvent.datas;
      datas.startX -= offsetX;
      datas.startY -= offsetY;
      datas.selectableRects.forEach(function (rect) {
        rect.top -= offsetY;
        rect.bottom -= offsetY;
        rect.left -= offsetX;
        rect.right -= offsetX;
      });

      _this.dragger.scrollBy(offsetX, offsetY, inputEvent.inputEvent, false);

      inputEvent.distX += offsetX;
      inputEvent.distY += offsetY;

      _this.check(inputEvent);
    });
  };

  __proto.getSelectableTargets = function () {
    var selectableTargets = [];
    this.options.selectableTargets.forEach(function (target) {
      if (utils.isObject(target)) {
        selectableTargets.push(target);
      } else {
        var elements = [].slice.call(document.querySelectorAll(target));
        elements.forEach(function (el) {
          selectableTargets.push(el);
        });
      }
    });
    return selectableTargets;
  };

  __proto.getSelectedTargets = function (passedTargets) {
    var _a = ChildrenDiffer.diff(this.selectedTargets, passedTargets),
        list = _a.list,
        prevList = _a.prevList,
        added = _a.added,
        removed = _a.removed;

    return added.map(function (index) {
      return list[index];
    }).concat(removed.map(function (index) {
      return prevList[index];
    }));
  };

  __proto.select = function (selectedTargets, inputEvent, isStart) {
    var _a = this.differ.update(selectedTargets),
        added = _a.added,
        removed = _a.removed,
        prevList = _a.prevList,
        list = _a.list;

    if (isStart) {
      /**
       * When the select(drag) starts, the selectStart event is called.
       * @memberof Selecto
       * @event selectStart
       * @param {Selecto.OnSelect} - Parameters for the selectStart event
       * @example
       * import Selecto from "selecto";
       *
       * const selecto = new Selecto({
       *   container: document.body,
       *   selectByClick: true,
       *   selectFromInside: false,
       * });
       *
       * selecto.on("selectStart", e => {
       *   e.added.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.removed.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * }).on("selectEnd", e => {
       *   e.afterAdded.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.afterRemoved.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * });
       */
      this.trigger("selectStart", {
        selected: selectedTargets,
        added: added.map(function (index) {
          return list[index];
        }),
        removed: removed.map(function (index) {
          return prevList[index];
        }),
        inputEvent: inputEvent
      });
    }

    if (added.length || removed.length) {
      /**
       * When the select in real time, the select event is called.
       * @memberof Selecto
       * @event select
       * @param {Selecto.OnSelect} - Parameters for the select event
       * @example
       * import Selecto from "selecto";
       *
       * const selecto = new Selecto({
       *   container: document.body,
       *   selectByClick: true,
       *   selectFromInside: false,
       * });
       *
       * selecto.on("select", e => {
       *   e.added.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.removed.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * });
       */
      this.trigger("select", {
        selected: selectedTargets,
        added: added.map(function (index) {
          return list[index];
        }),
        removed: removed.map(function (index) {
          return prevList[index];
        }),
        inputEvent: inputEvent
      });
    }
  };

  __proto.selecteEnd = function (startSelectedTargets, selectedTargets, inputEvent) {
    var _a = ChildrenDiffer.diff(startSelectedTargets, selectedTargets),
        added = _a.added,
        removed = _a.removed,
        prevList = _a.prevList,
        list = _a.list;

    var _b = ChildrenDiffer.diff(this.selectedTargets, selectedTargets),
        afterAdded = _b.added,
        afterRemoved = _b.removed,
        afterPrevList = _b.prevList,
        afterList = _b.list;

    var type = inputEvent.type;
    var isDragStart = type === "mousedown" || type === "touchstart";
    /**
     * When the select(dragEnd or click) ends, the selectEnd event is called.
     * @memberof Selecto
     * @event selectEnd
     * @param {Selecto.OnSelectEnd} - Parameters for the selectEnd event
     * @example
     * import Selecto from "selecto";
     *
     * const selecto = new Selecto({
     *   container: document.body,
     *   selectByClick: true,
     *   selectFromInside: false,
     * });
     *
     * selecto.on("selectStart", e => {
     *   e.added.forEach(el => {
     *     el.classList.add("selected");
     *   });
     *   e.removed.forEach(el => {
     *     el.classList.remove("selected");
     *   });
     * }).on("selectEnd", e => {
     *   e.afterAdded.forEach(el => {
     *     el.classList.add("selected");
     *   });
     *   e.afterRemoved.forEach(el => {
     *     el.classList.remove("selected");
     *   });
     * });
     */

    this.trigger("selectEnd", {
      selected: selectedTargets,
      added: added.map(function (index) {
        return list[index];
      }),
      removed: removed.map(function (index) {
        return prevList[index];
      }),
      afterAdded: afterAdded.map(function (index) {
        return afterList[index];
      }),
      afterRemoved: afterRemoved.map(function (index) {
        return afterPrevList[index];
      }),
      isDragStart: isDragStart,
      inputEvent: inputEvent
    });
  };

  __proto.check = function (e) {
    var distX = e.distX,
        distY = e.distY,
        datas = e.datas,
        inputEvent = e.inputEvent;
    var startX = datas.startX,
        startY = datas.startY;
    var tx = Math.min(0, distX);
    var ty = Math.min(0, distY);
    var width = Math.abs(distX);
    var height = Math.abs(distY);
    this.target.style.cssText += "display: block;" + ("left:" + startX + "px;top:" + startY + "px;") + ("transform: translate(" + tx + "px, " + ty + "px);") + ("width:" + width + "px;height:" + height + "px;");
    var left = startX + tx;
    var top = startY + ty;
    var passedTargets = this.hitTest({
      left: left,
      top: top,
      right: left + width,
      bottom: top + height
    }, datas.startX, datas.startY, datas.selectableTargets, datas.selectableRects);
    var selectedTargets = this.getSelectedTargets(passedTargets);
    this.select(selectedTargets, inputEvent);
    datas.selectedTargets = selectedTargets;
  };

  __proto.sameCombiKey = function (e) {
    var toggleContinueSelect = [].concat(this.options.toggleContinueSelect);
    var combi = KeyController.getCombi(e.inputEvent, e.key);
    return toggleContinueSelect.every(function (key) {
      return combi.indexOf(key) > -1;
    });
  };

  Selecto = __decorate([frameworkUtils.Properties(PROPERTIES, function (prototype, property) {
    var attributes = {
      enumerable: true,
      configurable: true,
      get: function () {
        return this.options[property];
      }
    };
    var setter = utils.camelize("set " + property);

    if (prototype[setter]) {
      attributes.set = function (value) {
        this[setter](value);
      };
    } else {
      attributes.set = function (value) {
        this.options[property] = value;
      };
    }

    Object.defineProperty(prototype, property, attributes);
  })], Selecto);
  return Selecto;
}(Component);



var modules = ({
    __proto__: null,
    'default': Selecto,
    OPTIONS: OPTIONS,
    OPTION_TYPES: OPTION_TYPES,
    PROPERTIES: PROPERTIES,
    EVENTS: EVENTS,
    METHODS: METHODS,
    CLASS_NAME: CLASS_NAME
});

for (var name in modules) {
  Selecto[name] = modules[name];
}

module.exports = Selecto;
//# sourceMappingURL=selecto.cjs.js.map
