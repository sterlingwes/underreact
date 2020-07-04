export interface ElementHierarchy {
  i: JSXElementIndex;
  e: JSXElement;
  a: JSXAttributes;
  c: NodeChildren;
}

export type Factory = (props: JSXAttributes) => ElementHierarchy;
export type JSXAttributes = object;

export type Maybe<T> = T | null | undefined;

type JSXElementIndex = number;
type HTMLElementName = string;
type JSXElement = HTMLElementName | Factory;
type NodeChildren = Maybe<ChildJSXNode[]>;

export type ChildJSXNode = HTMLElement | Text | boolean;
export type RenderableNode = HTMLElement | Text;
