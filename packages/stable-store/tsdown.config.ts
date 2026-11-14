import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['ts/index.ts'],
	format: 'esm',
	outDir: 'esm',
	unbundle: true,
	dts: true,
	sourcemap: true,
	target: 'es2020',
	platform: 'neutral',
	outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
	outputOptions: { preserveModulesRoot: 'ts' }
})
