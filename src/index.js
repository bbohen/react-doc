#!/usr/bin/env node

const fs = require('fs');
const walk = require('walk');
const webpack = require('webpack');
const chalk = require('chalk');
const program = require('commander');

const docodile = require('./parser/docodile');
const createWebpackConfig = require('./client/createWebpackConfig');

const webpackConfig = createWebpackConfig();
const compiler = webpack(webpackConfig);
const filePaths = [];

program
  .option('-i, --ignore <value>', 'Ignore routes', val => val.split(','))
  .parse(process.argv);

const walkOptions = {
  followLinks: false,
  filters: [
    '.git',
    'node_modules',
    'react-doc',
    ...(program.ignore || [])
  ]
};

// recursively walk supplied directory
const walker = walk.walk('./', walkOptions);
console.log(`walking at ${chalk.yellow(process.cwd())}/`);

// create client side webpack bundle
function createBundle() {
  compiler.run((err) => {
    if (err) {
      console.log(chalk.red('webpack build failed'));
    } else {
        // console.log(stats);
      console.log(chalk.green('webpack build complete'));
    }
  });
}

// create the resulting directory within the project to document
fs.mkdir('./react-doc', (err) => {
  if (err) {
    if (err.code === 'EEXIST') {
      // ignore the error if the folder already exists
      console.log('react-doc directory already exists');
    } else {
      // something else errored out
      console.log(chalk.red('couldnt create react-doc directory'));
    }
  } else {
      // created directory
    console.log(chalk.green('react-doc dir created'));
  }
});

// create the array of file names to document
walker.on('file', (root, stat, next) => {
  const splitName = stat.name.split('.');

  if (['js', 'jsx'].indexOf(splitName[splitName.length - 1]) > -1) {
    filePaths.push(`${root}/${stat.name}`);
  }

  next();
});

// done creating array of filenames to document
walker.on('end', () => {
  const files = Object.prototype.toString.call(filePaths) === '[object Array]' ? filePaths : [filePaths];

  docodile(files).then((results) => {
    // webpack
    console.log(chalk.green(`${filePaths.length} files parsed!`));
    fs.writeFile('./react-doc/docs.json', JSON.stringify(results), (err) => {
      if (err) {
        return console.log(chalk.red(err));
      }

      console.log(chalk.green('docs.json was saved!'));
      return createBundle();
    });
  }, (docError) => {
    console.log(docError);
  });
});
