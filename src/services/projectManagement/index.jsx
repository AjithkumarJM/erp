import API_CALL from "..";
import { allProjectsType, activeProjectType, inActiveProjectType } from './actionTypes';

const getAllProjects = () => API_CALL('get', 'project/allprojects', null, allProjectsType);

const getActiveProjects = () => API_CALL('get', 'project/allProjects/active', null, activeProjectType);

const getInactiveProjects = () => API_CALL('get', 'project/allProjects/inactive', null, inActiveProjectType);

export { getAllProjects, getActiveProjects, getInactiveProjects }