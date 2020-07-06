import { ElementFactory, DefinitionFactory, GenericEventHandler } from "./types";

const isEvent = (k: string): boolean =>
  k.startsWith("on");
const isEventHandler = (v: any): v is GenericEventHandler => typeof v === 'function'
const eventName = (k: string): string => k.substr(2).toLowerCase();
const isString = (s: any): s is string => typeof s === "string";
const isElementFactory = (f: any): f is ElementFactory => typeof f === "function";
const isDefinitionFactory = (f: any): f is DefinitionFactory => typeof f === "function";
const isObject = (o: any): o is object => typeof o === "object";

const classNameForIndex = (index: number) => `ur-${index}`

export { isEvent, isEventHandler, eventName, isString, isElementFactory, isDefinitionFactory, isObject, classNameForIndex };
