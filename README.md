## react_redux_api_helpers

react_redux_api_helpers is library for eiser using redux store and `redux-sagas` with request to server.
It based on redux-saga and axios packages.

## Getting started

### Installation

    $ npm install --save react_redux_api_helpers

or

    $ yarn add react_redux_api_helpers

### Usage

init in root saga:

    import  *  as  apiHelpers  from  'api';
    // some code

     const {modules: { apiWatchRequest },axios: { init },} = apiHelpers;
     //init main routes
     if (process.env.NODE_ENV == 'development') {
       init('http://localhost:3001'); //develop server
    } else if (process.env.NODE_ENV == 'production') {
       init('https://translates.goman.live');// production server
    }

    function* rootSaga(dispatch) {
    yield all([
        apiWatchRequest({
            additiveCallback: function*({ showLoaderFlag = true, ...data }) {
                //show loader
                if (showLoaderFlag) {
                    yield put(showLoader());
                }

                // add credentials for  request
                const credentials = yield select(authHashSelector);
                if (credentials) {
                    set(data, 'headers.Authorization', `${credentials}`);
                }
                return data;
            },
            successCallback: function*(data) {
                yield put(hideLoader());
                if (
                    data.config.method === 'put' ||
                    data.config.method === 'post' ||
                    data.config.method === 'delete'
                ) {
                    console.log(data);
                    const message = get(data, 'data.message');
                    if (message) {
                        yield put(showSuccess({ message }));
                    } else {
                        yield put(
                            showSuccess({ message: 'Successful operation.' }),
                        );
                    }
                }
            },
            failedCallback: function*(data) {
                const dataStatus = data.status;
                yield put(hideLoader());
                switch (true) {
                    case dataStatus === 401:
                        yield call(history.push, '/login');
                        return;
                    case dataStatus === 500:
                        yield put(
                            showError({ message: 'Internal server error.' }),
                        );
                        return;
                    case dataStatus === 406: {
                        const message = get(
                            data,
                            'response.data.message',
                            'Internal server error.',
                        );
                        yield put(showError({ message }));
                        return;
                    }
                    case dataStatus === 403: {
                        const message = get(
                            data,
                            'response.data.message',
                            'Internal server error.',
                        );
                        yield put(showError({ message }));
                        return;
                    }
                    default: {
                        const error = get(data, 'response.data.error');
                        if (
                            typeof error === 'object' &&
                            error.type === 'popup'
                        ) {
                            yield put(showError({ message: error.message }));
                        }
                        return;
                    }
                }
            },
        }),
        initModuleSaga(dispatch),
        authSaga(dispatch),
        i18nextModuleSaga(dispatch),
        notificationSaga(dispatch),
    ]);

    }

I recommended use principe Redux-ducks for organization of code , example below.

    import * as api_helpers from 'api';

    const modules = 'languages';
    const {
    helpers: { actionCreator, apiSelector },
    modules: { ApiRoutes },
    } = api_helpers;

    const apiRoutes = new ApiRoutes();

    export const GET_LANGUAGES_LIST_REQUEST = `${modules}/GET_LANGUAGES_LIST_REQUEST`

    export const POST_IMPORT_JSON_REQUEST = `${modules}/POST_IMPORT_JSON_REQUEST`;


    export const getTranslatedListRequest = actionCreator(
    GET_LANGUAGES_LIST_REQUEST,
    );

    export const postImportJsonRequest = actionCreator(POST_IMPORT_JSON_REQUEST);


    apiRoutes.add(GET_LANGUAGES_LIST_REQUEST, ({ ...params }) => ({
    url: `/get-all-keys`,
    method: 'get',
    params,
    }));

    apiRoutes.add(POST_IMPORT_JSON_REQUEST, (data) => {
    return {
        url: `/import-json`,
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
        showLoaderFlag:false

    };
    });

    export const getTranslatedListSelector = apiSelector(GET_LANGUAGES_LIST_REQUEST);

## API

### init(url)

`url` - base url for the axios.

### ApiRoutes.add(actionType, fn)

`actionType` - string must end with `_REQUEST`. For example `GET_USER_REQUEST`.
`fn` - function for prepare request. For example - `url: /import-json,

     (data) => {
        return {
            url: `/import-json`,
            method: 'post',
            data,
            headers: { 'Content-Type': 'multipart/form-data' },
            showLoaderFlag:false
        }

More information: https://github.com/axios/axios#request-config

### apiSelector(actionType,options)
