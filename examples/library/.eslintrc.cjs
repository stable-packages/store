module.exports = {
	env: {
		jest: true
	},
	overrides: [
		{
			extends: ['plugin:harmony/ts-prettier'],
			files: ['*.ts', '*.tsx'],
			rules: {
				// using `var` for performance reasons
				'no-var': 'off'
			}
		}
	]
}
