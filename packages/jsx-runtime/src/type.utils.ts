import { Factory } from "./types";

const isEvent = (k: string, v: any): boolean =>
  k.startsWith("on") && typeof v === "function";
const eventName = (k: string): string => k.substr(2).toLowerCase();
const isString = (s: any): s is string => typeof s === "string";
const isFactory = (f: any): f is Factory => typeof f === "function";
const isObject = (o: any): o is object => typeof o === "object";

export { isEvent, eventName, isString, isFactory, isObject };
