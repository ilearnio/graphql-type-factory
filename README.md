# [graphql](http://graphql.org/)-type-factory

> Additional GraphQL types

# DEPRECATION WARNING

After many fixes applied to this **FORK** I decided to create a separate NPM package with rewritten from scratch logic and unit tests https://www.npmjs.com/package/graphql-type

## Setup

Install the package.

```
npm i --save graphql-type-factory
```

Use new types as you would use the default GraphQL types.

```js
const {
  stringFactory,
  ...
} = require('graphql-type-factory')
```

## Types

#### ::: String Factory

```
stringFactory({
  name:         ... Type name.
  description:  ... Type description.
  min:          ... Minimum string length.
  max:          ... Maximum string length.
  regex:        ... Regular expression pattern.
  test:         ... Method which returns `true` when input is valid.
});
```

Example:

```js
const { stringFactory } = require('graphql-type-factory')

const Username = stringFactory({
  name: 'Username',
  description: 'Username for auth forms.',
  min: 3,
  max: 30,
  regex: /^[A-Za-z0-9_]+$/,
  test: (value, ast) => {
    return !reservedUsernames.includes(value)
  }
});
```

#### ::: Integer Factory

```
intFactory({
  name:         ... Type name.
  description:  ... Type description.
  min:          ... Minimum number.
  max:          ... Maximum number.
  regex:        ... Regular expression pattern (might be useful even for integers).
  test:         ... Method which returns `true` when input is valid.
});
```

Example:

```js
const { intFactory } = require('graphql-type-factory')

const BirthDate = intFactory({
  name: 'BirthDate',
  min: 1870,
  max: 2018
})
```

#### ::: Float Factory

```
floatFactory({
  name:         ... Type name.
  description:  ... Type description.
  min:          ... Minimum number.
  max:          ... Maximum number.
  maxDecimals:  ... Maximum number of decimals.
  test:         ... Method which returns `true` when input is valid.
});
```

Example:

```js
const { floatFactory } = require('graphql-type-factory')

const DonutPrice = floatFactory({
  name: 'MyFloat',
  min: 1.59,
  max: 12.99,
  maxDecimals: 2
})
```
