import typescript from 'rollup-plugin-typescript'

export default {
  input: ['src/index.ts'],
  output: [
    // ES module version, for modern browsers
    {
      file: 'lib/global-store-es.js',
      // dir: 'public/module',
      format: 'es',
      sourcemap: true
    },
    // SystemJS version, for older browsers
    {
      file: 'lib/global-store-systemjs.js',
      // dir: 'public/nomodule',
      format: 'system',
      sourcemap: true
    }
  ],
  experimentalCodeSplitting: true,
  plugins: [
    typescript()
  ]
};
