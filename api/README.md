# eco-api
> A collection of helpers, action creators and reducers for simple API access.

* [Quick start](#quick-start)
* [Modules](#modules) ([API](#api), [Generic](#generic), [Auth](#auth))
* [Configs](#configs) ([List of services](#list-of-webservices))
* [Helpers](#helpers)


## Quick start
```jsx
import React from 'react'
import { connect } from 'react-redux'
import { modules } from 'eco-api'
const { fetch } = modules.api

class Example extends React.Component {

  componentDidMount(){
    const { dispatch } = this.props
    dispatch( fetch( { location: 'school-courses:tags', path: 'tags' } ) )
  }

  render(){
    const { api } = this.props
    const { tags = [] } = api

    return <ul>{tags.map( tag => <li>{tag}</li> )}</ul>
  }
}

const const mapStateToProps = ({ api = {} }) => {
  return { api }
}

export default connect()(Example)

```

## Modules

> We provide 3 built in modules, which greatly simplify work with redux.  Modules are based on [redux-pack](https://github.com/lelandrichardson/redux-pack) & [redux-ducks](https://github.com/erikras/ducks-modular-redux)

### API

Example `GET` request
```js
dispatch( fetch( {location: 'service:path'} ) )
```

Example `GET` request to an external URI
```js
// use reserved service name external 
dispatch( fetch( {location: 'external:https://some.external.api.com'} ) )
```

Example `POST` request
```js
dispatch( post( {
  location: 'service:path',
  params: {
    data: {name: 'Alex'},
    initialData: {},
    onSuccess: ( result ) => console.log(result),
    onFailure: ( error ) => console.log(error),
  }
}))
```

Example `PUT` request
```js
dispatch( put( {
  location: 'service:path/id',
  params: {
    data: {name: 'Carl'},
    onSuccess: ( result ) => console.log(result),
    onFailure: ( error ) => console.log(error),
  }
}))
```

Example `DELETE` request
```js
dispatch( remove( {
  location: 'service:path',
  params: {
    data: [1, 2],
    onSuccess: ( result ) => console.log(result),
    onFailure: ( error ) => console.log(error),
  }
}))
```

Clearing a branch in reducer, uses immutable version of `_.unset`
```js
dispatch( clear( 'path.to.branch' ) )
```

### Request Object
```js
{
  // example: single-auth:login
  location: 'service-name:path',

  // optional reducer path, uses lodash _.get & _.set,
  path: 'reducer.path',


  params: {

    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream, Buffer
    data: {
      username: 'test@test.ru',
      password: '123456'
    },

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: {
      id: 12345
    },

     // shape of data onStart, an empty array by default
    initialData: [],

    // lifecycle callbacks
    onStart: initialPayload => onStart(initialPayload),
    onSuccess: response => onSuccess(response),
    onFailure: error => onFailure(error),
    onFinish: hasSucceeded => onFinish(hasSucceeded)

    // the rest of the options is the same as axios request
    // https://github.com/axios/axios#request-config
  }
}
```

### Generic

> `setIn` is used to set/replace data in a given path, based on `_.set`  
Example usage of `setIn` action

```js
dispatch( setIn('greeting', 'Hello there!') ) // {greeting: 'Hello there!'}
dispatch( setIn('greeting', 'Hi!') ) // {greeting: 'Hi!'}
dispatch( setIn('ids', [1, 2, 3]) ) // {greeting: 'Hi!', ids: [1, 2, 3]}
dispatch( setIn('foo', {bar: 'baz'}) ) // {greeting: 'Hi!', ids: [1, 2, 3], foo: {bar: 'baz'}}
dispatch( setIn('foo.bar', [1, 2, 3]) ) // {greeting: 'Hi!', ids: [1, 2, 3], foo: {bar: [1, 2, 3]}}
```

> `unsetIn` is used to delete data on path, based on `_.unset`  
Example usage of `unsetIn` action

```js
dispatch( unsetIn('greeting') ) // {ids: [1, 2, 3], foo: {bar: [1, 2, 3]}}
dispatch( unsetIn('foo.bar') ) // {ids: [1, 2, 3], foo: {}}
```

> `mergeIn` is used for recursive merge with an object on path, based on `_.merge`  
Example usage of `mergeIn` action

```js
dispatch( mergeIn('data', {foo: {bar: 'baz'} }) ) // {data: {foo: {bar: 'baz'}}}
dispatch( mergeIn('data.foo.bar', 'qux') ) // {data: {foo: {bar: 'qux'}}}
dispatch( mergeIn('data', {name: 'Alex'}) ) // {data: {foo: {bar: 'qux'}, name: 'Alex'}}

```

> `reset` returns the whole reducer back to initial state  
Example usage of `reset` action

```js
dispatch( reset() ) // initialState

```

### Auth

> `login` action attempts to verify user and get an authorization token.  The token is stored in a cookie and used for API access authorization.  `login` action uses the same [request object](#request-object) as API actions.

```js
dispatch( login({
  location: 'single-auth:login',
  params: {
    data: {
      username: 'test@test.ru',
      password: '123456'
    },

    onSuccess: res => history.push('/protected/area')
  }
}) )
```

> `logout` action is a placeholder, it will destroy user's cookie.

```js
dispatch( logout() )
```

## Configs

> Commonly used Configs

### List of webservices

> Current list of web services is available in [apiLocations](src/configs/apiLocations.js)

### Environment
> Accessible through namespace **_env_**

```
import { configs } from 'eco-api'

const {
  resolveEnvironment,
  resolvePortalUrl, 
  resolveAdminUrl
} = configs

resolveEnvironment() // -> dev || prod
resolvePortalUrl( '/courses' ) // https://portalurl/courses
resolveAdminUrl( '/courses' ) // https://admin/courses

```


## Helpers

> WIP
