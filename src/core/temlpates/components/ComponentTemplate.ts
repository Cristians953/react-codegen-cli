import * as t from '@babel/types';
import { Template } from '@/core/TemplateGenerator';
import { config } from '@/config';
import { IComponentVariables } from '@/types';
import { ComponentTemplateBase } from '../ComponentTemplateBase';
import * as c from '../shared';

export class ComponentTemplate
  extends ComponentTemplateBase
  implements Template {
  constructor(protected vars: IComponentVariables) {
    super(vars);
  }

  private getStyleImport() {
    const specifiers = [];
    const isStyled = config.styles === 'styled-components';
    const ext = isStyled ? '' : `.${config.ext.style}`;
    const name = `./${this.vars.fileName}.${config.prefixes.style}${ext}`;

    if (isStyled) {
      specifiers.push(t.importDefaultSpecifier(t.identifier('Styled')));
    } else if (config.cssModules) {
      specifiers.push(t.importDefaultSpecifier(t.identifier('styles')));
    }

    return t.importDeclaration(specifiers, t.stringLiteral(name));
  }

  // eslint-disable-next-line class-methods-use-this
  private getJsxElement() {
    if (config.styles === 'styled-components') {
      const memberExpresion = t.jsxMemberExpression(
        t.jsxIdentifier('Styled'),
        t.jsxIdentifier('Root')
      );

      return t.jsxElement(
        t.jsxOpeningElement(memberExpresion, [], false),
        t.jsxClosingElement(memberExpresion),
        []
      );
    }

    const attributes = [];

    if (config.cssModules) {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('className'),
          t.jsxExpressionContainer(
            t.memberExpression(t.identifier('styles'), t.identifier('root'))
          )
        )
      );
    }

    return t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('div'), attributes),
      t.jsxClosingElement(t.jsxIdentifier('div')),
      []
    );
  }

  generateAST() {
    const body: t.Statement[] = [];

    const reactImportSpecifiers = this.getReactImportSpecifiers();
    const reactImport = this.getReactImport(reactImportSpecifiers);
    if (reactImport) {
      body.push(reactImport);
    }

    if (this.hasMod('propTypes')) {
      body.push(c.importDefault('PropTypes', 'prop-types'));
    }

    body.push(this.getStyleImport());
    body.push(t.emptyStatement());

    if (this.hasHook('useReducer')) {
      body.push(c.useReducerInit());
      body.push(t.emptyStatement());
    }

    const functionContainer = config.arrowFunction
      ? c.arrowFunctionDeclaration
      : c.regularFunctionDeclaration;

    const component = functionContainer(
      this.vars.componentName,
      [t.identifier('props')],
      [
        ...c.generateHooks(this.vars.hooks),
        t.returnStatement(this.getJsxElement()),
      ]
    );

    if (config.exportType === 'named') {
      body.push(t.exportNamedDeclaration(component));
    } else {
      body.push(component);
    }

    if (this.hasMod('propTypes')) {
      body.push(t.emptyStatement());
      body.push(c.propTypes(this.vars.componentName));
    }

    if (config.exportType === 'default') {
      body.push(t.emptyStatement());
      body.push(
        t.exportDefaultDeclaration(t.identifier(this.vars.componentName))
      );
    }

    return c.program(body);
  }
}
