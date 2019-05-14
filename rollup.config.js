import typescript from 'rollup-plugin-typescript'

export default {
  input: ['src/index.ts'],
  output: [
    // ES module version, for modern browsers
    {
      exports: 'named',
      file: 'dist/global-store.es.js',
      format: 'es',
      sourcemap: true
    },
    // SystemJS version, for older browsers
    {
      exports: 'named',
      file: 'dist/global-store.systemjs.js',
      format: 'system',
      sourcemap: true
    }
  ],
  plugins: [
    typescript()
  ]
};
