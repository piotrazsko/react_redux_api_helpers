const pug = require('pug')
const { version } = require('./package.json')

const fn = pug.compileFile('index.pug', { pretty: true })
const html = fn({ version })
const json = JSON.stringify({ version })

module.exports = { html, json, version }
