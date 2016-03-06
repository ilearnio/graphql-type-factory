var GraphQLScalarType = require('graphql').GraphQLScalarType
var GraphQLError = require('graphql/error').GraphQLError
var Kind = require('graphql/language').Kind

var GraphQLStringFactory = function (attrs) {
  return new GraphQLScalarType({
    name: attrs.name,
    description: attrs.description,
    serialize: function (value) {
      return value
    },
    parseValue: function (value) {
      return value
    },
    parseLiteral: function (ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
          'string value.', [ast])
      }
      if (!attrs.minLength && !attrs.maxLength && !attrs.regex && !attrs.fn) {
        throw new GraphQLError('At least one validation rule must be ' +
          'specified.', [ast])
      }
      if (attrs.minLength && ast.value.length <= attrs.minLength) {
        throw new GraphQLError('Minimum length for "' + attrs.name + '" is ' +
          attrs.minLength + '.', [ast])
      }
      if (attrs.maxLength && ast.value.length >= attrs.maxLength) {
        throw new GraphQLError('Maximum length for "' + attrs.name + '" is ' +
          attrs.maxLength + '.', [ast])
      }
      if (attrs.regex && !attrs.regex.test(ast.value)) {
        throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
      }
      if (attrs.fn && !attrs.fn(ast)) {
        throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
      }
      return ast.value
    }
  })
}

var GraphQLIntFactory = function (attrs) {
  return new GraphQLScalarType({
    name: attrs.name,
    description: attrs.description,
    serialize: function (value) {
      return value
    },
    parseValue: function (value) {
      return value
    },
    parseLiteral: function (ast) {
      if (ast.kind !== Kind.INT) {
        throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
          'integer value.', [ast])
      }
      if (!attrs.min && !attrs.max && !attrs.regex && !attrs.fn) {
        throw new GraphQLError('At least one validation rule must be ' +
          'specified.', [ast])
      }
      if (attrs.min && ast.value <= attrs.min) {
        throw new GraphQLError('Minimum number for "' + attrs.name + '" is ' +
          attrs.min + '.', [ast])
      }
      if (attrs.max && ast.value >= attrs.max) {
        throw new GraphQLError('Maximum number for "' + attrs.name + '" is ' +
          attrs.max + '.', [ast])
      }
      if (attrs.regex && !attrs.regex.test(ast.value)) {
        throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
      }
      if (attrs.fn && !attrs.fn(ast)) {
        throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
      }
      return ast.value - 0
    }
  })
}

var GraphQLEmailType = GraphQLStringFactory({
  name: 'Email',
  min: 4,
  max: 254,
  regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
  fn: (ast) => true
})

var GraphQLURLType = GraphQLStringFactory({
  name: 'URL',
  max: 2083,
  regex: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
})

module.exports = {
  GraphQLStringFactory: GraphQLStringFactory,
  GraphQLIntFactory: GraphQLIntFactory,
  GraphQLEmailType: GraphQLEmailType,
  GraphQLURLType: GraphQLURLType
}
