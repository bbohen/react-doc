// TODO: refactor / modularize

const fs = require('fs');
const param = require('./param');

// Move These
const SUPPORTED_LIFECYCLE_EVENTS = [
  'componentDidMount',
  'componentWillMount',
  'componentWillReceiveProps'
];

const lineContains = (ln) => {
  let matchingEvent = '';
  SUPPORTED_LIFECYCLE_EVENTS.forEach((event) => {
    if (ln.includes(event)) {
      matchingEvent = event;
      return;
    }
  });
  return matchingEvent;
};

module.exports = function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
      }

      const loc = data.split('\n');
      let captureLine = false;
      const parsedComments = {};
      let trimmedLine = '';
      let blockEndedAt;
      let isInlineComment;

      loc.forEach((line, index) => {
        trimmedLine = line.trim();
        isInlineComment = trimmedLine.startsWith('//');

        /**
         * Grab multiline comments
         */

        // multiline comment has begun
        if (trimmedLine.startsWith('/*')) {
          // it should be added to the results
          captureLine = true;
          // create a new entry for it
          parsedComments[Object.keys(parsedComments).length] = [];
        }

        // multiline comment has ended
        if (trimmedLine.startsWith('*/')) {
          // the line the multiline comment has ended
          blockEndedAt = index;
          // we don't want it in the results
          captureLine = false;
        }

        // add the multiline comment to the results
        if (captureLine && trimmedLine.startsWith('*')) {
          parsedComments[Object.keys(parsedComments).length - 1].push(param(trimmedLine));
        }

        // parse the line immediately after the multiline comment is over
        if ((index === blockEndedAt + 1) && !isInlineComment) {
          // check lifecycles
          // TODO: check if this line is a function
          if (new RegExp(SUPPORTED_LIFECYCLE_EVENTS.join('|')).test(trimmedLine)) {
            const matchingLifeCycleEvent = lineContains(trimmedLine);

            parsedComments[matchingLifeCycleEvent] = parsedComments[
              Object.keys(parsedComments).length - 1
            ];
            delete parsedComments[Object.keys(parsedComments).length - 2];
          }

          // proptype docs
          if (trimmedLine.includes('propTypes')) {
            // create a propTypes entry
            parsedComments.propTypes = parsedComments[Object.keys(parsedComments).length - 1];
            delete parsedComments[Object.keys(parsedComments).length - 2];
          }

          // local state docs
          if (trimmedLine.includes('this.state = {')) {
            // create a propTypes entry
            parsedComments.stateTypes = parsedComments[Object.keys(parsedComments).length - 1];
            delete parsedComments[Object.keys(parsedComments).length - 2];
          }
        }


        if (index === loc.length - 1) {
          resolve({
            comments: parsedComments,
            name: file.match(/[^\\/]+$/)[0],
            path: file
          });
        }
      });
    });
  });
};
