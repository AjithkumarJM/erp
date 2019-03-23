import API_CALL from "../index";
import { assetListType } from "./actionTypes";

const getAssets = type => API_CALL('get', `asset/list/${type}`, null, assetListType);

export { getAssets }