
// Modules
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

const APP_PATH_ENTRY = `${__dirname}/client/app/index.js`;
const DIR_DIST = `${__dirname}/dist`;
const DIR_PUBLIC = `${__dirname}/client/public`;
const INDEX_HTML = `${DIR_PUBLIC}/index.html`;

const ENV = process.env.npm_lifecycle_event;
let isTest = ENV === 'test' || ENV === 'test-watch';
let isProd = ENV === 'build';

let config = {
  devtool: 'eval',
  plugins: [],
  module: {
    preLoaders: [],
    loaders: []
  },
};

// ------------------------------------
// Entry/Output
// ------------------------------------
config.entry = isTest ? {} : {
  boot: APP_PATH_ENTRY
};

config.output = isTest ? {} : {
  path: DIR_DIST,
  publicPath: '', // or '/'
  filename: !isProd ? '[name].[hash].js' : '[name].bundle.js',
  chunkFilename: !isProd ? '[name].[hash].js' : '[name].bundle.js'
};

// ------------------------------------
// Aliases
// ------------------------------------

config.resolve = {
  root: path.resolve(__dirname),
  alias: {
    scene: 'client/app/scene',
    helpers: 'client/app/helpers',
    THREEx: 'client/app/THREEx',
    vendor: 'client/app/vendor',
    characters: 'client/app/characters',
    sceneObjects: 'client/app/sceneObjects',
    models: 'client/app/models'
  },
  extensions: ['', '.js']
};


// ------------------------------------
// Loaders
// ------------------------------------
// JS Loader
config.module.loaders.push({
  test: /\.js$/,
  loader: 'babel',
  exclude: /node_modules/,
  query: {
    presets: ['es2015'],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties'
    ]
  }
});
// Template Loader
config.module.loaders.push({
  test: /\.html$/,
  loader: 'raw'
});
/*
config.module.loaders.push({
  test: /[\/]jquery\.js$/,
  loader: 'expose?jQuery'
});
*/
// Asset Loader
config.module.loaders.push({
  test: /\.(png|jpg|jpeg|gif|svg)$/,
  loader: 'file'
});


// ------------------------------------
// Plugins
// ------------------------------------
config.plugins.push(
  new HtmlWebpackPlugin({
    template: INDEX_HTML,
    inject: 'body'
  }),
  new ExtractTextPlugin('[name].[hash].css', { disable: !isProd })
);

// Add build specific plugins
if (isProd) {
  config.plugins.push(
    // Only emit files when there are no errors
    new webpack.NoErrorsPlugin(),
    // Dedupe modules in the output
    new webpack.optimize.DedupePlugin(),
    // Minify all javascript, switch loaders to minimizing mode
    new webpack.optimize.UglifyJsPlugin(),
    // Copy assets from the public folder
    new CopyWebpackPlugin([{ from: DIR_PUBLIC }])
  );
}

// ------------------------------------
// Dev Server
// ------------------------------------
config.devServer = {
  contentBase: DIR_PUBLIC,
  host: '0.0.0.0',
  port: 3000,
  stats: 'minimal'
};

export default config;
