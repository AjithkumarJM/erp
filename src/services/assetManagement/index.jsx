import API_CALL from "../index";
import { assetListType, assetTypesActionType } from "./actionTypes";

const getAssets = type => API_CALL('get', `asset/list/${type}`, null, assetListType);

const getAssetTypes = () => API_CALL('get', 'asset/type/list', null, assetTypesActionType);

const postCreateAsset = (values, callback) => API_CALL('post', 'create/asset', values, null, callback);

const postAssetBulkUpload = ({ file }, callback) => {
    let values = new FormData();
    values.append('file', file[0]);

    return API_CALL('post', 'asset/bulkupload', values, null, callback)
}

export { getAssets, getAssetTypes, postCreateAsset, postAssetBulkUpload }