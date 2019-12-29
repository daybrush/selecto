import { Hypertext } from "./types";
import { IObject, addClass, hasClass } from "@daybrush/utils";

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
    if (container) {
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
