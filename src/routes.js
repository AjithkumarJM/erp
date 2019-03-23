
import Dashboard from '../src/pages/dashboard/dashboard';
import EmployeeTrackerHome from '../src/pages/employeeManagement';
import LeaveManagementHome from '../src/pages/leaveManagement/index';
import HolidayList from '../src/pages/holidayList';
import commonEmployees from '../src/pages/commonEmployees';
import AssetManagementHome from '../src/pages/assetManagement';
import AssignForm from '../src/pages/assetManagement/assignAssetForm';
import addAsset from '../src/pages/assetManagement/addAsset';
import Update from '../src/pages/employeeManagement/updateEmployee';
import Projects from '../src/pages/ProjectManagement/projects/projects';
import Client from '../src/pages/ProjectManagement/client/client';

const routes = [
  { path: '/dashboard', exact: true, name: 'dashboard', component: Dashboard },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/employee_tracker', name: 'employee_tracker', component: EmployeeTrackerHome },
  { path: '/leave_management', name: 'leave_management', component: LeaveManagementHome },
  { path: '/holiday_list', name: 'holiday_list', component: HolidayList },
  { path: '/common_employees_info', name: 'common_employees_info', component: commonEmployees },

  { path: '/asset_management', name: 'asset_management', component: AssetManagementHome },
  // { path: '/udpate_details/:id', name: 'udpate_details', component: Update },
  // { path: '/asset_management/assign', name: 'asset_management_assign', component: AssignForm },
  // { path: '/create_asset', name: 'create_asset', component: addAsset },
  // { path: '/project_management/client', name: 'client', component: Client},
  // { path: '/project_management/projects', name: 'projects', component: Projects}
  
  // { path: '/project_management', exact: true, name: 'project_management', component: Client},
  // { path: '/change_password', name: 'change_password', component: ChangePassword },
];

export default routes;
