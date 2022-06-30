const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const panels = {
  channel: './src/dashboard/scripts/channel.js',
}

const pages = Object.keys(panels).map(
  (name) =>
    new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.join(__dirname, 'src', 'dashboard', `panel-template.html`),
      chunks: ['vendor', 'shared', name],
    }),
)

module.exports = {
  mode: 'production',
  entry: panels,
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 1,
        },
        shared: {
          test: /\.s?js$/,
          minSize: 0,
          minChunks: 2,
          name: 'shared',
          chunks: 'all',
          priority: 0,
        },
      },
    },
  },
  plugins: [new CleanWebpackPlugin(), ...pages],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dashboard'),
  },
}
