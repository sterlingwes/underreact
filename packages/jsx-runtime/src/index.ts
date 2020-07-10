import { ElementHierarchy, RunMode, Maybe, JSXDefinitionHierarchy } from './types';
import { createElement } from './server';
import { applyEventHandlers } from './client';

const RUN_MODE_ENV = 'UR_RUN_MODE';

const validRunMode =
  process.env.UR_RUN_MODE === 'server' ||
  process.env.UR_RUN_MODE === 'client' ||
  process.env.UR_RUN_MODE === 'dev';

if (!validRunMode) {
  throw new Error(
    `${RUN_MODE_ENV} env not set to one of dev|client|server. Unable to determine runtime mode for jsx runtime.`,
  );
}

let jsxRuntime;

if (process.env.UR_RUN_MODE === 'server') {
  jsxRuntime = (def: ElementHierarchy): HTMLElement => createElement(def);
}

if (process.env.UR_RUN_MODE === 'client') {
  // @ts-ignore
  jsxRuntime = (def: ElementHierarchy): JSXDefinitionHierarchy => applyEventHandlers(def);
}

if (process.env.UR_RUN_MODE === 'dev') {
  jsxRuntime = (def: ElementHierarchy): HTMLElement => {
    const element = createElement(def);
    // @ts-ignore
    applyEventHandlers(def, element);
    return element;
  };
}

export default jsxRuntime;
