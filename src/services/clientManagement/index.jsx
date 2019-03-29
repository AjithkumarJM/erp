import API_CALL from "..";
import { clientListType} from './actionTypes';

const postCreateClient = (values, callback) => API_CALL('post', 'create/client', values, null, callback)

const getClientTypeList = () => API_CALL('get', 'client/type/list', null, clientListType)

export { postCreateClient, getClientTypeList }