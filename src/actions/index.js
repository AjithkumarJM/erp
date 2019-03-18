import axios from 'axios';
import { stringify } from 'query-string';
import cookie from 'react-cookies';
import { ROOT_URL } from './../const';

function API_CALL(method, url, data, type, callback, file) {

    console.log("Calling API for the method of " + method + " : " + ROOT_URL + url);

    if (callback) {
        return async (dispatch) => {
            try {
                let request = await axios({
                    method,
                    url: ROOT_URL + url, 
                    data,
                    headers: {
                        "access-token": cookie.load('session').token
                    },
                    responseType: file ? 'arraybuffer' : 'json'
                })

                //immediate callback method
                callback(request);
            } catch (error) {                
                if (error.response.status === 400) {
                    console.log('comes here');
                    // cookie.remove('session', { path: '/' });
                    // window.location.href = '/';
                }
            }
        }
    } else {
        return async (dispatch) => {
            try {
                let request = await axios({
                    method,
                    url: ROOT_URL + url,
                    data,
                    headers: {
                        "access-token": cookie.load('session').token
                    },
                    responseType: file ? 'arraybuffer' : 'json'
                })

                // using thunk for dispatch                
                dispatch({ type: type, payload: request });

            } catch (error) {                
                if (error.response.status === 400) {
                    console.log('comes here');
                    // cookie.remove('session', { path: '/' });
                    // window.location.href = '/';
                }
            }
        }
    }
}

export function login(values, callback, errorHandler) {
    values.grant_type = 'password';
    let response = axios.post(ROOT_URL + 'login', stringify(values))
        .then((data) => callback(data))
        .catch((data) => errorHandler(data));
    return {
        type: 'LOGIN',
        payload: response
    };
}

export function loginCredentials(values) {
    console.log(values)
    return {
        type: 'GET_LOGIN_CREDENTIALS',
        payload: values
    }
}

export const load = data => ({ type: LOAD, data });

export function getPendingHistory(id) {
    return API_CALL('get', 'leave/pending/' + id, null, 'LOAD_PENDING_LEAVEHISTORY');
}

export function getUserDetails() {
    return API_CALL('get', 'get/employee/' + cookie.load('session').employee_id, null, 'GET_ME');
}

export function placeholderApi(callback) {
    return API_CALL('get', 'get/last/employee/id', null, 'GET_PLACEHOLDER_LIST', callback)
}

export function hrEmpTracker(values, callback) {
    return API_CALL('get', 'employee/list', values, 'GET_HREMPTRACKER_LIST', callback)
}

export function getUserList(id, callback) {
    return API_CALL('get', 'employee/list/' + id, null, 'GET_EMPLOYEE_LIST', callback);
}

export function leaveList(id) {
    return API_CALL('get', 'leave/fullhistoryby/' + id, null, 'GET_REPORTEES_HISTORY');
}

export function empLeaveHistory(id) {
    return API_CALL('get', 'leavehistory/id/' + id, null, 'GET_EMPLOYEE_LEAVE_HISTORY_LIST');
}

export function createPost(values, callback) {
    return API_CALL('post', 'employee/create', values, 'create_post', callback);
}

export function updatePost(values, callback) {
    return API_CALL('post', 'employee/update', values, 'update_post', callback);
}

export function applyLeave(values, callback) {
    return API_CALL('post', '/applyleave', values, 'apply_leave', callback);
}

export function approveReject(values, callback) {
    return API_CALL('post', 'leave/status/update', values, 'APPROVE_REJECT', callback);
}

export function designation(values, callback) {
    return API_CALL('get', 'employee/designation/list', values, 'UPDATE_DESIGNATION_DETAILS', callback);
}

export function holidaylist(values, callback) {
    return API_CALL('get', 'holiday/list', null, 'HOLIDAY_LIST', callback);
}

export function AssetbulkUpload(value, callback) {
    let data = new FormData();
    data.append('file', value.file[0]);

    const config = {
        headers: {
            "access-token": cookie.load('session').token,
            'content-type': 'multipart/form-data'
        }
    }

    let response = axios.post(ROOT_URL + 'asset/bulkupload', data, config)
        .then((data) => callback(data));
    return {
        type: 'UPLOAD_FILE',
        payload: response
    }
}

