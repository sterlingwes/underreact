import { styleObjToStyleString } from "./style.utils";
import { isObject, isFactory, isString } from "./type.utils";
import {
  JSXAttributes,
  ElementHierarchy,
  ChildJSXNode,
  RenderableNode,
} from "./types";

const applyAttributes = (el: HTMLElement, attributes: JSXAttributes) => {
  if (!attributes) {
    return el;
  }

  for (let [k, val] of Object.entries(attributes)) {
    if (typeof val === "undefined") {
      continue;
    }

    if (k === "className" && typeof val === "string" && /\s+/.test(val)) {
      el.className = val;
      continue;
    }

    if (k === "className") {
      const classes = Array.isArray(val) ? val : [val];
      el.classList.add(...classes);
      continue;
    }

    if (k === "style" && isObject(val)) {
      el.setAttribute(k, styleObjToStyleString(val));
      continue;
    }

    el.setAttribute(k, val);
  }
  return el;
};

const validNode = (node: ChildJSXNode): node is RenderableNode =>
  node instanceof HTMLElement || node instanceof Text;

export const createElement = ({
  e: element,
  a: attributes,
  c: children,
}: ElementHierarchy): HTMLElement => {
  if (isFactory(element)) {
    const props = { ...attributes, children };
    const computedJsxDef = element(props);
    return createElement(computedJsxDef);
  }

  const el = applyAttributes(document.createElement(element), attributes);
  if (!children) return el;

  children.forEach((child) => {
    const node = !isString(child) ? child : document.createTextNode(child);
    if (node === false) return;
    if (!validNode(node)) {
      throw new Error(`${typeof node} is not an HTMLElement`);
    }
    el.appendChild(node);
  });
  return el;
};
