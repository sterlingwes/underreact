import { ElementHierarchy, RunMode, Maybe, JSXDefinitionHierarchy } from './types';
import { createElement } from './server';
import { applyEventHandlers } from './client';

const RUN_MODE_ENV = 'UR_RUN_MODE';
const runModes: RunMode[] = ['dev', 'client', 'server'];

type MaybeRunMode = string | undefined | RunMode;

const validMode = (env: string | RunMode): env is RunMode =>
  env === 'dev' || env === 'client' || env === 'server';

const runMode = (env: MaybeRunMode = process.env.UR_RUN_MODE): Maybe<RunMode> => {
  if (typeof env !== 'string' || validMode(env) === false) {
    throw new Error(
      `${RUN_MODE_ENV} env not set to one of dev|client|server. Unable to determine runtime mode for jsx runtime.`,
    );
  }
  return env as RunMode;
};

const jsxRuntime = (def: ElementHierarchy): HTMLElement | JSXDefinitionHierarchy => {
  let element;
  switch (runMode()) {
    case 'dev':
      element = createElement(def);
      // @ts-ignore
      applyEventHandlers(def, element);
      break;
    case 'client':
      // @ts-ignore
      element = applyEventHandlers(def);
      break;
    case 'server':
      element = createElement(def);
      break;
    default:
      throw new Error(`Invalid run mode`);
  }
  return element;
};

export default jsxRuntime;
