const React = require('react');

const File = (props) => {
  const { componentProps, filename, name = {} } = props;
  const propTypeDisplay = componentProps ? componentProps.map((property) => {
    return (
      <li>{property.name} - {property.type}</li>
    );
  }) : undefined;

  return (
    <div>
      <h3>{name}</h3>
      <h4>{filename}</h4>
      <ul>
        {propTypeDisplay}
      </ul>
    </div>
    );
};

File.propTypes = {
  componentProps: React.PropTypes.array,
  filename: React.PropTypes.string,
  name: React.PropTypes.string
};

module.exports = File;
