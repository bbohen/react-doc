function createParamDoc(paramLine) {
  const docType = (paramLine.match(/(?:^|\W)@(\w+)(?!\w)/) || [])[1];
  const paramType = (paramLine.match(/{([^}]+)}/) || [])[1];
  const splitLine = paramLine.split(' ');
  const name = splitLine[3];

  splitLine.splice(0, 4);

  return {
    name,
    docType,
    paramType,
    description: splitLine.join(' ')
  };
}

module.exports = createParamDoc;
