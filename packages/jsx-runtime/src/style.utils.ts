export const decamelize = (str: string) =>
  str.replace(
    /([a-z][A-Z])/g,
    (match) => `${match[0]}-${match[1].toLowerCase()}`
  );

export const pixelShorthandExcluded = (key: string) =>
  ["opacity"].every((cssKey) => key.includes(cssKey) === false);

type CSSValue = number | string;

export const postfixValue = (key: string, val: CSSValue) =>
  typeof val === "number" && pixelShorthandExcluded(key) !== false
    ? `${val}px`
    : val;

export const styleObjToStyleString = (styleObj: object) =>
  Object.entries(styleObj)
    .map(([key, val]) => `${decamelize(key)}:${postfixValue(key, val)}`)
    .join(";");
