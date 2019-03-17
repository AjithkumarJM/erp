import API_CALL from "../index";
import { allEmployeeInfoType, employeeByIdType } from "./actionTypes";

const getEmployeesInfo = () => API_CALL('get', `employee/list`, null, allEmployeeInfoType);

const getEmployeeById = (id) => API_CALL('get', `get/employee/${id}`, null, employeeByIdType);


export { getEmployeesInfo, getEmployeeById }