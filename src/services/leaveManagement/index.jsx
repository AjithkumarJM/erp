import API_CALL from "../index";
import { leaveTypesActionType, leaveBalanceType, holidayListType, upcomingHolidayListType, leaveHistoryType } from './actionTypes';

const getLeaveTypes = () => API_CALL('get', 'typesofleaves/list', null, leaveTypesActionType);

const getHolidayList = () => API_CALL('get', 'holiday/list', null, holidayListType);

const getUpcomingHolidayList = () => API_CALL('get', 'sorted/holiday/list', null, upcomingHolidayListType);

const getLeaveHistory = id => API_CALL('get', `leavehistory/id/${id}`, null, leaveHistoryType);

const getLeaveBalance = id => API_CALL('get', `balanceleave/${id}`, null, leaveBalanceType);

const postApplyLeave = (values, callback) => API_CALL('post', 'applyleave', values, null, callback);

const postCancelLeave = (values, callback) => API_CALL('post', 'leave/status/update/', values, null, callback);

export {
    getLeaveTypes, postCancelLeave, getLeaveBalance,
    getHolidayList, postApplyLeave, getUpcomingHolidayList, getLeaveHistory
}