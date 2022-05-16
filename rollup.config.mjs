import typescript from '@rollup/plugin-typescript'

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
  })]
}

export default config
