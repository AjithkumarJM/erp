import {
    allEmployeeInfoType, employeeByIdType, systemRoleType,
    reportingToListType, designationListType, prevEmpIdType
} from './actionTypes';

const initialState = {
    response: {},
    requesting: false
}

const reducer = (state, action, methodType) => {
    let { payload, type } = action;

    switch (type) {
        case methodType.REQ:
            return { ...state, requesting: true }
        case methodType.RES:
            return { ...state, response: payload.data, requesting: false }
        case methodType.FAIL:
            return { ...state, response: payload.data, requesting: true }
        default:
            return state;
    }
}

const allEmployeeInfo = (state = initialState, action) => reducer(state, action, allEmployeeInfoType);

const employeeById = (state = initialState, action) => reducer(state, action, employeeByIdType);

const systemRoles = (state = initialState, action) => reducer(state, action, systemRoleType);

const reportingToList = (state = initialState, action) => reducer(state, action, reportingToListType);

const designationList = (state = initialState, action) => reducer(state, action, designationListType);

const previousEmpId = (state = initialState, action) => reducer(state, action, prevEmpIdType);

export { allEmployeeInfo, employeeById, systemRoles, reportingToList, designationList, previousEmpId }