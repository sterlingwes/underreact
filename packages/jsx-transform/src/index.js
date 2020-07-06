import jsx from '@babel/plugin-syntax-jsx';
import { addDefault } from '@babel/helper-module-imports';
import esutils from 'esutils';

const nameProperty = 'e';
const attributesProperty = 'a';
const childrenProperty = 'c';
const indexProperty = 'i';

export default function ({ types: t }) {
  /* ==========================================================================
   * Utilities
   * ======================================================================= */

  const transformOnType = (transforms) => (node) => {
    const transformer = transforms[node.type];
    if (transformer) {
      return transformer(node);
    }
    throw new Error(`${node.type} could not be transformed`);
  };

  const createStateValueIncrementer = (state, key) => () => state.set(key, state.get(key) + 1);

  /* ==========================================================================
   * Initial configuration
   * ======================================================================= */

  const variablesRegex = /^[A-Z]/;
  const stateConfigKey = 'jsxConfig';
  const stateIndexKey = 'jsxNodeIndex';

  const initConfig = (path, state) => {
    const { module: constructorModule = '@underreact/jsx-runtime' } = state.opts;

    return {
      constructorModule,
    };
  };

  /* =========================================================================
   * Visitors
   * ======================================================================= */

  const visitJSXElement = (path, state) => {
    if (!state.get(stateConfigKey)) {
      state.set(stateConfigKey, initConfig(path, state));
      state.set(stateIndexKey, 0);
    }

    const getCurrentElementIndex = () => state.get(stateIndexKey);
    const incrementElementIndex = createStateValueIncrementer(state, stateIndexKey);
    const { constructorModule } = state.get(stateConfigKey);

    /* ==========================================================================
     * Node Transformers
     * ======================================================================= */

    const JSXIdentifier = (node) => t.stringLiteral(node.name);

    const JSXNamespacedName = (node) => t.stringLiteral(`${node.namespace.name}:${node.name.name}`);

    const JSXMemberExpression = transformOnType({
      JSXIdentifier: (node) => t.identifier(node.name),
      JSXMemberExpression: (node) =>
        t.memberExpression(JSXMemberExpression(node.object), JSXMemberExpression(node.property)),
    });

    const JSXElementName = transformOnType({
      JSXIdentifier: variablesRegex
        ? (node) => (variablesRegex.test(node.name) ? t.identifier(node.name) : JSXIdentifier(node))
        : JSXIdentifier,
      JSXNamespacedName,
      JSXMemberExpression,
    });

    const JSXExpressionContainer = (node) => node.expression;

    const JSXAttributeName = transformOnType({
      JSXIdentifier,
      JSXNamespacedName,
      JSXMemberExpression,
    });

    const JSXAttributeValue = transformOnType({
      BooleanLiteral: (node) => node,
      StringLiteral: (node) => node,
      JSXExpressionContainer,
    });

    const JSXAttributes = (nodes) => {
      let object = [];
      const objects = [];

      nodes.forEach((node) => {
        switch (node.type) {
          case 'JSXAttribute': {
            if (!object) {
              object = [];
            }

            const attributeName = JSXAttributeName(node.name);
            const objectKey = esutils.keyword.isIdentifierNameES6(attributeName.value)
              ? t.identifier(attributeName.value)
              : attributeName;

            const value = node.value != null ? node.value : t.booleanLiteral(true);

            object.push(t.objectProperty(objectKey, JSXAttributeValue(value)));
            break;
          }
          case 'JSXSpreadAttribute': {
            if (object) {
              objects.push(t.objectExpression(object));
              object = null;
            }

            objects.push(node.argument);
            break;
          }
          default:
            throw new Error(`${node.type} cannot be used as a JSX attribute`);
        }
      });

      if (object && object.length > 0) {
        objects.push(t.objectExpression(object));
      }

      if (objects.length === 0) {
        return t.objectExpression([]);
      } else if (objects.length === 1) {
        return objects[0];
      }

      return t.callExpression(state.addHelper('extends'), objects);
    };

    const JSXText = (node) => {
      if (state.opts.noTrim) return t.stringLiteral(node.value);
      const value = node.value.replace(/\n\s*/g, '');
      return value === '' ? null : t.stringLiteral(value);
    };

    const JSXElement = (node) => {
      const elementIndex = getCurrentElementIndex();
      incrementElementIndex();
      const moduleImportIdentifier = addDefault(path, constructorModule);
      return t.callExpression(moduleImportIdentifier, [
        t.objectExpression([
          t.objectProperty(t.identifier(indexProperty), t.numericLiteral(elementIndex)),
          t.objectProperty(t.identifier(nameProperty), JSXElementName(node.openingElement.name)),
          t.objectProperty(
            t.identifier(attributesProperty),
            JSXAttributes(node.openingElement.attributes),
          ),
          t.objectProperty(
            t.identifier(childrenProperty),
            node.closingElement ? JSXChildren(node.children) : t.nullLiteral(),
          ),
        ]),
      ]);
    };

    const JSXChild = transformOnType({
      JSXText,
      JSXElement,
      JSXExpressionContainer,
    });

    const JSXChildren = (nodes) =>
      t.arrayExpression(
        nodes
          .map(JSXChild)
          .filter(Boolean)
          // Normalize all of our string children into one big string. This can be
          // an optimization as we minimize the number of nodes created.
          // This step just turns `['1', '2']` into `['12']`.
          .reduce((children, child) => {
            const lastChild = children.length > 0 ? children[children.length - 1] : null;

            // If this is a string literal, and the last child is a string literal, merge them.
            if (child.type === 'StringLiteral' && lastChild && lastChild.type === 'StringLiteral') {
              return [...children.slice(0, -1), t.stringLiteral(lastChild.value + child.value)];
            }

            // Otherwise just append the child to our array normally.
            return [...children, child];
          }, []),
      );

    // Actually replace JSX with an object.
    path.replaceWith(JSXElement(path.node));
  };

  /* ==========================================================================
   * Plugin
   * ======================================================================= */

  return {
    name: 'transform-ur-jsx',
    inherits: jsx,
    visitor: {
      JSXElement: visitJSXElement,
    },
  };
}
