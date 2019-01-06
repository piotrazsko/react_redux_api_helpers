const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { html, json, version } = require('./version.js')

function VersionPlugin(options) {
	// console.log('App version: ', chalk.bold.green.inverse(options.ver))
}

VersionPlugin.prototype.apply = function(compiler) {
	compiler.plugin('compile', function(options) {
		console.log('App version: ', chalk.bold.green.inverse(version))
	})

	compiler.plugin('done', function() {
		fs.writeFileSync('./static/index.html', html)
		fs.writeFileSync('./static/meta.json', json)
	})
}

module.exports = VersionPlugin
