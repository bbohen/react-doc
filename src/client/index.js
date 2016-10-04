const React = require('react');
const ReactDOM = require('react-dom');

const docData = require(`${PROJECT}/react-doc/docs.json`);
const File = require('./components/File');

const ReactDoc = (props) => {
  console.log(props.docs);

  const filesToDisplay = props.docs.map((file) => {
    return file.isReact ? <File {...file} /> : undefined;
  });

  return (
    <div>
      <h1>React-doc</h1>
      {filesToDisplay}
    </div>
  );
};

ReactDoc.propTypes = {
  docs: React.PropTypes.array
};

ReactDOM.render(
  <ReactDoc docs={docData} />,
  document.getElementById('mount')
);

export default ReactDoc;
