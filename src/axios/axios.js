import axios from 'axios';

let instance;

export const init = (baseURL = 'https://randomuser.me') => {
    instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'get',
    });
};

export default (params) => {
    if (typeof instance === 'undefined') {
        throw new Error('need init axios instance');
    } else {
        const { data, token } = params;
        // TEMP:  may be structure of token will be changed
        return instance({ ...data })
            .then((response) => response)
            .catch((error) => {
                const { statusText, status } = error.response || {};

                const errorObj = {
                    statusText,
                    status,
                    response: error.response,
                };
                throw errorObj;
            });
    }
};
