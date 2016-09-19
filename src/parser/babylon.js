const babylon = require('babylon');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tempReactFile.js');

fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
  const parsedFile = babylon.parse(data, {
    // parse in strict mode and allow module declarations
    sourceType: 'module',

    plugins: [
      // enable jsx and flow syntax
      'classProperties',
      'decorators',
      'jsx',
      'flow'
    ]
  });

  console.log(parsedFile);
});
