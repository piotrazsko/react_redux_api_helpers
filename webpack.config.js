const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const _ = require('lodash')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const VersionPlugin = require('./webpack.version.js')
const pckg = require('./package.json')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

const plugins = [
	new HappyPack({
		id: 'js',
		verbose: false,
		threads: 4,
		loaders: ['babel-loader'],
	}),

	new HappyPack({
		id: 'styles',
		verbose: false,
		threads: 2,
		loaders: ['style-loader', 'raw-loader', 'less-loader'],
	}),

	new HappyPack({
		id: 'modules',
		verbose: false,
		threads: 2,
		loaders: [
			{
				loader: 'style-loader',
				options: { sourceMap: !isProd },
			},
			{
				loader: 'css-loader',
				options: {
					sourceMap: !isProd,
				},
			},
			{
				loader: 'postcss-loader',
				options: { sourceMap: !isProd },
			},
			{
				loader: 'less-loader',
				options: { sourceMap: !isProd },
			},
		],
	}),

	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(nodeEnv),
			VER: JSON.stringify(pckg.version),
		},
	}),

	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: ({ resource }) => resource && /node_modules/.test(resource) && !/antd/.test(resource),
		filename: 'vendor.bundle.js',
	}),

	new webpack.NamedModulesPlugin(),
	new VersionPlugin({ ver: pckg.version }),
	new ProgressBarPlugin(),
]

if (isProd) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }))
} else {
	plugins.push(new webpack.HotModuleReplacementPlugin())
	plugins.push(new webpack.SourceMapDevToolPlugin())
	plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false }))
}

const entry = isProd
	? ['./demo/index.js']
	: [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client',
			'webpack/hot/only-dev-server',
			'./demo/index.js',
		]

const modulePaths = {
	src: 'src',
	components: 'demo/components',
	configs: 'demo/configs',
	containers: 'demo/containers',
	helpers: 'demo/helpers',
	modules: 'demo/modules',
	selectors: 'demo/selectors',
	routes: 'demo/routes',
	store: 'demo/store',
	styles: 'demo/styles',
	mocks: 'demo/mocks',
}

const stylePaths = [
	/\.global/,
	/react-virtualized/,
	path.join(__dirname, 'demo/styles'),
	path.join(__dirname, 'src/styles'),
]

module.exports = {
	entry: {
		entry,
	},

	output: {
		path: path.join(__dirname, 'static'),
		filename: 'bundle.js',
		publicPath: '/',
	},

	resolve: {
		extensions: ['.js', '.scss', '.less'],
		alias: _.mapValues(modulePaths, str => path.join(process.cwd(), ...str.split('/'))),
	},

	plugins,

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: __dirname,
				exclude: /node_modules/,
				use: ['happypack/loader?id=js'],
			},
			{
				test: /\.(css|less)$/,
				exclude: stylePaths,
				use: [
					{
						loader: 'style-loader',
						options: { sourceMap: !isProd },
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							camelCase: true,
							localIdentName: '[folder]__[local]--[hash:base64:5]',
							importLoaders: 2,
							sourceMap: !isProd,
						},
					},
					{
						loader: 'postcss-loader',
						options: { sourceMap: !isProd },
					},
					{
						loader: 'less-loader',
						options: { sourceMap: !isProd },
					},
				],
			},
			{
				test: /\.(css|less)$/,
				include: stylePaths,
				use: [
					{
						loader: 'style-loader',
						options: { sourceMap: !isProd },
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: !isProd,
						},
					},
					{
						loader: 'postcss-loader',
						options: { sourceMap: !isProd },
					},
					{
						loader: 'less-loader',
						options: { sourceMap: !isProd },
					},
				],
			},
		],
	},
}
