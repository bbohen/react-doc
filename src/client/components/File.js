const React = require('react');

const File = (props) => {
  const { comments = {}, name = {} } = props;
  const propTypeDisplay = comments.propTypes ? comments.propTypes.map((property) => {
    return (
      <li>{property.name} - Type: {property.paramType} - {property.description}</li>
    );
  }) : undefined;

  return (
    <div>
      <h1>{name}</h1>
      <h2>PropTypes:</h2>
      <ul>
        {propTypeDisplay}
      </ul>
    </div>
    );
};

File.propTypes = {
  comments: React.PropTypes.array,
  name: React.PropTypes.string
};

module.exports = File;
