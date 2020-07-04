import { ElementHierarchy } from "./types";
import { createElement } from "./server";

const _jsx = (def: ElementHierarchy): HTMLElement => {
  return createElement(def);
};

export default _jsx;