export function LeaveBulkUpload(value, callback) {
    let data = new FormData();
    data.append('file', value.file[0]);

    const config = {
        headers: {
            "access-token": cookie.load('session').token,
            'content-type': 'multipart/form-data'
        }
    }

    let response = axios.post(ROOT_URL + '/bulkupload', data, config)
        .then((data) => callback(data));
    return {
        type: 'UPLOAD_FILE',
        payload: response
    }
}


export function systemRole(values, callback) {
    console.log(values)
    return API_CALL('get', 'rolelist/systemrole', values, 'UPDATE_SYSTEMROLE_DETAILS', callback);
}

export function holidayList(values, callback) {
    return API_CALL('get', 'sorted/holiday/list', values, 'UPDATE_HOLIDAYLIST_DETAILS', callback);
}

export function reportingTo(values, callback) {
    return API_CALL('get', 'employee/reportingto/list', values, 'UPDATE_SYSTEMROLE_DETAILS', callback);
}

export function getTypesOfLeaves(values, callback) {
    return API_CALL('get', 'typesofleaves/list', values, 'UPDATE_LEAVETYPES_DETAILS', callback);
}

export function leaveBalance(id, callback) {
    return API_CALL('get', 'balanceleave/' + id, null, 'UPDATE_LEAVEBALANCE_DETAILS', callback);
}

export function getEmpDetails(id, callback) {
    return API_CALL('get', 'get/employee/' + id, null, 'UPDATE_EMPVIEW_DETAILS', callback);
}

export function getCommonEmpDetails(callback) {
    return API_CALL('get', 'get/common/employee/details', null, 'COMMON_EMP_DETAILS', callback);
}

export function getDashboardDetails(id, callback) {
    return API_CALL('get', 'get/dashboard/' + id, null, 'DASHBOARD_DETAILS', callback);
}

export function cancelLeavePrompt(values, callback) {
    return API_CALL('post', 'leave/status/update/', values, 'cancel', callback);
}

export function changePassword(values, callback) {
    return API_CALL('post', 'changepassword', values, 'change_password', callback);
}

// version 2

export function getStatusList(callback) {
    return API_CALL('get', 'asset/status/list', null, 'ASSET_STATUS_DETAILS', callback);
}

export function getTypeList(callback) {
    return API_CALL('get', 'asset/type/list', null, 'ASSET_TYPE_DETAILS', callback);
}

export function getEmployeeAsset(id, callback) {
    return API_CALL('get', 'get/asset/' + id, null, 'EMP_ASSET', callback);
}

export function getAvailableAssets(id) {
    return API_CALL('get', 'asset/list/' + id, null, 'ASSET_AVAILABLE_LIST');
}

export function viewAssetAction(id, callback) {
    return API_CALL('get', 'get/asset/details/' + id, null, 'ASSET_VIEW_LIST', callback);
}

export function getAllLeaveHistory() {
    return API_CALL('get', 'entire/leave/history', null, 'ENTIRE_EMPLOYEE_LEAVEHISTORY');
}

export function getAllEmpList(callback) {
    return API_CALL('get', 'employee/list', null, 'ALL_EMPLOYEE_LIST', callback);
}

export function updateAsset(values, callback) {
    return API_CALL('post', 'update/asset', values, 'update_asset', callback);
}

export function createAsset(values, callback) {
    return API_CALL('post', 'create/asset', values, 'create_asset', callback);
}

export function assetStatus(values, callback) {
    return API_CALL('post', 'update/asset/status', values, 'asset_status', callback);
}

// token less api's

export function tokenValidation(values, callback) {

    const tokenValidation = axios.post(`${ROOT_URL}forgotpassword/validation`, values)
        .then((data) => callback(data));
    return {
        type: 'token_validation',
        payload: tokenValidation
    };
}

export function forgotPassword(values, callback) {

    const passwordRequest = axios.post(`${ROOT_URL}forgotpassword/request`, values)
        .then((data) => callback(data));
    return {
        type: 'forgot_password',
        payload: passwordRequest
    };
}

export function resetPasswordRequest(values, callback) {

    const passwordUpdate = axios.post(`${ROOT_URL}forgotpassword/update`, values)
        .then((data) => callback(data));
    return {
        type: 'reset_password',
        payload: passwordUpdate
    };
}