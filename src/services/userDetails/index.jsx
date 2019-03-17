import API_CALL from '..';
import * as types from './actionTypes';
import cookie from 'react-cookies';

export function getUserDetails() {
    return API_CALL('get', 'get/employee/' + cookie.load('session').employee_id, null, types);
}