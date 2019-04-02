import API_CALL from "..";
import { clientListType, activeClientType, clientByIdType, allClientType } from './actionTypes';

const postCreateClient = (values, callback) => API_CALL('post', 'create/client', values, null, callback);

const postUpdateClient = (values, callback) => API_CALL('post', 'client/edit', values, null, callback);

const getClientTypeList = () => API_CALL('get', 'client/type/list', null, clientListType);

const getActiveClients = () => API_CALL('get', 'active/client/list', null, activeClientType);

const getAllClients = () => API_CALL('get', 'client/list', null, allClientType);

const getClientById = id => API_CALL('get', `get/client/${id}`, null, clientByIdType);

export { postCreateClient, getClientTypeList, getActiveClients, getClientById, postUpdateClient, getAllClients }