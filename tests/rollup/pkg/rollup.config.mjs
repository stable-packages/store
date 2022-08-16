import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: './src/index.ts',
  output: [
    {
      format: 'iife',
      file: 'dist/main.js',
      globals: {
        'global-store': 'GlobalStore'
      },
      name: 'TestMain',
      exports: 'named',
      sourcemap: true
    }
  ],
  external: ['global-store'],
  plugins: [typescript({
    tsconfig: './tsconfig.build.json'
  })]
}

export default config
