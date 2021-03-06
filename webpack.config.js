/**
 * Webpack 4 configuration file (Terser Version)
 * see https://webpack.js.org/configuration/
 * see https://webpack.js.org/configuration/dev-server/
 * ©2019 - Andreas Friedel
 */

"use strict";

const webpack = require("webpack");
const easmTransformer = require('@easm/ts-plugin-transform');
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
			"./app.tsx"
		]
	},

	devtool: env === "dist" ? false : "source-map",

	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			"@microsoft/typescript-etw": "./_does_not_exist_"
		}
	},

	output: {
		filename: "[name].js",
		path: path.resolve(cwd, "dist"),
		publicPath: "",
		globalObject: "self"
	},

	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader",
				options: {
					getCustomTransformers: program => ({
						before: [
							easmTransformer(program)
						]
					})
				}
			}]
		}, {
			test: /\.vs$|\.fs$/,
			exclude: /node_modules/,
			use: [{
				loader: "../lib/string-loader"
			}]
		}, {
			test: /\.png$|\.jpg$/,
			exclude: /node_modules/,
			use: [{
				loader: "file-loader",
				options: {
					name: "[path][hash:8].[ext]"
				}
			}]
		}, {
			test: /\.jsonc$/,
			exclude: /node_modules/,
			use: [{
				loader: "../lib/string-loader"
			}]
		}]
	},

	optimization: {
		noEmitOnErrors: true,
		namedModules: env !== "dist",
		namedChunks: env !== "dist",
		minimize: env === "dist",
		minimizer: minimizer,
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				named: {
					test: /[\\/]node_modules[\\/]|meshes[\\/]|shader[\\/]|textures[\\/]/,
					name(module) {
						if (module.context.match(/src[\\/]meshes/)) {
							return "meshes";
						}
						if (module.context.match(/src[\\/]shader/)) {
							return "shader";
						}
						if (module.context.match(/src[\\/]textures/)) {
							return "textures";
						}
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
		new CopyWebpackPlugin({
			patterns: [{
				from: path.resolve(cwd, "src/assets"),
				to: path.resolve(cwd, "dist/assets")
			}, {
				from: env === "dist" ? "../lib/worker/sw.min.js" : "../lib/worker/sw.js",
				to: "sw.js"
			}, {
				from: "offline.json",
				to: "offline.json"
			},
			...(env !== "dist")
				? [{
					from: "../lib/worker/sw.js.map",
					to: "sw.js.map"
				}]
				: []
			]
		}),
		new HtmlWebpackPlugin({
			baseUrl: "/",
			filename: "index.html",
			template: "index.html",
			inject: "body",
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		}),
		new HtmlWebpackPlugin({
			baseUrl: "/",
			filename: "offline.html",
			template: "offline.html",
			inject: "body",
			chunks: [],
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		}),
		...(env === "dist") ? [
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
			path: path.resolve(cwd, "dist"),
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
