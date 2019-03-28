import API_CALL from "../index";
import { assetListType, assetTypesActionType, assetDetailsType, assetByIdType } from "./actionTypes";

const getAssets = type => API_CALL('get', `asset/list/${type}`, null, assetListType);

const getAssetTypes = () => API_CALL('get', 'asset/type/list', null, assetTypesActionType);

const postCreateAsset = (values, callback) => API_CALL('post', 'create/asset', values, null, callback);

const postUpdateAsset = (values, callback) => API_CALL('post', 'update/asset', values, null, callback);

const postAssetStatus = (values, callback) => API_CALL('post', 'update/asset/status', values, null, callback);

const getAssetDetails = id => API_CALL('get', `get/asset/details/${id}`, null, assetDetailsType);

const getAssetById = id => API_CALL('get', `get/asset/${id}`, null, assetByIdType)

const postAssetBulkUpload = ({ file }, callback) => {
    let values = new FormData();
    values.append('file', file[0]);

    return API_CALL('post', 'asset/bulkupload', values, null, callback)
}

export {
    getAssets, getAssetTypes, postCreateAsset, postUpdateAsset, getAssetById,
    postAssetBulkUpload, postAssetStatus, getAssetDetails
}