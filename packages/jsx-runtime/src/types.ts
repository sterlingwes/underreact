export type RunMode = 'dev' | 'client' | 'server';

export interface ElementHierarchy {
  i: JSXElementIndex;
  e: JSXElement<ElementFactory>;
  a: JSXAttributes;
  c: NodeChildren;
}

export interface JSXDefinitionHierarchy {
  i: JSXElementIndex;
  e: JSXElement<DefinitionFactory>;
  a: JSXAttributes;
  c: DefinitionChildren;
}

export type ElementFactory = (props: JSXAttributes) => HTMLElement;
export type DefinitionFactory = (props: JSXAttributes) => JSXDefinitionHierarchy;
export type JSXAttributes = object;

export type Maybe<T> = T | null | undefined;

type JSXElementIndex = number;
type HTMLElementName = string;
type JSXElement<FactoryT> = HTMLElementName | FactoryT;
type NodeChildren = Maybe<ChildJSXNode[]>;
type DefinitionChildren = Maybe<DefinitionChild[]>;

export type ChildJSXNode = HTMLElement | Text | boolean;
export type DefinitionChild = JSXDefinitionHierarchy | Text | boolean;
export type RenderableNode = HTMLElement | Text;
export type GenericEventHandler = () => any;
