import { commonEmployeesType } from './actionTypes';
import API_CALL from '..';

export const getCommonEmployeeInfo = () => API_CALL('get', 'get/common/employee/details', null, commonEmployeesType)