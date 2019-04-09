import API_CALL from '..';
import { commonEmployeesType } from './actionTypes';

const getCommonEmployeeInfo = () => API_CALL('get', 'get/common/employee/details', null, commonEmployeesType)

export { getCommonEmployeeInfo };