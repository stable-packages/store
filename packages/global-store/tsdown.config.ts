import { defineConfig } from 'tsdown'

export default defineConfig([
	{
		// per-module ESM and declarations: what `exports` and `types` point at
		entry: ['ts/index.ts'],
		format: 'esm',
		outDir: 'lib',
		unbundle: true,
		dts: true,
		sourcemap: true,
		target: 'es2020',
		platform: 'neutral',
		outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
		outputOptions: { preserveModulesRoot: 'ts' }
	},
	{
		// minified IIFE exposing the `GlobalStore` global, published as `dist/global-store.js`
		entry: { 'global-store': 'ts/index.ts' },
		format: 'iife',
		globalName: 'GlobalStore',
		outDir: 'dist',
		dts: false,
		minify: true,
		sourcemap: true,
		target: 'es2020',
		platform: 'browser',
		clean: false,
		outputOptions: { entryFileNames: '[name].js', exports: 'named' }
	}
])
