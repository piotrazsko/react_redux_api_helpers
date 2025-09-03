# react_redux_api - Complete API Documentation

A comprehensive library for easier Redux store management and `redux-saga` integration with server requests. Built on top of redux-saga and axios packages.

**Version**: 0.0.9
**Author**: Siarhei Petrashka
**License**: MIT

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Axios Module](#axios-module)
  - [Helpers Module](#helpers-module)
  - [Modules](#modules-module)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)

## Installation

```bash
npm install --save react_redux_api
```

or

```bash
yarn add react_redux_api
```

## Quick Start

```javascript
import * as apiHelpers from 'react_redux_api';

const { modules: { apiWatchRequest }, axios: { init } } = apiHelpers;

// Initialize axios with base URL
if (process.env.NODE_ENV === 'development') {
  init('http://localhost:3001');
} else {
  init('https://your-production-server.com');
}

// Setup in root saga
function* rootSaga() {
  yield all([
    apiWatchRequest({
      additiveCallback: function*({ showLoaderFlag = true, ...data }) {
        // Add custom logic before request
        return data;
      },
      successCallback: function*(data) {
        // Handle successful responses
        console.log('Success:', data);
      },
      failedCallback: function*(error) {
        // Handle failed responses
        console.error('Error:', error);
      }
    })
  ]);
}
```

---

## API Reference

### Axios Module

#### `init(baseURL?: string): void`

Initializes the axios instance with a base URL and default configuration.

**Parameters:**
- `baseURL` (string, optional): The base URL for all API requests. Defaults to `'http://localhost:3000'`

**Example:**
```javascript
import { axios } from 'react_redux_api';

axios.init('https://api.example.com');
```

#### `axios(params: ApiRequestParams): Promise<AxiosResponse>`

Makes HTTP requests using the configured axios instance.

**Parameters:**
- `params` (ApiRequestParams): Request configuration object

**ApiRequestParams Interface:**
```typescript
interface ApiRequestParams {
  data: AxiosRequestConfig;
  token?: string;
}
```

**Returns:** `Promise<AxiosResponse>` - Axios response object

**Throws:** `ApiErrorResponse` - Error object with status information

**ApiErrorResponse Interface:**
```typescript
interface ApiErrorResponse {
  statusText?: string;
  status?: number;
  response?: any;
}
```

---

### Helpers Module

#### `actionCreator(actionType: string, reducerOptions?: ReducerOptions)`

Creates Redux action creators with enhanced functionality for API requests.

**Parameters:**
- `actionType` (string): Action type string (must end with `_REQUEST`)
- `reducerOptions` (ReducerOptions, optional): Configuration options for the reducer

**ReducerOptions Interface:**
```typescript
interface ReducerOptions {
  responseDataPrepare?: (data: any) => any;
  preventSuccess?: boolean;
  preventFailure?: boolean;
  postSaveToStoreCallback?: boolean | ((response: any) => void);
}
```

**Returns:** Function that creates actions with the following signature:
```typescript
(payload?: any, options?: ActionOptions) => ExtendedAction
```

**ActionOptions Interface:**
```typescript
interface ActionOptions {
  onFailure?: (error: any) => void;
  onSuccess?: (response: any) => void;
  key?: string;
  preventSuccess?: boolean;
  preventFailure?: boolean;
  postSaveToStoreCallback?: (response: any) => void;
}
```

**ExtendedAction Interface:**
```typescript
interface ExtendedAction {
  type: string;
  payload?: any;
  onFailure?: (error: any) => void;
  onSuccess?: (response: any) => void;
  key?: string;
  preventSuccess?: boolean;
  preventFailure?: boolean;
  postSaveToStoreCallback?: (response: any) => void;
  responseDataPrepare?: (data: any) => any;
  beforeRequestCallback?: (data: any) => void;
}
```

**Example:**
```javascript
import { helpers } from 'react_redux_api';

const getUserRequest = helpers.actionCreator('GET_USER_REQUEST', {
  responseDataPrepare: (data) => data.user,
  preventSuccess: false
});

// Usage
dispatch(getUserRequest({ userId: 123 }, {
  onSuccess: (response) => console.log('User loaded:', response),
  onFailure: (error) => console.error('Failed to load user:', error)
}));
```

#### `responseActionsTypes(actionRequestType: string): ResponseActionTypes`

Generates corresponding SUCCESS and FAILED action types from a REQUEST action type.

**Parameters:**
- `actionRequestType` (string): Action type ending with `_REQUEST`

**Returns:** `ResponseActionTypes` object

**ResponseActionTypes Interface:**
```typescript
interface ResponseActionTypes {
  successAction: string;
  failedAction: string;
}
```

**Example:**
```javascript
const actionTypes = helpers.responseActionsTypes('GET_USER_REQUEST');
// Returns: { successAction: 'GET_USER_SUCCESS', failedAction: 'GET_USER_FAILED' }
```

#### `apiSelector(actionName: string, options?: ApiSelectorOptions): (state: ApiState) => T`

Creates memoized selectors for accessing API data from Redux state.

**Parameters:**
- `actionName` (string): Action name ending with `_REQUEST`
- `options` (ApiSelectorOptions, optional): Selector configuration options

**ApiSelectorOptions Interface:**
```typescript
interface ApiSelectorOptions<T = any> {
  onlyResultObject?: boolean;      // Return only response data (default: true)
  filter?: 'success' | 'failed' | false;  // Filter by status (default: 'success')
  resultPrepareCallback?: (result: T) => T;  // Transform result before returning
  key?: string;                    // Key for multiple instances of same request
  initialData?: T;                 // Default data when no response exists
}
```

**ApiState Interface:**
```typescript
interface ApiState {
  api: {
    [key: string]: {
      responseData?: any;
      timestamp?: number;
      loading?: boolean;
      loaded?: boolean;
      status?: 'success' | 'failed' | false;
    }
  }
}
```

**Returns:** Selector function that takes state and returns the selected data

**Example:**
```javascript
import { helpers } from 'react_redux_api';

const getUserSelector = helpers.apiSelector('GET_USER_REQUEST', {
  filter: 'success',
  initialData: { name: 'Unknown' },
  resultPrepareCallback: (user) => ({
    ...user,
    displayName: `${user.firstName} ${user.lastName}`
  })
});

// In component
const user = useSelector(getUserSelector);
```

#### `getConstantsFromRequestConstant(str: string, div?: string): ActionConstants`

Generates action constants object from a request constant string.

**Parameters:**
- `str` (string): Request action type string
- `div` (string, optional): Delimiter for splitting action name (default: '/')

**Returns:** `ActionConstants` object with SUCCESS, FAILED, and REQUEST constants

**ActionConstants Interface:**
```typescript
interface ActionConstants {
  [key: string]: string;
}
```

**Example:**
```javascript
const constants = helpers.getConstantsFromRequestConstant('users/GET_USER_REQUEST');
// Returns: { GET_USER_SUCCESS: 'users/GET_USER_SUCCESS', GET_USER_FAILED: 'users/GET_USER_FAILED', GET_USER_REQUEST: 'users/GET_USER_REQUEST' }
```

---

### Modules Module

#### `apiWatchRequest(options?: CallApiOptions, takeEveryEffect?): SagaIterator`

Main saga that watches for `_REQUEST` actions and handles API calls automatically.

**Parameters:**
- `options` (CallApiOptions, optional): Configuration options for API handling
- `takeEveryEffect` (function, optional): Redux-saga effect to use (default: takeEvery)

**CallApiOptions Interface:**
```typescript
interface CallApiOptions {
  apiService?: (params: ApiRequestParams) => Promise<AxiosResponse>;
  additiveCallback?: ((data: any) => any) | null;
  successCallback?: ((response: any) => any) | null;
  failedCallback?: ((errorModel: any) => any) | null;
  stopRequest?: (data: any) => boolean;
  preventSuccessAction?: boolean;
  preventFailedAction?: boolean;
  call?: typeof callSaga;
  put?: typeof putSaga;
}
```

**Option Descriptions:**
- `apiService`: Custom API service function (defaults to built-in axios)
- `additiveCallback`: Generator function called before each request to modify request data
- `successCallback`: Generator function called after successful requests
- `failedCallback`: Generator function called after failed requests
- `stopRequest`: Function to conditionally stop requests
- `preventSuccessAction`: Prevent dispatching SUCCESS actions
- `preventFailedAction`: Prevent dispatching FAILED actions
- `call`, `put`: Redux-saga effects (for testing)

**Example:**
```javascript
import { modules } from 'react_redux_api';

function* rootSaga() {
  yield all([
    modules.apiWatchRequest({
      additiveCallback: function*({ showLoaderFlag = true, ...data }) {
        if (showLoaderFlag) {
          yield put(showLoader());
        }

        // Add authentication token
        const token = yield select(getAuthToken);
        if (token) {
          data.headers = { ...data.headers, Authorization: `Bearer ${token}` };
        }

        return data;
      },
      successCallback: function*(response) {
        yield put(hideLoader());
        if (['post', 'put', 'delete'].includes(response.config.method)) {
          yield put(showSuccessMessage('Operation completed successfully'));
        }
      },
      failedCallback: function*(error) {
        yield put(hideLoader());
        switch (error.status) {
          case 401:
            yield put(logout());
            break;
          case 500:
            yield put(showErrorMessage('Server error occurred'));
            break;
          default:
            yield put(showErrorMessage(error.message || 'An error occurred'));
        }
      }
    })
  ]);
}
```

#### `apiDefaultReducer(state: ApiReducerState, action: ApiAction): ApiReducerState`

Default reducer that automatically handles API request states.

**Parameters:**
- `state` (ApiReducerState): Current state
- `action` (ApiAction): Redux action

**ApiReducerState Interface:**
```typescript
interface ApiReducerState {
  [key: string]: ApiStateItem;
}

interface ApiStateItem {
  responseData?: any;
  loading?: boolean;
  loaded?: boolean;
  timestamp?: number;
  [key: string]: any;
}
```

**ApiAction Interface:**
```typescript
interface ApiAction extends AnyAction {
  type: string;
  key?: string;
  response?: {
    data?: any;
    [key: string]: any;
  };
  payload?: any;
}
```

**Handled Action Types:**
- `*_REQUEST`: Sets loading state
- `*_SUCCESS`: Sets success state with response data
- `*_FAILED`: Sets error state
- `*_CLEAR`: Clears specific request data
- `FORCE_CLEAR_ALL_API`: Clears all API data

**Example:**
```javascript
import { combineReducers } from 'redux';
import { modules } from 'react_redux_api';

const rootReducer = combineReducers({
  api: modules.apiDefaultReducer,
  // other reducers...
});
```

#### `ApiRoutes` Class

Singleton class for managing API route definitions.

**Methods:**

##### `add(key: string, func: ApiRouteFunction): void`

Adds a new API route definition.

**Parameters:**
- `key` (string): Action type (must end with `_REQUEST`)
- `func` (ApiRouteFunction): Function that returns axios request configuration

**ApiRouteFunction Type:**
```typescript
type ApiRouteFunction = (payload?: any) => any;
```

**Example:**
```javascript
import { modules } from 'react_redux_api';

const apiRoutes = new modules.ApiRoutes();

// Add route definitions
apiRoutes.add('GET_USERS_REQUEST', ({ page = 1, limit = 10 }) => ({
  url: '/users',
  method: 'get',
  params: { page, limit }
}));

apiRoutes.add('CREATE_USER_REQUEST', (userData) => ({
  url: '/users',
  method: 'post',
  data: userData,
  headers: { 'Content-Type': 'application/json' }
}));

apiRoutes.add('UPLOAD_FILE_REQUEST', (fileData) => ({
  url: '/upload',
  method: 'post',
  data: fileData,
  headers: { 'Content-Type': 'multipart/form-data' },
  showLoaderFlag: false  // Custom flag to prevent loader
}));
```

#### `apiRoutes` Instance

Pre-created singleton instance of ApiRoutes class.

**Example:**
```javascript
import { modules } from 'react_redux_api';

modules.apiRoutes.add('GET_PROFILE_REQUEST', () => ({
  url: '/profile',
  method: 'get'
}));
```

---

## TypeScript Support

The library is written in TypeScript and provides comprehensive type definitions. All interfaces and types are exported for use in your TypeScript projects.

**Key Type Exports:**
- `ApiRequestParams`, `ApiErrorResponse`
- `ReducerOptions`, `ActionOptions`, `ExtendedAction`, `ResponseActionTypes`
- `ApiSelectorOptions`, `ApiState`, `ApiResult`
- `CallApiOptions`, `ApiMethods`, `ErrorModel`
- `ApiStateItem`, `ApiReducerState`, `ApiAction`
- `ApiRouteFunction`, `ApiRoutesInterface`

---

## Examples

### Complete Setup Example

```javascript
// store/api.js
import * as apiHelpers from 'react_redux_api';

const {
  modules: { apiWatchRequest, ApiRoutes, apiDefaultReducer },
  axios: { init },
  helpers: { actionCreator, apiSelector }
} = apiHelpers;

// Initialize axios
init(process.env.REACT_APP_API_URL || 'http://localhost:3001');

// Create API routes
const apiRoutes = new ApiRoutes();

// User-related routes
export const GET_USERS_REQUEST = 'users/GET_USERS_REQUEST';
export const CREATE_USER_REQUEST = 'users/CREATE_USER_REQUEST';
export const UPDATE_USER_REQUEST = 'users/UPDATE_USER_REQUEST';
export const DELETE_USER_REQUEST = 'users/DELETE_USER_REQUEST';

apiRoutes.add(GET_USERS_REQUEST, ({ page = 1, search = '' }) => ({
  url: '/users',
  method: 'get',
  params: { page, search }
}));

apiRoutes.add(CREATE_USER_REQUEST, (userData) => ({
  url: '/users',
  method: 'post',
  data: userData
}));

apiRoutes.add(UPDATE_USER_REQUEST, ({ id, ...userData }) => ({
  url: `/users/${id}`,
  method: 'put',
  data: userData
}));

apiRoutes.add(DELETE_USER_REQUEST, ({ id }) => ({
  url: `/users/${id}`,
  method: 'delete'
}));

// Action creators
export const getUsersRequest = actionCreator(GET_USERS_REQUEST);
export const createUserRequest = actionCreator(CREATE_USER_REQUEST);
export const updateUserRequest = actionCreator(UPDATE_USER_REQUEST);
export const deleteUserRequest = actionCreator(DELETE_USER_REQUEST);

// Selectors
export const getUsersSelector = apiSelector(GET_USERS_REQUEST, {
  initialData: { users: [], total: 0 }
});

// Root saga
export function* apiSaga() {
  yield all([
    apiWatchRequest({
      additiveCallback: function*({ showLoaderFlag = true, ...data }) {
        if (showLoaderFlag) {
          yield put({ type: 'SHOW_LOADER' });
        }

        const token = yield select(state => state.auth.token);
        if (token) {
          data.headers = {
            ...data.headers,
            Authorization: `Bearer ${token}`
          };
        }

        return data;
      },
      successCallback: function*(response) {
        yield put({ type: 'HIDE_LOADER' });
      },
      failedCallback: function*(error) {
        yield put({ type: 'HIDE_LOADER' });
        yield put({
          type: 'SHOW_ERROR',
          payload: error.message || 'An error occurred'
        });
      }
    })
  ]);
}

// Reducer setup
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  api: apiDefaultReducer,
  // other reducers...
});
```

### Component Usage Example

```javascript
// components/UsersList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsersRequest,
  getUsersSelector,
  createUserRequest
} from '../store/api';

function UsersList() {
  const dispatch = useDispatch();
  const usersData = useSelector(getUsersSelector);

  useEffect(() => {
    dispatch(getUsersRequest({ page: 1 }));
  }, [dispatch]);

  const handleCreateUser = (userData) => {
    dispatch(createUserRequest(userData, {
      onSuccess: (response) => {
        console.log('User created:', response);
        // Refresh users list
        dispatch(getUsersRequest({ page: 1 }));
      },
      onFailure: (error) => {
        console.error('Failed to create user:', error);
      }
    }));
  };

  if (!usersData.loaded) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h2>Users ({usersData.total})</h2>
      <ul>
        {usersData.users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
```

### Advanced Usage with Custom Options

```javascript
// Advanced selector with data transformation
export const getFormattedUsersSelector = apiSelector(GET_USERS_REQUEST, {
  filter: 'success',
  initialData: [],
  resultPrepareCallback: (data) => {
    if (!data.users) return [];

    return data.users.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      isActive: user.status === 'active'
    }));
  }
});

// Action creator with custom reducer options
export const getUserProfileRequest = actionCreator(GET_USER_PROFILE_REQUEST, {
  responseDataPrepare: (response) => ({
    ...response.data,
    lastFetched: Date.now()
  }),
  postSaveToStoreCallback: (response) => {
    // Custom logic after saving to store
    console.log('Profile data saved:', response.data);
  }
});

// Multiple API routes with different configurations
apiRoutes.add(UPLOAD_AVATAR_REQUEST, (file) => ({
  url: '/upload/avatar',
  method: 'post',
  data: file,
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 30000,
  showLoaderFlag: false // Custom flag
}));

apiRoutes.add(SEARCH_USERS_REQUEST, ({ query, filters }) => ({
  url: '/users/search',
  method: 'post',
  data: { query, filters },
  debounceMs: 300 // Custom debouncing
}));
```

This documentation covers all the exported methods and options in your react_redux_api library. Each section includes detailed parameter descriptions, TypeScript interfaces, and practical examples to help users understand and implement the library effectively.
