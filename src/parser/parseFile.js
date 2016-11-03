const babylon = require('babylon');
const fs = require('fs');

module.exports = function parseFile(fileToParse) {
  return new Promise((resolve) => {
    let propTypes = [];
    let isReact = false;
    let name = '';

    fs.readFile(fileToParse, { encoding: 'utf-8' }, (err, data) => {
      const parsedFile = babylon.parse(data, {
        sourceType: 'module',
        plugins: [
          'classProperties',
          'decorators',
          'doExpressions',
          'exportExtensions',
          'flow',
          'functionBind',
          'jsx',
          'objectRestSpread'
        ]
      });

      console.log('parsed', fileToParse);

      if (parsedFile.program && parsedFile.program.body) {
        for (const props of parsedFile.program.body) {
          // detect imports
          if (props.type === 'ImportDeclaration' && props.source && props.source.value === 'react') {
            isReact = true;
          }

          // component contents
          if (props.type === 'ExportDefaultDeclaration' && (props.declaration.type === 'ClassDeclaration' || props.declaration.type === 'Identifier')) {
            name = props.declaration.id ? props.declaration.id.name : props.declaration.name;
          }

          if (isReact && props.type === 'ExpressionStatement') {
            // parse props (needs to be cleaner and more generic)
            if (props.expression.left && props.expression.left.property.name.toLowerCase() === 'proptypes' && (props.expression.right.properties && props.expression.right.properties.length)) {
              for (const expressionProp of props.expression.right.properties) {
                propTypes.push(expressionProp.key.name);
              }
            }
          }
        }
      }

      resolve({
        rawData: parsedFile.program,
        filename: fileToParse,
        name,
        propTypes,
        isReact
      });
    });
  });
};
