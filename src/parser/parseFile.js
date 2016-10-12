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

          if (props.declaration && (props.declaration.type === 'ClassDeclaration')) {
            name = props.declaration.id.name;
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
