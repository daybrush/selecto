import { Hypertext } from "./types";
import { IObject, addClass, hasClass } from "@daybrush/utils";

export function getClient(e: MouseEvent | TouchEvent) {
    if ("touches" in e) {
        const touch = e.touches[0] || e.changedTouches[0];

        return {
            clientX: touch.clientX,
            clientY: touch.clientY,
        };
    } else {
        return {
            clientX: e.clientX,
            clientY: e.clientY,
        };
    }
}

export function createElement(
    jsx: Hypertext,
    prevTarget?: HTMLElement | SVGElement,
    container?: HTMLElement | SVGElement,
) {
    const { tag, children, attributes, className, style } = jsx;
    const el = prevTarget || document.createElement(tag) as HTMLElement | SVGElement;

    for (const name in attributes) {
        el.setAttribute(name, attributes[name]);
    }
    const elChildren = el.children;
    children.forEach((child, i) => {
        createElement(child, elChildren[i] as HTMLElement | SVGElement, el);
    });
    if (className) {
        className.split(" ").forEach(name => {
            if (!hasClass(el, name)) {
                addClass(el, name);
            }
        });
    }
    if (style) {
        const elStyle = el.style;
        for (const name in style) {
            elStyle[name] = style[name];
        }
    }
    if (!prevTarget && container) {
        container.appendChild(el);
    }
    return el;
}
export function h(
    tag: string,
    attrs: IObject<any>,
    ...children: Hypertext[]
): Hypertext {
    const {
        className = "",
        style = {},
        ...attributes
    } = attrs || {};
    return {
        tag,
        className,
        style,
        attributes,
        children,
    };
}

export function diffValue<T>(prev: T, cur: T, func: (prev: T, cur: T) => void) {
    if (prev !== cur) {
        func(prev, cur);
    }
}
