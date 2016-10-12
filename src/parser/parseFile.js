const babylon = require('babylon');
const fs = require('fs');

module.exports = function parseFile(fileToParse) {
  return new Promise((resolve) => {
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
        // detect imports
        for (const props of parsedFile.program.body) {
          if (props.source && props.source.value === 'react') {
            isReact = true;
          }

          if (props.type === 'ExportDefaultDeclaration' && (props.declaration.type === 'ClassDeclaration' || props.declaration.type === 'Identifier')) {
            name = props.declaration.id ? props.declaration.id.name : props.declaration.name;
          }
        }
      }

      resolve({
        // rawData: parsedFile.program,
        filename: fileToParse,
        name,
        isReact
      });
    });
  });
};
