const React = require('react');
const ReactDOM = require('react-dom');

const docData = require(`${PROJECT}/react-doc/docs.json`);
const File = require('./components/File');

const ReactDoc = (props) => {
  return (
    <div>
      {props.docs.map(file =>
        <File {...file} />
      )}
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
