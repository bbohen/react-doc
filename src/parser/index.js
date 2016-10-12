const parseFile = require('./parseFile');

module.exports = function parser(files) {
  const results = [];

  console.log('# of files', files.length);

  return files.reduce((prior, filePath) => {
    return prior.then(() => {
      return parseFile(filePath).then((result) => {
        results.push(result);
        return results;
      });
    });
  }, Promise.resolve());
};
