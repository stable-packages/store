'use strict';
const paramCase = require('param-case')
const pascalCase = require('pascal-case')
const path = require('path')

const pjson = require('./package.json')

const filename = paramCase(pjson.name)
const globalVariable = pascalCase(filename)

module.exports = {
  devtool: 'source-map',
  entry: {
    [filename]: './dist/es5/index'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        loader: "source-map-loader",
        test: /\.js?$/
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${filename}.es5.js`,
    library: globalVariable,
    libraryTarget: 'var',
    devtoolModuleFilenameTemplate: (info) => {
      if (info.identifier.lastIndexOf('.ts') === info.identifier.length - 3) {
        return `webpack:///${pjson.name}/${info.resource.slice(9)}`
      }
      else {
        return `webpack:///${info.resourcePath}`
      }
    }
  }
}
