const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = () => {
	return {
		target: 'web',
		devtool: isDev ? 'eval-source-map' : false,
		mode: isDev ? 'development' : 'production',
		experiments: {
			outputModule: true
		},
		output: {
			publicPath: '',
			library: {
				name: 'cardCollect',
				type: 'var',
				export: 'default'
			}
		},
		devServer: {
			port: 80,
			historyApiFallback: true
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.tsx?$/,
					use: ['babel-loader', 'ts-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				}
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js']
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './public/index.html'
			}),
			new webpack.DefinePlugin({
				PAYBYRD_TOKEN_URL: JSON.stringify(process.env.PAYBYRD_TOKEN_URL),
				PAYBYRD_CODE_KEY: JSON.stringify(process.env.PAYBYRD_CODE_KEY)
			}),
			new ESLintPlugin({
				files: 'src/**/*.ts'
			})
		]
	};
};
