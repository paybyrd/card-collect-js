const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = (env) => {
	return {
		target: 'web',
		devtool: isDev ? 'eval-source-map' : false,
		experiments: {
			outputModule: true,
		},
		output: {
			path: path.join(__dirname, '/dist'),
			publicPath: "",
			library: {
				name: "cardCollect",
				type: "var",
				export: "default",
			},
			filename: 'cardCollect-web.js',
			scriptType: 'text/javascript'
		},
		devServer: {
			port: 3000,
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
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './public/index.html',
			}),
			new webpack.DefinePlugin({
				VGS_CNAME: JSON.stringify(process.env.VGS_CNAME),
				VGS_GATEWAY_CNAME: JSON.stringify(process.env.VGS_GATEWAY_CNAME),
				VGS_VAULTID: JSON.stringify(process.env.VGS_VAULTID),
				VGS_ENV: JSON.stringify(process.env.VGS_ENV),
				VGS_CODE_KEY: JSON.stringify(process.env.VGS_CODE_KEY),
				PAYBYRD_API_URL: JSON.stringify(process.env.PAYBYRD_API_URL),
			}),
			new ESLintPlugin({
				files: 'src/**/*.js'
			})
		]
	};
};
