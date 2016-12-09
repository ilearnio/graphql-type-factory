# [graphql](http://graphql.org/)-type-factory

> Additional GraphQL types

## Setup

Install the package.

```
npm i --save graphql-type-factory
```

Use new types as you would use the default GraphQL types.

```js
import { ... } from 'graphql-type-factory'; // ES6
var GraphQLTypeFactory = require('graphql-type-factory'); // CommonJS
```

## Types

#### ::: String Factory

```
GraphQLStringFactory({
  name:         ... Type name.
  description:  ... Type description.
  min:          ... Minimum string length.
  max:          ... Maximum string length.
  regex:        ... Regular expression pattern.
  fn:           ... Method which returns `true` when input is valid.
});
```

Example:

```js
var NameType = GraphQLStringFactory({
  name: 'Name',
  fn: (ast) => ast.value.length > 5
});
```

#### ::: Integer Factory

```
GraphQLIntFactory({
  name:         ... Type name.
  description:  ... Type description.
  min:          ... Minimum number.
  max:          ... Maximum number.
  regex:        ... Regular expression pattern (might be useful even for integers).
  fn:           ... Method which returns `true` when input is valid.
});
```

Example:

```js
var NameType = GraphQLIntFactory({
  name: 'Name',
  min: 100000,
  max: 999999
})
```

#### ::: Float Factory

```
GraphQLFloatFactory({
  name:         ... Type name.
  description:  ... Type description.
  min:          ... Minimum number.
  max:          ... Maximum number.
  maxDecimals:  ... Maximum number of decimals.
  fn:           ... Method which returns `true` when input is valid.
});
```

Example:

```js
var NameType = GraphQLFloatFactory({
  name: 'Name',
  min: 1.5,
  max: 12.49,
  maxDecimals: 2
})
```

#### ::: Email

```
GraphQLEmailType
```

#### ::: URL

```
GraphQLURLType
```

## Example

How to run the example:

* Clone this repository.
* Run `npm install` to install the required modules.
* Run `npm run example` to start the GraphQL server.
* Create a new user.
```
curl -XPOST -H 'Content-Type:application/graphql' -d 'mutation RootMutation { addUser(id: "1", name: "John", email: "me@domain.com", dob:"2016-12-09", website: "http://domain.com")}' http://localhost:4444
```
* Retrieve created users.
```
curl -XPOST -H 'Content-Type:application/graphql' -d '{users{id, email, dob, website}}' http://localhost:4444
```
