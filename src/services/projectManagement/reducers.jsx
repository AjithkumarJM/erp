import { allProjectsType, activeProjectType, inActiveProjectType } from './actionTypes';

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

const allProjects = (state = initialState, action) => reducer(state, action, allProjectsType);

const activeProjects = (state = initialState, action) => reducer(state, action, activeProjectType);

const inActiveProjects = (state = initialState, action) => reducer(state, action, inActiveProjectType);

export { allProjects, activeProjects, inActiveProjects }