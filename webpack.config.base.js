const webpack = require('webpack')
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'
const sourcePath = path.join(__dirname, 'src')
const distPath = path.join(__dirname, 'build', 'assets')

const definitions = {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    API_HOST: isProduction ? 'window.API_HOST' : JSON.stringify(process.env.API_HOST),
    WEB_APP_HOST: isProduction ? 'window.WEB_APP_HOST' : JSON.stringify(process.env.WEB_APP_HOST),
  },
}

const plugins = [
  new webpack.DefinePlugin(definitions),
]

const rules = [
  {
    test: /\.js$/,
    include: [path.join(__dirname, 'src'), path.join(__dirname, 'modules')],
    use: [
      { loader: 'babel-loader' },
    ],
  },
  {
    test: /\.svg$/,
    use: 'svg-inline-loader',
  },
  {
    test: /\.(png|gif|jpg)$/,
    include: sourcePath,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 20480,
          name: 'assets/[name]-[hash].[ext]',
        },
      },
    ],
  },
]

const config = {
  context: sourcePath,
  entry: {
    app: [
      'react-hot-loader/patch',
      'babel-polyfill',
      'es6-promise',
      './index.js',
    ],
  },
  output: {
    path: distPath,
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.scss'],
    modules: [
      path.resolve(__dirname, 'patched_node_modules'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'modules'),
      sourcePath,
    ],
  },
  plugins,
}

module.exports = config
