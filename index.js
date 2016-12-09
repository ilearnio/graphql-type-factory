var graphql = require('graphql')
var GraphQLError = require('graphql/error').GraphQLError
var GraphQLScalarType = graphql.GraphQLScalarType
var Kind = graphql.Kind

function identity(value) {
    return value;
}

var GraphQLStringFactory = function (attrs) {
    return new GraphQLScalarType({
        name: attrs.name,
        description: attrs.description,
        serialize: identity,
        parseValue: identity,
        parseLiteral: function (ast) {
            if (ast.kind !== Kind.STRING) {
                throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
                    'string value.', [ast])
            }
            if (!attrs.min && !attrs.max && !attrs.regex && !attrs.fn) {
                throw new GraphQLError('At least one validation rule must be ' +
                    'specified.', [ast])
            }
            if (attrs.min && ast.value.length <= attrs.min) {
                throw new GraphQLError('Minimum length for "' + attrs.name + '" is ' +
                    attrs.min + '.', [ast])
            }
            if (attrs.max && ast.value.length >= attrs.max) {
                throw new GraphQLError('Maximum length for "' + attrs.name + '" is ' +
                    attrs.max + '.', [ast])
            }
            if (attrs.regex && !attrs.regex.test(ast.value)) {
                throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
            }
            if (attrs.fn) {
                validateByFn(attrs.name, ast, attrs.fn)
            }
            return ast.value
        }
    })
}

var GraphQLDateFactory = function (attrs) {
    return new GraphQLScalarType({
        name: attrs.name,
        description: attrs.description,
        serialize: identity,
        parseValue: identity,
        parseLiteral: function (ast) {
            if (ast.kind !== Kind.STRING) {
                throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
                    'string or number value.', [ast])
            }

            const value = new Date(ast.value)
            if (attrs.min && ast.value.length <= attrs.min) {
                throw new GraphQLError('Minimum length for "' + attrs.name + '" is ' +
                    attrs.min + '.', [ast])
            }
            if (attrs.max && ast.value.length >= attrs.max) {
                throw new GraphQLError('Maximum length for "' + attrs.name + '" is ' +
                    attrs.max + '.', [ast])
            }
            if (attrs.regex && !attrs.regex.test(ast.value)) {
                throw new GraphQLError('"' + attrs.name + '" is invalid.', [ast])
            }
            if (attrs.fn) {
                validateByFn(attrs.name, ast, attrs.fn)
            }
            return value.toISOString();
        }
    })
}


var GraphQLIntFactory = function (attrs) {
    return new GraphQLScalarType({
        name: attrs.name,
        description: attrs.description,
        serialize: identity,
        parseValue: identity,
        parseLiteral: function (ast) {
            if (ast.kind !== Kind.INT) {
                throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
                    'integer value.', [ast])
            }
            if (!attrs.min && !attrs.max && !attrs.regex && !attrs.fn) {
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
            if (attrs.fn) {
                validateByFn(attrs.name, ast, attrs.fn)
            }
            return ast.value - 0
        }
    })
}

var GraphQLFloatFactory = function (attrs) {
    return new GraphQLScalarType({
        name: attrs.name,
        description: attrs.description,
        serialize: identity,
        parseValue: identity,
        parseLiteral: function (ast) {
            if (ast.kind !== Kind.FLOAT) {
                throw new GraphQLError('Expecting "' + attrs.name + '" to be ' +
                    'float value.', [ast])
            }
            if (!attrs.min && !attrs.max && !attrs.maxDecimals && !attrs.fn) {
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
            if (attrs.fn) {
                validateByFn(attrs.name, ast, attrs.fn)
            }
            return ast.value - 0
        }
    })
}

var GraphQLJSONType = new GraphQLScalarType({
    name: 'JSON',
    description:
    'The `JSON` scalar type represents JSON values as specified by ' +
    '[ECMA-404](http://www.ecma-international.org/' +
    'publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: identity,
    parseValue: identity,
    parseLiteral: function (ast) {
        switch (ast.kind) {
            case Kind.STRING:
            case Kind.BOOLEAN:
                return ast.value
            case Kind.INT:
            case Kind.FLOAT:
                return parseFloat(ast.value)
            case Kind.OBJECT: {
                const value = Object.create(null)
                ast.fields.forEach( (field) => {
                    value[field.name.value] = parseLiteral(field.value)
                })
                return value
            }
            case Kind.LIST:
                return ast.values.map(parseLiteral)
            default:
                return null
        }
    }
});


var GraphQLDateType = GraphQLDateFactory({
    name: 'Date',
    description: "Standard ISO date time format, ie. 2011-12-19T15:28:46.493Z",
    fn: function (ast) {
        return true
    }
})

var GraphQLEmailType = GraphQLStringFactory({
    name: 'Email',
    description: "Standard Email format, recepient@domain.ext",
    min: 4,
    max: 254,
    regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    fn: function (ast) {
        return true
    }
})

var GraphQLURLType = GraphQLStringFactory({
    name: 'URL',
    description: "URL format starting with http https or ftp",
    max: 2083,
    regex: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
})

function validateByFn(name, ast, fn) {
    var err = '"' + name + '" is invalid.'
    try {
        if (!fn(ast)) {
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
    GraphQLStringFactory: GraphQLStringFactory,
    GraphQLIntFactory: GraphQLIntFactory,
    GraphQLFloatFactory: GraphQLFloatFactory,
    GraphQLEmailType: GraphQLEmailType,
    GraphQLURLType: GraphQLURLType,
    GraphQLDateType: GraphQLDateType
}
