const babylon = require('babylon');
const fs = require('fs');

function parsePropTypes(propertiesArray) {
  const propTypes = [];
  for (const property of propertiesArray) {
    propTypes.push({
      name: property.key.name,
      type: ((property.value.object || {}).property || {}).name
    });
  }
  return propTypes;
}

module.exports = function parseFile(fileToParse) {
  return new Promise((resolve) => {
    let isReact = false;
    let name = '';
    let propTypes = [];

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
        for (const fileBodyProp of parsedFile.program.body) {
          // detect imports
          if (fileBodyProp.type === 'ImportDeclaration' && fileBodyProp.source && fileBodyProp.source.value === 'react') {
            isReact = true;
          }

          // component (class) contents
          if (fileBodyProp.type === 'ExportDefaultDeclaration' && (fileBodyProp.declaration.type === 'ClassDeclaration')) {
            name = fileBodyProp.declaration.id ? fileBodyProp.declaration.id.name : fileBodyProp.declaration.name;

            for (const classBodyProp of fileBodyProp.declaration.body.body) {
              if (classBodyProp.type === 'ClassProperty' && classBodyProp.key.name === 'propTypes') {
                propTypes = parsePropTypes(classBodyProp.value.properties);
              }
            }
          }

          if (isReact && fileBodyProp.type === 'ExpressionStatement') {
            // parse props (needs to be cleaner and more generic)
            if (fileBodyProp.expression.left && fileBodyProp.expression.left.property.name.toLowerCase() === 'proptypes' && (fileBodyProp.expression.right.properties && fileBodyProp.expression.right.properties.length)) {
              propTypes = parsePropTypes(fileBodyProp.expression.right.properties);
            }
          }
        }
      }

      resolve({
        componentProps: propTypes,
        rawData: parsedFile.program,
        filename: fileToParse,
        name,
        isReact
      });
    });
  });
};
