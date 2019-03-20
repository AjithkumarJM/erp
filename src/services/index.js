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
            let callbackRequest;
            try {
                callbackRequest = await axios({
                    method,
                    url: ROOT_URL + url,
                    data,
                    headers: { "access-token": token },
                    responseType: file ? 'arraybuffer' : 'json',
                })

                callback(callbackRequest)
            } catch (error) {
                callback(error)
            }
        }
    } else {
        return async dispatch => {
            let nonCallbackRequest;
            dispatch({ type: type.REQ })

            try {
                nonCallbackRequest = await axios({
                    method,
                    url: ROOT_URL + url,
                    data,
                    headers: { "access-token": token },
                })
                dispatch({ type: type.RES, payload: nonCallbackRequest })
            } catch (error) {
                dispatch({ type: type.RES, payload: error })
            }
        }
    }
}

export default API_CALL;