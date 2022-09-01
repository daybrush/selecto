/*
Copyright (c) 2020 Daybrush
name: selecto
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/selecto.git
version: 1.19.1
*/
'use strict';

var EventEmitter = require('@scena/event-emitter');
var Gesto = require('gesto');
var frameworkUtils = require('framework-utils');
var utils = require('@daybrush/utils');
var childrenDiffer = require('@egjs/children-differ');
var DragScroll = require('@scena/dragscroll');
var KeyController = require('keycon');
var overlapArea = require('overlap-area');
var cssToMat = require('css-to-mat');
var styled = require('css-styled');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function getClient(e) {
  if ("touches" in e) {
    var touch = e.touches[0] || e.changedTouches[0];
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
function filterDuplicated(arr) {
  if (typeof Map === "undefined") {
    return arr.filter(function (value, index) {
      return arr.indexOf(value) === index;
    });
  }

  var map = new Map();
  return arr.filter(function (value) {
    if (map.has(value)) {
      return false;
    }

    map.set(value, true);
    return true;
  });
}
function elementFromPoint(clientX, clientY) {
  return document.elementFromPoint && document.elementFromPoint(clientX, clientY) || null;
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
function getRect(e, ratio, boundArea) {
  var _a;

  if (boundArea === void 0) {
    boundArea = e.data.boundArea;
  }

  var _b = e.distX,
      distX = _b === void 0 ? 0 : _b,
      _c = e.distY,
      distY = _c === void 0 ? 0 : _c;
  var _d = e.data,
      startX = _d.startX,
      startY = _d.startY;

  if (ratio > 0) {
    var nextHeight = Math.sqrt((distX * distX + distY * distY) / (1 + ratio * ratio));
    var nextWidth = ratio * nextHeight;
    distX = (distX >= 0 ? 1 : -1) * nextWidth;
    distY = (distY >= 0 ? 1 : -1) * nextHeight;
  }

  var width = Math.abs(distX);
  var height = Math.abs(distY);
  var maxWidth = distX < 0 ? startX - boundArea.left : boundArea.right - startX;
  var maxHeight = distY < 0 ? startY - boundArea.top : boundArea.bottom - startY;
  _a = utils.calculateBoundSize([width, height], [0, 0], [maxWidth, maxHeight], !!ratio), width = _a[0], height = _a[1];
  distX = (distX >= 0 ? 1 : -1) * width;
  distY = (distY >= 0 ? 1 : -1) * height;
  var tx = Math.min(0, distX);
  var ty = Math.min(0, distY);
  var left = startX + tx;
  var top = startY + ty;
  return {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height,
    width: width,
    height: height
  };
}
function getDefaultElementRect(el) {
  var rect = el.getBoundingClientRect();
  var left = rect.left,
      top = rect.top,
      width = rect.width,
      height = rect.height;
  return {
    pos1: [left, top],
    pos2: [left + width, top],
    pos3: [left, top + height],
    pos4: [left + width, top + height]
  };
}
function passTargets(beforeTargets, afterTargets, continueSelectWithoutDeselect) {
  var _a = childrenDiffer.diff(beforeTargets, afterTargets),
      list = _a.list,
      prevList = _a.prevList,
      added = _a.added,
      removed = _a.removed,
      maintained = _a.maintained;

  return __spreadArray(__spreadArray(__spreadArray([], added.map(function (index) {
    return list[index];
  }), true), removed.map(function (index) {
    return prevList[index];
  }), true), continueSelectWithoutDeselect ? maintained.map(function (_a) {
    var nextIndex = _a[1];
    return list[nextIndex];
  }) : [], true);
}

var injector = styled("\n:host {\n    position: fixed;\n    display: none;\n    border: 1px solid #4af;\n    background: rgba(68, 170, 255, 0.5);\n    pointer-events: none;\n    will-change: transform;\n    z-index: 100;\n}\n");
/**
 * @memberof Selecto
 */

var CLASS_NAME = "selecto-selection ".concat(injector.className);
var PROPERTIES = ["boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd"];
/**
 * @memberof Selecto
 */

var OPTIONS = __spreadArray([// ignore target, container,
"dragContainer", "cspNonce", "preventClickEventOnDrag", "preventClickEventOnDragStart", "preventRightClick"], PROPERTIES, true);
var OPTION_TYPES = {
  boundContainer: null,
  portalContainer: null,
  container: null,
  dragContainer: null,
  selectableTargets: Array,
  selectByClick: Boolean,
  selectFromInside: Boolean,
  continueSelect: Boolean,
  toggleContinueSelect: Array,
  toggleContinueSelectWithoutDeselect: Array,
  keyContainer: null,
  hitRate: Number,
  scrollOptions: Object,
  checkInput: Boolean,
  preventDefault: Boolean,
  cspNonce: String,
  ratio: Number,
  getElementRect: Function,
  preventDragFromInside: Boolean,
  rootContainer: Object,
  dragCondition: Function,
  clickBySelectEnd: Boolean,
  continueSelectWithoutDeselect: Boolean,
  preventClickEventOnDragStart: Boolean,
  preventClickEventOnDrag: Boolean
};
/**
 * @memberof Selecto
 */

var EVENTS = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll"];
/**
 * @memberof Selecto
 */

var METHODS = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll"];

/**
 * Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.
 * @sort 1
 * @extends EventEmitter
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
    _this.dragScroll = new DragScroll();

    _this._onDragStart = function (e, clickedTarget) {
      var data = e.data,
          clientX = e.clientX,
          clientY = e.clientY,
          inputEvent = e.inputEvent;
      var _a = _this.options,
          selectFromInside = _a.selectFromInside,
          selectByClick = _a.selectByClick,
          rootContainer = _a.rootContainer,
          boundContainer = _a.boundContainer,
          _b = _a.preventDragFromInside,
          preventDragFromInside = _b === void 0 ? true : _b,
          clickBySelectEnd = _a.clickBySelectEnd,
          dragCondition = _a.dragCondition;

      if (dragCondition && !dragCondition(e)) {
        e.stop();
        return;
      }

      data.data = {};
      data.innerWidth = window.innerWidth;
      data.innerHeight = window.innerHeight;

      _this.findSelectableTargets(data);

      data.startSelectedTargets = _this.selectedTargets;
      data.scaleMatrix = cssToMat.createMatrix();
      data.containerX = 0;
      data.containerY = 0;
      var boundArea = {
        left: -Infinity,
        top: -Infinity,
        right: Infinity,
        bottom: Infinity
      };

      if (rootContainer) {
        var containerRect = _this.container.getBoundingClientRect();

        data.containerX = containerRect.left;
        data.containerY = containerRect.top;
        data.scaleMatrix = cssToMat.getDistElementMatrix(_this.container, rootContainer);
      }

      if (boundContainer) {
        var boundInfo = utils.isObject(boundContainer) && "element" in boundContainer ? __assign({
          left: true,
          top: true,
          bottom: true,
          right: true
        }, boundContainer) : {
          element: boundContainer,
          left: true,
          top: true,
          bottom: true,
          right: true
        };
        var boundElement = boundInfo.element;
        var rectElement = void 0;

        if (boundElement) {
          if (utils.isString(boundElement)) {
            rectElement = document.querySelector(boundElement);
          } else if (boundElement === true) {
            rectElement = _this.container;
          } else {
            rectElement = boundElement;
          }

          var rect = rectElement.getBoundingClientRect();

          if (boundInfo.left) {
            boundArea.left = rect.left;
          }

          if (boundInfo.top) {
            boundArea.top = rect.top;
          }

          if (boundInfo.right) {
            boundArea.right = rect.right;
          }

          if (boundInfo.bottom) {
            boundArea.bottom = rect.bottom;
          }
        }
      }

      data.boundArea = boundArea;
      var hitRect = {
        left: clientX,
        top: clientY,
        right: clientX,
        bottom: clientY,
        width: 0,
        height: 0
      };
      var firstPassedTargets = [];

      if (!selectFromInside || selectByClick && !clickBySelectEnd) {
        var pointTarget = _this._findElement(clickedTarget || elementFromPoint(clientX, clientY), data.selectableTargets);

        firstPassedTargets = pointTarget ? [pointTarget] : [];
      }

      var hasInsideTargets = firstPassedTargets.length > 0;
      var isPreventSelect = !selectFromInside && hasInsideTargets; // prevent drag from inside when selectByClick is false

      if (isPreventSelect && !selectByClick) {
        e.stop();
        return false;
      }

      var type = inputEvent.type;
      var isTrusted = type === "mousedown" || type === "touchstart";
      /**
       * When the drag starts (triggers on mousedown or touchstart), the dragStart event is called.
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

      var result = !e.isClick && isTrusted ? _this.emit("dragStart", __assign(__assign({}, e), {
        data: data.data
      })) : true;

      if (!result) {
        e.stop();
        return false;
      }

      if (_this.continueSelect) {
        firstPassedTargets = passTargets(_this.selectedTargets, firstPassedTargets, _this.continueSelectWithoutDeselect);
        data.startPassedTargets = _this.selectedTargets;
      } else {
        data.startPassedTargets = [];
      }

      _this._select(_this.selectedTargets, firstPassedTargets, hitRect, e, true);

      data.startX = clientX;
      data.startY = clientY;
      data.selectFlag = false;
      data.preventDragFromInside = false;
      var offsetPos = cssToMat.calculateMatrixDist(data.scaleMatrix, [clientX - data.containerX, clientY - data.containerY]);
      data.boundsArea = _this.target.style.cssText += "position: ".concat(rootContainer ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(offsetPos[0], "px, ").concat(offsetPos[1], "px)");

      if (isPreventSelect && selectByClick && !clickBySelectEnd) {
        inputEvent.preventDefault(); // prevent drag from inside when selectByClick is true and force call `selectEnd`

        if (preventDragFromInside) {
          _this._selectEnd(data.startSelectedTargets, data.startPassedTargets, hitRect, e);

          data.preventDragFromInside = true;
        }
      } else {
        data.selectFlag = true;

        if (type === "touchstart") {
          inputEvent.preventDefault();
        }

        var scrollOptions = _this.options.scrollOptions;

        if (scrollOptions && scrollOptions.container) {
          _this.dragScroll.dragStart(e, scrollOptions);
        }

        if (clickBySelectEnd) {
          data.selectFlag = false;
          e.preventDrag();
        }
      }

      return true;
    };

    _this._onDrag = function (e) {
      if (e.data.selectFlag) {
        var scrollOptions = _this.scrollOptions; // If it is a scrolling position, pass drag

        if ((scrollOptions === null || scrollOptions === void 0 ? void 0 : scrollOptions.container) && _this.dragScroll.drag(e, scrollOptions)) {
          return;
        }
      }

      _this._checkSelected(e);
    };

    _this._onDragEnd = function (e) {
      var data = e.data,
          inputEvent = e.inputEvent;
      var rect = getRect(e, _this.options.ratio);
      var selectFlag = data.selectFlag;
      /**
       * When the drag ends (triggers on mouseup or touchend after drag), the dragEnd event is called.
       * @memberof Selecto
       * @event dragEnd
       * @param {OnDragEnd} - Parameters for the dragEnd event
       */

      if (inputEvent) {
        _this.emit("dragEnd", __assign(__assign({
          isDouble: !!e.isDouble,
          isClick: !!e.isClick,
          isDrag: false,
          isSelect: selectFlag
        }, e), {
          data: data.data,
          rect: rect
        }));
      }

      _this.target.style.cssText += "display: none;";

      if (selectFlag) {
        data.selectFlag = false;

        _this.dragScroll.dragEnd();
      } else if (_this.selectByClick && _this.clickBySelectEnd) {
        // only clickBySelectEnd
        var pointTarget = _this._findElement(elementFromPoint(e.clientX, e.clientY), data.selectableTargets);

        _this._select(_this.selectedTargets, pointTarget ? [pointTarget] : [], rect, e);
      }

      if (!data.preventDragFromInside) {
        _this._selectEnd(data.startSelectedTargets, data.startPassedTargets, rect, e);
      }
    };

    _this._onKeyDown = function (e) {
      var options = _this.options;
      var isKeyDown = false;

      if (!_this._keydownContinueSelect) {
        var result = _this._sameCombiKey(e, options.toggleContinueSelect);

        _this._keydownContinueSelect = result;
        isKeyDown = result;
      }

      if (!_this._keydownContinueSelectWithoutDeselection) {
        var result = _this._sameCombiKey(e, options.toggleContinueSelectWithoutDeselect);

        _this._keydownContinueSelectWithoutDeselection = result;
        isKeyDown = isKeyDown || result;
      }

      if (!isKeyDown) {
        return;
      }
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


      _this.emit("keydown", {
        keydownContinueSelect: _this._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: _this._keydownContinueSelectWithoutDeselection
      });
    };

    _this._onKeyUp = function (e) {
      var options = _this.options;
      var isKeyUp = false;

      if (_this._keydownContinueSelect) {
        var result = _this._sameCombiKey(e, options.toggleContinueSelect, true);

        _this._keydownContinueSelect = !result;
        isKeyUp = result;
      }

      if (_this._keydownContinueSelectWithoutDeselection) {
        var result = _this._sameCombiKey(e, options.toggleContinueSelectWithoutDeselect, true);

        _this._keydownContinueSelectWithoutDeselection = !result;
        isKeyUp = isKeyUp || result;
      }

      if (!isKeyUp) {
        return;
      }
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


      _this.emit("keyup", {
        keydownContinueSelect: _this._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: _this._keydownContinueSelectWithoutDeselection
      });
    };

    _this._onBlur = function () {
      if (_this._keydownContinueSelect || _this._keydownContinueSelectWithoutDeselection) {
        _this._keydownContinueSelect = false;
        _this._keydownContinueSelectWithoutDeselection = false;

        _this.emit("keyup", {
          keydownContinueSelect: _this._keydownContinueSelect,
          keydownContinueSelectWithoutDeselection: _this._keydownContinueSelectWithoutDeselection
        });
      }
    };

    _this._onDocumentSelectStart = function (e) {
      if (!_this.gesto.isFlag()) {
        return;
      }

      var dragContainer = _this.dragContainer;

      if (dragContainer === window) {
        dragContainer = document.documentElement;
      }

      var containers = dragContainer instanceof Element ? [dragContainer] : [].slice.call(dragContainer);
      var target = e.target;
      containers.some(function (container) {
        if (container === target || container.contains(target)) {
          e.preventDefault();
          return true;
        }
      });
    };

    _this.target = options.portalContainer;
    var container = options.container;
    _this.options = __assign({
      portalContainer: null,
      container: null,
      dragContainer: null,
      selectableTargets: [],
      selectByClick: true,
      selectFromInside: true,
      clickBySelectEnd: false,
      hitRate: 100,
      continueSelect: false,
      continueSelectWithoutDeselect: false,
      toggleContinueSelect: null,
      toggleContinueSelectWithoutDeselect: null,
      keyContainer: null,
      scrollOptions: undefined,
      checkInput: false,
      preventDefault: false,
      boundContainer: false,
      preventDragFromInside: true,
      dragCondition: null,
      rootContainer: null,
      getElementRect: getDefaultElementRect,
      cspNonce: "",
      ratio: 0
    }, options);
    var portalContainer = _this.options.portalContainer;

    if (portalContainer) {
      container = portalContainer.parentElement;
    }

    _this.container = container || document.body;

    _this.initElement();

    _this.initDragScroll();

    _this.setKeyController();

    return _this;
  }
  /**
   * You can set the currently selected targets.
   *
   */


  var __proto = Selecto.prototype;

  __proto.setSelectedTargets = function (selectedTargets) {
    this.selectedTargets = selectedTargets;
    return this;
  };
  /**
   * You can get the currently selected targets.
   */


  __proto.getSelectedTargets = function () {
    return this.selectedTargets;
  };
  /**
   * `OnDragStart` is triggered by an external event.
   * @param - external event
   * @example
   * import Selecto from "selecto";
   *
   * const selecto = new Selecto();
   *
   * window.addEventListener("mousedown", e => {
   *   selecto.triggerDragStart(e);
   * });
   */


  __proto.triggerDragStart = function (e) {
    this.gesto.triggerDragStart(e);
    return this;
  };
  /**
   * Destroy elements, properties, and events.
   */


  __proto.destroy = function () {
    this.off();
    this.keycon && this.keycon.destroy();
    this.gesto.unset();
    this.injectResult.destroy();
    utils.removeEvent(document, "selectstart", this._onDocumentSelectStart);
    this.keycon = null;
    this.gesto = null;
    this.injectResult = null;
    this.target = null;
    this.container = null;
    this.options = null;
  };

  __proto.getElementPoints = function (target) {
    var getElementRect = this.getElementRect || getDefaultElementRect;
    var info = getElementRect(target);
    var points = [info.pos1, info.pos2, info.pos4, info.pos3];

    if (getElementRect !== getDefaultElementRect) {
      var rect = target.getBoundingClientRect();
      return overlapArea.fitPoints(points, rect);
    }

    return points;
  };
  /**
   * Get all elements set in `selectableTargets`.
   */


  __proto.getSelectableElements = function () {
    var selectableElements = [];
    this.options.selectableTargets.forEach(function (target) {
      if (utils.isObject(target)) {
        selectableElements.push(target);
      } else {
        var elements = [].slice.call(document.querySelectorAll(target));
        elements.forEach(function (el) {
          selectableElements.push(el);
        });
      }
    });
    return selectableElements;
  };
  /**
   * If scroll occurs during dragging, you can manually call this method to check the position again.
   */


  __proto.checkScroll = function () {
    if (!this.gesto.isFlag()) {
      return;
    }

    var scrollOptions = this.scrollOptions; // If it is a scrolling position, pass drag

    (scrollOptions === null || scrollOptions === void 0 ? void 0 : scrollOptions.container) && this.dragScroll.checkScroll(__assign({
      inputEvent: this.gesto.getCurrentEvent()
    }, scrollOptions));
  };
  /**
   * Find for selectableTargets again during drag event
   */


  __proto.findSelectableTargets = function (data) {
    var _this = this;

    if (data === void 0) {
      data = this.gesto.getEventData();
    }

    var selectableTargets = this.getSelectableElements();
    var selectablePoints = selectableTargets.map(function (target) {
      return _this.getElementPoints(target);
    });
    data.selectableTargets = selectableTargets;
    data.selectablePoints = selectablePoints;

    this._refreshGroups(data);
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
      data: {
        selectFlag: false
      },
      clientX: clientX,
      clientY: clientY,
      inputEvent: e,
      isClick: true,
      stop: function () {
        return false;
      }
    };

    if (this._onDragStart(dragEvent, clickedTarget)) {
      this._onDragEnd(dragEvent);
    }

    return this;
  };

  __proto.setKeyController = function () {
    var _a = this.options,
        keyContainer = _a.keyContainer,
        toggleContinueSelect = _a.toggleContinueSelect,
        toggleContinueSelectWithoutDeselect = _a.toggleContinueSelectWithoutDeselect;

    if (this.keycon) {
      this.keycon.destroy();
      this.keycon = null;
    }

    if (toggleContinueSelect || toggleContinueSelectWithoutDeselect) {
      this.keycon = new KeyController(keyContainer || window);
      this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur);
    }
  };

  __proto.setKeyEvent = function () {
    var _a = this.options,
        toggleContinueSelect = _a.toggleContinueSelect,
        toggleContinueSelectWithoutDeselect = _a.toggleContinueSelectWithoutDeselect;

    if (!toggleContinueSelect && !toggleContinueSelectWithoutDeselect || this.keycon) {
      return;
    }

    this.setKeyController();
  }; // with getter, setter property


  __proto.setKeyContainer = function (keyContainer) {
    var _this = this;

    var options = this.options;
    diffValue(options.keyContainer, keyContainer, function () {
      options.keyContainer = keyContainer;

      _this.setKeyController();
    });
  };

  __proto.getContinueSelect = function () {
    var _a = this.options,
        continueSelect = _a.continueSelect,
        toggleContinueSelect = _a.toggleContinueSelect;

    if (!toggleContinueSelect || !this._keydownContinueSelect) {
      return continueSelect;
    }

    return !continueSelect;
  };

  __proto.getContinueSelectWithoutDeselect = function () {
    var _a = this.options,
        continueSelectWithoutDeselect = _a.continueSelectWithoutDeselect,
        toggleContinueSelectWithoutDeselect = _a.toggleContinueSelectWithoutDeselect;

    if (!toggleContinueSelectWithoutDeselect || !this._keydownContinueSelectWithoutDeselection) {
      return continueSelectWithoutDeselect;
    }

    return !continueSelectWithoutDeselect;
  };

  __proto.setToggleContinueSelect = function (toggleContinueSelect) {
    var _this = this;

    var options = this.options;
    diffValue(options.toggleContinueSelect, toggleContinueSelect, function () {
      options.toggleContinueSelect = toggleContinueSelect;

      _this.setKeyEvent();
    });
  };

  __proto.setToggleContinueSelectWithoutDeselect = function (toggleContinueSelectWithoutDeselect) {
    var _this = this;

    var options = this.options;
    diffValue(options.toggleContinueSelectWithoutDeselect, toggleContinueSelectWithoutDeselect, function () {
      options.toggleContinueSelectWithoutDeselect = toggleContinueSelectWithoutDeselect;

      _this.setKeyEvent();
    });
  };

  __proto.setPreventDefault = function (value) {
    this.gesto.options.preventDefault = value;
  };

  __proto.setCheckInput = function (value) {
    this.gesto.options.checkInput = value;
  };

  __proto.initElement = function () {
    this.target = createElement(h("div", {
      className: CLASS_NAME
    }), this.target, this.container);
    var target = this.target;
    var _a = this.options,
        dragContainer = _a.dragContainer,
        checkInput = _a.checkInput,
        preventDefault = _a.preventDefault,
        preventClickEventOnDragStart = _a.preventClickEventOnDragStart,
        preventClickEventOnDrag = _a.preventClickEventOnDrag,
        _b = _a.preventRightClick,
        preventRightClick = _b === void 0 ? true : _b;
    this.dragContainer = typeof dragContainer === "string" ? [].slice.call(document.querySelectorAll(dragContainer)) : dragContainer || this.target.parentNode;
    this.gesto = new Gesto(this.dragContainer, {
      checkWindowBlur: true,
      container: window,
      checkInput: checkInput,
      preventDefault: preventDefault,
      preventClickEventOnDragStart: preventClickEventOnDragStart,
      preventClickEventOnDrag: preventClickEventOnDrag,
      preventRightClick: preventRightClick
    }).on({
      dragStart: this._onDragStart,
      drag: this._onDrag,
      dragEnd: this._onDragEnd
    });
    utils.addEvent(document, "selectstart", this._onDocumentSelectStart);
    this.injectResult = injector.inject(target, {
      nonce: this.options.cspNonce
    });
  };

  __proto.hitTest = function (selectRect, clientX, clientY, data) {
    var _a = this.options,
        hitRate = _a.hitRate,
        selectByClick = _a.selectByClick;
    var left = selectRect.left,
        top = selectRect.top,
        right = selectRect.right,
        bottom = selectRect.bottom;
    var innerGroups = data.innerGroups;
    var innerWidth = data.innerWidth;
    var innerHeight = data.innerHeight;
    var rectPoints = [[left, top], [right, top], [right, bottom], [left, bottom]];

    var isHit = function (points) {
      var inArea = overlapArea.isInside([clientX, clientY], points);

      if (selectByClick && inArea) {
        return true;
      }

      var overlapPoints = overlapArea.getOverlapPoints(rectPoints, points);

      if (!overlapPoints.length) {
        return false;
      }

      var overlapSize = overlapArea.getAreaSize(overlapPoints);
      var targetSize = overlapArea.getAreaSize(points);
      var hitRateValue = utils.splitUnit("".concat(hitRate));

      if (hitRateValue.unit === "px") {
        return overlapSize >= hitRateValue.value;
      } else {
        var rate = utils.between(Math.round(overlapSize / targetSize * 100), 0, 100);
        return rate >= Math.min(100, hitRateValue.value);
      }
    };

    if (!innerGroups) {
      var selectableTargets = data.selectableTargets;
      var selectablePoints_1 = data.selectablePoints;
      return selectableTargets.filter(function (_, i) {
        return isHit(selectablePoints_1[i]);
      });
    }

    var selectedTargets = [];
    var minX = Math.floor(left / innerWidth);
    var maxX = Math.floor(right / innerWidth);
    var minY = Math.floor(top / innerHeight);
    var maxY = Math.floor(bottom / innerHeight);

    for (var x = minX; x <= maxX; ++x) {
      var yGroups = innerGroups[x];

      if (!yGroups) {
        continue;
      }

      var _loop_1 = function (y) {
        var group = yGroups[y];

        if (!group) {
          return "continue";
        }

        var points = group.points,
            targets = group.targets;
        points.forEach(function (nextPoints, i) {
          if (isHit(nextPoints)) {
            selectedTargets.push(targets[i]);
          }
        });
      };

      for (var y = minY; y <= maxY; ++y) {
        _loop_1(y);
      }
    }

    return filterDuplicated(selectedTargets);
  };

  __proto.initDragScroll = function () {
    var _this = this;

    this.dragScroll.on("scroll", function (_a) {
      var container = _a.container,
          direction = _a.direction;

      _this.emit("scroll", {
        container: container,
        direction: direction
      });
    }).on("move", function (_a) {
      var offsetX = _a.offsetX,
          offsetY = _a.offsetY,
          inputEvent = _a.inputEvent;
      var gesto = _this.gesto;

      if (!gesto || !gesto.isFlag()) {
        return;
      }

      var data = _this.gesto.getEventData();

      var boundArea = data.boundArea;
      data.startX -= offsetX;
      data.startY -= offsetY;
      data.selectablePoints.forEach(function (points) {
        points.forEach(function (pos) {
          pos[0] -= offsetX;
          pos[1] -= offsetY;
        });
      });

      _this._refreshGroups(data);

      boundArea.left -= offsetX;
      boundArea.right -= offsetX;
      boundArea.top -= offsetY;
      boundArea.bottom -= offsetY;

      _this.gesto.scrollBy(offsetX, offsetY, inputEvent.inputEvent, false);

      _this._checkSelected(_this.gesto.getCurrentEvent());
    });
  };

  __proto._select = function (prevSelectedTargets, selectedTargets, rect, e, isStart) {
    var inputEvent = e.inputEvent;
    var data = e.data;

    var _a = childrenDiffer.diff(prevSelectedTargets, selectedTargets),
        added = _a.added,
        removed = _a.removed,
        prevList = _a.prevList,
        list = _a.list;

    this.selectedTargets = selectedTargets;

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
      this.emit("selectStart", {
        selected: selectedTargets,
        added: added.map(function (index) {
          return list[index];
        }),
        removed: removed.map(function (index) {
          return prevList[index];
        }),
        rect: rect,
        inputEvent: inputEvent,
        data: data.data
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
      this.emit("select", {
        selected: selectedTargets,
        added: added.map(function (index) {
          return list[index];
        }),
        removed: removed.map(function (index) {
          return prevList[index];
        }),
        rect: rect,
        inputEvent: inputEvent,
        data: data.data
      });
    }
  };

  __proto._selectEnd = function (startSelectedTargets, startPassedTargets, rect, e) {
    var inputEvent = e.inputEvent,
        isDouble = e.isDouble,
        data = e.data;

    var _a = childrenDiffer.diff(startSelectedTargets, this.selectedTargets),
        added = _a.added,
        removed = _a.removed,
        prevList = _a.prevList,
        list = _a.list;

    var _b = childrenDiffer.diff(startPassedTargets, this.selectedTargets),
        afterAdded = _b.added,
        afterRemoved = _b.removed,
        afterPrevList = _b.prevList,
        afterList = _b.list;

    var type = inputEvent && inputEvent.type;
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

    this.emit("selectEnd", {
      selected: this.selectedTargets,
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
      isClick: !!e.isClick,
      isDouble: !!isDouble,
      rect: rect,
      inputEvent: inputEvent,
      data: data.data
    });
  };

  __proto._checkSelected = function (e, rect) {
    if (rect === void 0) {
      rect = getRect(e, this.options.ratio);
    }

    var data = e.data,
        inputEvent = e.inputEvent;
    var top = rect.top,
        left = rect.left,
        width = rect.width,
        height = rect.height;
    var selectFlag = data.selectFlag;
    var containerX = data.containerX,
        containerY = data.containerY,
        scaleMatrix = data.scaleMatrix;
    var offsetPos = cssToMat.calculateMatrixDist(scaleMatrix, [left - containerX, top - containerY]);
    var offsetSize = cssToMat.calculateMatrixDist(scaleMatrix, [width, height]);
    var prevSelectedTargets = [];
    var selectedTargets = [];

    if (selectFlag) {
      this.target.style.cssText += "display: block;" + "left:0px;top:0px;" + "transform: translate(".concat(offsetPos[0], "px, ").concat(offsetPos[1], "px);") + "width:".concat(offsetSize[0], "px;height:").concat(offsetSize[1], "px;");
      var passedTargets = this.hitTest(rect, data.startX, data.startY, data);
      prevSelectedTargets = this.selectedTargets;
      selectedTargets = passTargets(data.startPassedTargets, passedTargets, this.continueSelect && this.continueSelectWithoutDeselect);
      this.selectedTargets = selectedTargets;
    }
    /**
     * When the drag, the drag event is called.
     * Call the stop () function if you have a specific element or don't want to raise a select
     * @memberof Selecto
     * @event drag
     * @param {OnDrag} - Parameters for the drag event
     * @example
     * import Selecto from "selecto";
     *
     * const selecto = new Selecto({
     *   container: document.body,
     *   selectByClick: true,
     *   selectFromInside: false,
     * });
     *
     * selecto.on("drag", e => {
     *   e.stop();
     * }).on("select", e => {
     *   e.added.forEach(el => {
     *     el.classList.add("selected");
     *   });
     *   e.removed.forEach(el => {
     *     el.classList.remove("selected");
     *   });
     * });
     */


    var result = this.emit("drag", __assign(__assign({}, e), {
      data: data.data,
      isSelect: selectFlag,
      rect: rect
    }));

    if (result === false) {
      this.target.style.cssText += "display: none;";
      e.stop();
      return;
    }

    if (selectFlag) {
      this._select(prevSelectedTargets, selectedTargets, rect, e);
    }
  };

  __proto._sameCombiKey = function (e, keys, isKeyup) {
    if (!keys) {
      return false;
    }

    var combi = KeyController.getCombi(e.inputEvent, e.key);
    var nextKeys = [].concat(keys);
    var toggleKeys = utils.isArray(nextKeys[0]) ? nextKeys : [nextKeys];

    if (isKeyup) {
      var singleKey_1 = e.key;
      return toggleKeys.some(function (keys) {
        return keys.some(function (key) {
          return key === singleKey_1;
        });
      });
    }

    return toggleKeys.some(function (keys) {
      return keys.every(function (key) {
        return combi.indexOf(key) > -1;
      });
    });
  };

  __proto._findElement = function (clickedTarget, selectableTargets) {
    var pointTarget = clickedTarget;

    while (pointTarget) {
      if (selectableTargets.indexOf(pointTarget) > -1) {
        break;
      }

      pointTarget = pointTarget.parentElement;
    }

    return pointTarget;
  };

  __proto._refreshGroups = function (data) {
    var innerWidth = data.innerWidth;
    var innerHeight = data.innerHeight;

    if (!innerWidth || !innerHeight) {
      data.innerGroups = null;
    } else {
      var selectableTargets_1 = data.selectableTargets;
      var selectablePoints = data.selectablePoints;
      var groups_1 = {};
      selectablePoints.forEach(function (points, i) {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        points.forEach(function (pos) {
          var x = Math.floor(pos[0] / innerWidth);
          var y = Math.floor(pos[1] / innerHeight);
          minX = Math.min(x, minX);
          maxX = Math.max(x, maxX);
          minY = Math.min(y, minY);
          maxY = Math.max(y, maxY);
        });

        for (var x = minX; x <= maxX; ++x) {
          for (var y = minY; y <= maxY; ++y) {
            groups_1[x] = groups_1[x] || {};
            groups_1[x][y] = groups_1[x][y] || {
              points: [],
              targets: []
            };
            var _a = groups_1[x][y],
                targets = _a.targets,
                groupPoints = _a.points;
            targets.push(selectableTargets_1[i]);
            groupPoints.push(points);
          }
        }
      });
      data.innerGroups = groups_1;
    }
  };

  Selecto = __decorate([frameworkUtils.Properties(PROPERTIES, function (prototype, property) {
    var attributes = {
      enumerable: true,
      configurable: true,
      get: function () {
        return this.options[property];
      }
    };
    var getter = utils.camelize("get ".concat(property));

    if (prototype[getter]) {
      attributes.get = function get() {
        return this[getter]();
      };
    } else {
      attributes.get = function get() {
        return this.options[property];
      };
    }

    var setter = utils.camelize("set ".concat(property));

    if (prototype[setter]) {
      attributes.set = function set(value) {
        this[setter](value);
      };
    } else {
      attributes.set = function set(value) {
        this.options[property] = value;
      };
    }

    Object.defineProperty(prototype, property, attributes);
  })], Selecto);
  return Selecto;
}(EventEmitter);

var Selecto$1 =
/*#__PURE__*/
function (_super) {
  __extends(Selecto, _super);

  function Selecto() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return Selecto;
}(Selecto);



var modules = {
    __proto__: null,
    'default': Selecto$1,
    OPTIONS: OPTIONS,
    OPTION_TYPES: OPTION_TYPES,
    PROPERTIES: PROPERTIES,
    EVENTS: EVENTS,
    METHODS: METHODS,
    CLASS_NAME: CLASS_NAME
};

for (var name in modules) {
  Selecto$1[name] = modules[name];
}

module.exports = Selecto$1;

exports.CLASS_NAME = CLASS_NAME;
exports.EVENTS = EVENTS;
exports.METHODS = METHODS;
exports.OPTIONS = OPTIONS;
exports.OPTION_TYPES = OPTION_TYPES;
exports.PROPERTIES = PROPERTIES;
exports.default = Selecto$1;
//# sourceMappingURL=selecto.cjs.js.map
