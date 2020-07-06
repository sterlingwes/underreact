import { styleObjToStyleString } from './style.utils';
import {
  isObject,
  isElementFactory,
  isString,
  classNameForIndex,
  isEventHandler,
  isEvent,
} from './type.utils';
import { JSXAttributes, ElementHierarchy, ChildJSXNode, RenderableNode } from './types';

const applyAttributes = (el: HTMLElement, attributes: JSXAttributes) => {
  if (!attributes) {
    return el;
  }

  for (let [k, val] of Object.entries(attributes)) {
    if (typeof val === 'undefined' || isEvent(k)) {
      continue;
    }

    if (k === 'className' && typeof val === 'string' && /\s+/.test(val)) {
      el.className = val;
      continue;
    }

    if (k === 'className') {
      const classes = Array.isArray(val) ? val : [val];
      el.classList.add(...classes);
      continue;
    }

    if (k === 'style' && isObject(val)) {
      el.setAttribute(k, styleObjToStyleString(val));
      continue;
    }

    el.setAttribute(k, val);
  }
  return el;
};

const validNode = (node: ChildJSXNode): node is RenderableNode =>
  node instanceof HTMLElement || node instanceof Text;

const addId = (el: HTMLElement, index: number, props: any) =>
  typeof props.key === 'number' ||
  (typeof props.key === 'string' && el.setAttribute('id', `ur-${index}-${props.key}`));

export const createElement = ({
  i: index,
  e: element,
  a: attributes,
  c: children,
}: ElementHierarchy): HTMLElement => {
  if (isElementFactory(element)) {
    const props = { ...attributes, children };
    const el = element(props);
    addId(el, index, props);
    return el;
  }

  const el = applyAttributes(document.createElement(element), attributes);
  el.classList.add(classNameForIndex(index));
  addId(el, index, attributes);

  if (!children) return el;

  children.flat().forEach((child) => {
    const node = !isString(child) ? child : document.createTextNode(child);
    if (node == null || node === false) return;
    if (!validNode(node)) {
      throw new Error(`${typeof node} is not an HTMLElement`);
    }
    el.appendChild(node);
  });
  return el;
};
