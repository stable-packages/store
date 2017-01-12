'use strict';
const paramCase = require('param-case')
const pascalCase = require('pascal-case')
const path = require('path')
const webpack = require('webpack')

const pjson = require('./package.json')

const packageName = pjson.name
const filename = paramCase(packageName)
const version = pjson.version
let globalVariable = pascalCase(filename)

module.exports = {
  devtool: 'source-map',
  entry: {
    [filename]: './dist/commonjs/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${filename}.js`,
    library: globalVariable,
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`${filename}.js version: ${version} generated on: ${new Date().toDateString()}`)
  ]
}
