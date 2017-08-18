var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	context: __dirname + "/src",
	devtool: debug ? "inline-sourcemap": null,
	entry: "./js/client.js",
	module:{
		loaders:[
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query:{
					presets: ['react', 'es2015', 'stage-0'],
					plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
				}
	  		},
            // compiles sass and loads css
            {
            	test: /\.scss$/, 
            	loader: ExtractTextPlugin.extract('css!sass')
            }
   		]
	},
	output: {
		path: __dirname + "/src/",
		filename: "client.min.js"
	},
	plugins: debug ? [
		new ExtractTextPlugin('css/style.css')
	] : [
		new ExtractTextPlugin('css/style.css'),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({mangle: true, sourcemap: false, comments: false}),
	]
};