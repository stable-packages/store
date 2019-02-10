'use strict';
const paramCase = require('param-case')
const pascalCase = require('pascal-case')
const path = require('path')
const UglifyJS = require('uglifyjs-webpack-plugin')

const pjson = require('./package.json')

const filename = paramCase(pjson.name)
const globalVariable = pascalCase(filename)

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
        options: {
          configFile: 'tsconfig.es5.json',
          transpileOnly: true
        }
      }
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: `${filename}.es5.js`,
    library: globalVariable
  },
  plugins: [
    new UglifyJS({
      sourceMap: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    mainFields: ['browser', 'main']
  }
}
