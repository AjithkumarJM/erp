import API_CALL from "../index";
import {
    allEmployeeInfoType, employeeByIdType, systemRoleType,
    reportingToListType, designationListType, prevEmpIdType
} from "./actionTypes";

const getEmployeesInfo = () => API_CALL('get', `employee/list`, null, allEmployeeInfoType);

const getEmployeeById = id => API_CALL('get', `get/employee/${id}`, null, employeeByIdType);

const getSystemRole = () => API_CALL('get', 'rolelist/systemrole', null, systemRoleType)

const getReportingToList = () => API_CALL('get', 'employee/reportingto/list', null, reportingToListType);

const getDesignationList = () => API_CALL('get', 'employee/designation/list', null, designationListType);

const getPrevEmployeeId = () => API_CALL('get', 'get/last/employee/id', null, prevEmpIdType)

const createEmployee = (values, callback) => API_CALL('post', 'employee/create', values, 'CREATE_EMPLOYEE', callback);

const updateEmployee = (values, callback) => API_CALL('post', 'employee/update', values, 'UPDATE_EMPLOYEE', callback);

export {
    getEmployeesInfo, getEmployeeById, getSystemRole, getReportingToList,
    getDesignationList, getPrevEmployeeId, createEmployee, updateEmployee
}