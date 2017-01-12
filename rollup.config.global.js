import paramCase from 'param-case';
import pascalCase from 'pascal-case';
import commonjs from 'rollup-plugin-commonjs';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';

const pkg = require('./package');

const moduleName = pascalCase(pkg.name)

export default {
  moduleId: pkg.name,
  moduleName,
  entry: 'dist/commonjs/index.js',
  exports: 'named',
  dest: `dist/${paramCase(pkg.name)}.js`,
  format: 'iife',
  sourceMap: true,
  plugins: [
    sourcemaps(),
    nodeResolve({ jsnext: true }),
    nodeGlobals(),
    nodeBuiltins(),
    commonjs(),
    uglify()
  ]
};
