const readFile = require('./readFile');

module.exports = (files) => {
  const results = [];

  // reduce an array of promises while creating a new array out of the results
  return files.reduce((prior, filePath) => {
    return prior.then(() => {
      return readFile(filePath).then((result) => {
        results.push(result);
        return results;
      });
    });
  }, Promise.resolve());
};
