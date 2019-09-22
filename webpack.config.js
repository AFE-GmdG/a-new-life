/**
 * Webpack 4 configuration file (Terser Version)
 * see https://webpack.js.org/configuration/
 * see https://webpack.js.org/configuration/dev-server/
 * ©2019 - Andreas Friedel
 */

"use strict";

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const terserOptions = require("./webpack.terser.js");
const HashAssetsPlugin = require("./lib/hash-assets-plugin");
const path = require("path");
const process = require("process");

const cwd = process.cwd();

const minimizer = [new TerserPlugin(terserOptions)];

module.exports = (env) => [{
	name: "game",

	mode: "none", // disable default webpack behavior - all settings are under our own control.

	target: "web",

	context: path.resolve(cwd, "src"),

	entry: {
		"app": [
			"./app.ts"
		]
	},

	devtool: env === "docs" ? false : "source-map",

	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"@microsoft/typescript-etw": "./_does_not_exist_"
		}
	},

	output: {
		filename: "[name].js",
		path: path.resolve(cwd, env === "docs" ? "docs" : "dist"),
		publicPath: "",
		globalObject: "self"
	},

	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader"
			}]
		}]
	},

	optimization: {
		noEmitOnErrors: true,
		namedModules: env !== "docs",
		namedChunks: env !== "docs",
		minimize: env === "docs",
		minimizer: minimizer,
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 16384,
			cacheGroups: {
				named: {
					test: /[\\/]node_modules[\\/]/,
					name(/*module*/) {
						// const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						// if (packageName.indexOf("typescript") !== -1) {
						// 	return "typescript";
						// } else {
						// 	return "vendor";
						// }
						return "vendor";
					}
				}
			}
		}
	},

	plugins: [
		new webpack.IgnorePlugin(
			/^@microsoft(\/|\\)typescript-etw$/
		),
		new CopyWebpackPlugin([{
			from: path.resolve(cwd, "src/assets/*.*"),
			to: path.resolve(cwd, env === "docs" ? "docs" : "dist")
		}, {
			from: env === "docs" ? "../lib/worker/sw.min.js" : "../lib/worker/sw.js",
			to: "sw.js"
		}, {
			from: "offline.json",
			to: "offline.json"
		},
		...(env !== "docs")
			? [{
				from: "../lib/worker/sw.js.map",
				to: "sw.js.map"
			}]
			:[]], {
			logLevel: "error"
		}),
		new HtmlWebpackPlugin({
			baseUrl: env === "docs" ? "http://a-friedel.github.io/a-new-life/" : "/",
			filename: "index.html",
			template: "index.html",
			inject: "body",
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		}),
		new HtmlWebpackPlugin({
			baseUrl: env === "docs" ? "http://a-friedel.github.io/a-new-life/" : "/",
			filename: "offline.html",
			template: "offline.html",
			inject: "body",
			chunks: [],
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		}),
		...(env === "docs") ? [
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: "'production'",
					VERSION: JSON.stringify(require("./package.json").version)
				}
			})
		] : [
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: "'development'",
					VERSION: JSON.stringify(require("./package.json").version)
				}
			})
		],
		new HashAssetsPlugin({
			path: path.resolve(cwd, env === "docs" ? "docs" : "dist"),
			prettyPrint: true
		})
	],

	devServer: {
		historyApiFallback: true,
		public: "http://localhost:8087",
		disableHostCheck: true,
		port: 8087,
		contentBase: path.resolve(cwd, "dist"),
		compress: true,
		headers: {},
		host: "0.0.0.0",
		inline: true,
		hot: false,
		quiet: false,
		stats: {
			colors: true
		}
	}
}];
