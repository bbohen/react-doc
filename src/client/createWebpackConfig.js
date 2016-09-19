const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    resolve: {
      alias: {
        docData: `${process.cwd()}/react-doc/docs.json`
      },
      extension: ['', '.js', '.jsx', '.json']
    },
    entry: `${__dirname}/index.js`,
    output: {
      path: `${process.cwd()}/react-doc`,
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', exclude: /node_modules/, include: __dirname },
        { test: /\.json$/, loader: 'json' }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ PROJECT: JSON.stringify(process.cwd()) }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: `${__dirname}/index.template.html`
      })
    ]
  };
};
