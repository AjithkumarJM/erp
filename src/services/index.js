import axios from 'axios';
import { ROOT_URL, userInfo } from '../const';

function API_CALL(method, url, data, type, callback, file) {
    console.log("Calling API for the method of " + method + " : " + ROOT_URL + url);
    axios.interceptors.response.use(undefined, function (err) {
        // Handling the errors (e.g: 401 Unauthorized)
        console.log(err);
    });

    let headers = {};
    if (userInfo) {
        const { token } = userInfo;
        headers['Authorization'] = token;
    }

    if (callback) {
        axios({
            method,
            url: ROOT_URL + url,
            data,
            headers,
            responseType: file ? 'arraybuffer' : 'json',
        }).then(data => callback(data)).catch(error => callback(error.response))
    } else {
        return dispatch => {
            dispatch({ type: type.REQ })
            axios({
                method,
                url: ROOT_URL + url,
                data,
                headers,
                responseType: file ? 'arraybuffer' : 'json',
            }).then(response => dispatch({ type: type.RES, payload: response })).catch(error => dispatch({ type: type.FAIL, payload: error }))
        }
    }
}

export default API_CALL;