import { ElementHierarchy } from './types';
import { createElement } from './server';

const jsxRuntime = (def: ElementHierarchy): HTMLElement => {
  return createElement(def);
};

export default jsxRuntime;
