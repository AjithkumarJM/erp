import axios from 'axios';
import cookie from 'react-cookies';
import { stringify } from 'query-string';

import { ROOT_URL, userInfo } from "../const";

function API_CALL(method, url, data, type, callback, file) {
    console.log("Calling API for the method of " + method + " : " + ROOT_URL + url);

    const { token } = userInfo;

    let header = {};
    if (token) header['Authorization'] = token;
    if (callback) {
        return async () => {
            axios({
                method,
                url: ROOT_URL + url,
                data,
                headers: {
                    "access-token": token
                },
                responseType: file ? 'arraybuffer' : 'json',
            }).then(data => callback(data))
        }
    } else {
        return async dispatch => {
            dispatch({ type: type.REQ })
            axios({
                method,
                url: ROOT_URL + url,
                data,
                headers: {
                    "access-token": token
                },
            })
                .then(response => dispatch({ type: type.RES, payload: response }))
                .catch((error) => dispatch({ type: type.FAIL, payload: error }))
        }
    }
}

export default API_CALL;