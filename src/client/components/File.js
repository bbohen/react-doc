const React = require('react');

const File = (props) => {
  const { comments = {}, name = {} } = props;
  const propTypeDisplay = comments.propTypes ? comments.propTypes.map((property) => {
    return (
      <div>
        <h2>{property.name}</h2>
        <h3>Type: {property.paramType}</h3>
        <p>{property.description}</p>
      </div>
    );
  }) : undefined;

  return (
    <div>
      <h1>{name}</h1>
      {propTypeDisplay}
    </div>
    );
};

File.propTypes = {
  comments: React.PropTypes.array,
  name: React.PropTypes.string
};

module.exports = File;
