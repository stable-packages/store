import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: './ts/index.ts',
  output: [
    {
      format: 'iife',
      file: 'dist/global-store.js',
      name: 'GlobalStore',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [typescript({
    tsconfig: './tsconfig.rollup.json'
  }), terser({
    format: { comments: false }
  })
  ]
}

export default config
