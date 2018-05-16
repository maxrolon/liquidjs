const Liquid = require('..')
const lexical = Liquid.lexical
const re = new RegExp(`(${lexical.identifier.source})`)
const assert = require('../src/util/assert.js')

module.exports = function (liquid) {
  liquid.registerTag('schema', {
    parse: function (tagToken, remainTokens) {
      this.templates = []

      var stream = liquid.parser.parseStream(remainTokens)
      stream.on('tag:endschema', token => stream.stop())
        .on('template', tpl => this.templates.push(tpl))
        .on('end', x => {
          throw new Error(`tag ${tagToken.raw} not closed`)
        })
      stream.start()
    },
    render: function (scope, hash) {
      return liquid.renderer.renderTemplates(this.templates, scope)
        .then((html) => {
          scope.set(this.variable, html)
        })
    }
  })
}
