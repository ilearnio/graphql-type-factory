var graphql = require('graphql')
var GraphQLError = require('graphql/error').GraphQLError
var GraphQLScalarType = graphql.GraphQLScalarType
var Kind = graphql.Kind

var stringFactory = function (attrs) {
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
      if (!attrs.minLength && !attrs.maxLength && !attrs.regex && !attrs.test) {
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
      if (attrs.test) {
        validateByFn(attrs.name, ast, attrs.test)
      }
      return ast.value
    }
  })
}

var intFactory = function (attrs) {
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
        throw new GraphQLError('Expecting "' + attrs.name + '" to be ' + 'integer value.', [ast])
      }
      if (!attrs.min && !attrs.max && !attrs.regex && !attrs.test) {
        throw new GraphQLError('At least one validation rule must be ' +
          'specified.', [ast])
      }
      if (attrs.min && ast.value < attrs.min) {
        throw new GraphQLError('Minimum number for "' + attrs.name + '" is ' +
          attrs.min + '.', [ast])
      }
      if (attrs.max && ast.value > attrs.max) {
        throw new GraphQLError('Maximum number for "' + attrs.name + '" is ' +
          attrs.max + '.', [ast])
      }
      if (attrs.regex && !attrs.regex.test(ast.value)) {
        throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
      }
      if (attrs.test) {
        validateByFn(attrs.name, ast, attrs.test)
      }
      return ast.value - 0
    }
  })
}

var floatFactory = function (attrs) {
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
      if (ast.kind !== Kind.FLOAT) {
        throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
          'float value.', [ast])
      }
      if (!attrs.min && !attrs.max && !attrs.maxDecimals && !attrs.test) {
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
      if (attrs.maxDecimals) {
        var parts = String(ast.value).split('.')
        if (parts.length === 2 && parts[1].length > attrs.maxDecimals) {
          throw new GraphQLError('The float number "' + attrs.name + '" ' +
            'should not exceed ' + attrs.maxDecimals + ' decimals.', [ast])
        }
      }
      if (attrs.test) {
        validateByFn(attrs.name, ast, attrs.test)
      }
      return ast.value - 0
    }
  })
}

function validateByFn (name, ast, test) {
  var err = '"' + name + '" is invalid.'
  try {
    if (!test(ast.value, ast)) {
      throw new GraphQLError(err, [ast])
    }
  } catch (e) {
    if (e instanceof GraphQLError) {
      throw new GraphQLError(e.message || err, [ast])
    }
    throw e
  }
}

module.exports = {
  stringFactory: stringFactory,
  intFactory: intFactory,
  floatFactory: floatFactory
}
