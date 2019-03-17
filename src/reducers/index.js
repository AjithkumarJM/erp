import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import userInformation from './userDetails';
import reporteesHistory from './reporteesHistory';
import employeeHistory from './empLeaveHistory';
import account from './account';
import getPendingHistory from './pendingHistory';
import availableAssets from './availableAssets';
import entireLeaveHistory from './entireLeaveHistory';

const rootReducer = combineReducers({  
  userInformation,
  reporteesHistory,
  account,
  employeeHistory,
  getPendingHistory,
  availableAssets,
  entireLeaveHistory,
  form: formReducer
});

export default rootReducer;
