import API_CALL from "../index";
import { monthlyNotificationsType, dashboardDataType } from "./actionTypes";

const getDashboardDetails = id => API_CALL('get', `get/dashboard/${id}`, null, dashboardDataType);

const getMonthlyNotifications = () => API_CALL('get', 'monthlyNotifications', null, monthlyNotificationsType);

export { getDashboardDetails, getMonthlyNotifications }