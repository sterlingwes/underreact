import { JSXDefinitionHierarchy, GenericEventHandler } from './types';
import { isDefinitionFactory, isString, isEvent, eventName, isEventHandler } from './type.utils';

interface EventTargetWrapper {
  addEventListener: (name: string, handler: GenericEventHandler) => void;
}

const singleElement = (el: Element | NodeListOf<Element>): el is Element => el instanceof Element;

class ElementWrapper implements EventTargetWrapper {
  readonly elements: Element[] = [];

  constructor(el: Element | NodeListOf<Element>) {
    if (singleElement(el)) {
      this.elements = [el];
    } else {
      this.elements = Array.from(el);
    }
  }

  addEventListener(name: string, handler: GenericEventHandler) {
    this.elements.forEach((element) => element.addEventListener(name, handler));
  }
}

const resolveElement = (container: Element, index: number, attributes: any): EventTargetWrapper => {
  let element;
  if (attributes.key) {
    const id = `#ur-${index}-${attributes.key}`;
    element = container.querySelector(id);
    if (!element) {
      throw new Error(`Unexpected state, trying to find element by id ${id}`);
    }
  }

  if (!element) {
    const className = `.ur-${index}`;
    element = container.querySelectorAll(className);
    if (!element.length) {
      throw new Error(`Unexpected state, trying to find element by class ${className}`);
    }
  }

  console.log('applying event listener to', element);
  return new ElementWrapper(element);
};

export const applyEventHandlers = (
  definition: JSXDefinitionHierarchy,
  container: Element = document.body,
): JSXDefinitionHierarchy => {
  const { i: index, e: element, a: attributes } = definition;

  let jsxDefinition = definition;

  if (isDefinitionFactory(element)) {
    jsxDefinition = element(attributes);
  }

  if (!attributes) return jsxDefinition;

  let el;

  for (let [k, val] of Object.entries(attributes)) {
    if (isEvent(k) === false) continue;
    if (isEventHandler(val) === false) continue;

    if (!el) {
      // el = resolveElement(container, index, attributes);
      container.addEventListener(eventName(k), val);
    }
  }

  return jsxDefinition;
};
