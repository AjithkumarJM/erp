import axios from 'axios';
import cookie from 'react-cookies';
import { stringify } from 'query-string';

import { ROOT_URL } from "../const";

function getToken() {
    return cookie.load('session');
}

function API_CALL(method, url, data, type, callback, file) {
    console.log("Calling API for the method of " + method + " : " + ROOT_URL + url);
    axios.interceptors.response.use(undefined, function (err) {
        // Handling the errors (e.g: 401 Unauthorized)
        console.log(err);
        // cookie.remove('session', {
        //     path: '/'
        // });
        // window.location.href = '/logout';
    });
    let header = {};
    if (getToken()) {
        header['Authorization'] = getToken();
    }
    if (callback) {
        return async () => {
            axios({
                method,
                url: ROOT_URL + url,
                data,
                headers: {
                    "access-token": cookie.load('session').token
                },
                responseType: file ? 'arraybuffer' : 'json',
            }).then(data => callback(data))
        }
    } else {
        return async (dispatch) => {
            dispatch({
                type: type.REQ
            })
            axios({
                method,
                url: ROOT_URL + url,
                data,
                headers: {
                    "access-token": cookie.load('session').token
                },
            }).then((response) => {
                dispatch({
                    type: type.RES,
                    payload: response
                })
            }).catch((error) => {
                dispatch({
                    type: type.FAIL,
                    payload: error
                })
            })
        }
    }
}

export default API_CALL;