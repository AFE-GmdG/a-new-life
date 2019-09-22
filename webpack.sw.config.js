/**
 * Webpack 4 configuration file (Terser Version)
 * see https://webpack.js.org/configuration/
 * see https://webpack.js.org/configuration/dev-server/
 * ©2019 - Andreas Friedel
 */

"use strict";

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const terserOptions = require("./webpack.terser.js");
const path = require("path");
const process = require("process");

const cwd = process.cwd();

const minimizer = [new TerserPlugin(terserOptions)];

module.exports = (env) => [{
	name: "ServiceWorker",

	mode: "none", // disable default webpack behavior - all settings are under our own control.

	target: "webworker",

	context: path.resolve(cwd, "serviceWorker"),

	entry: {
		sw: [
			"./appServiceWorker.ts"
		]
	},

	devtool: env === "release" ? false : "source-map",

	resolve: {
		extensions: [".ts", ".js"]
	},

	output: {
		filename: env === "release" ? "[name].min.js" : "[name].js",
		path: path.resolve(cwd, "lib/worker"),
		publicPath: ""
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
		namedModules: env !== "release",
		minimize: env === "release",
		minimizer: minimizer
	},

	plugins: (env === "release") ? [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: "'production'"
			}
		})
	] : [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: "'development'"
			}
		})
	]
}];
