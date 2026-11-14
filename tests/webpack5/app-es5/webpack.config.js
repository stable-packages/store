// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		open: true,
		host: 'localhost'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html'
		})

		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: 'ts-loader',
				exclude: ['/node_modules/'],
				options: {
					configFile: 'tsconfig.build.json'
				}
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: 'asset'
			}

			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		]
	},
	optimization: {
		minimize: false
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
	}
}

module.exports = (_env, argv) => {
	config.mode = argv.mode === 'production' ? 'production' : 'development'
	return config
}
