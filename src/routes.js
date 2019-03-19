
import Dashboard from '../src/pages/dashboard/dashboard';
import EmployeeTrackerHome from '../src/pages/employeeManagement';
import LeaveManagementHome from '../src/pages/leaveManagement/index';
import Employee from '../src/pages/employeeManagement/createEmployee';
import HolidayList from '../src/pages/holidayList/holidayList';
import CommonEmpDetails from '../src/pages/empEmergencyInfo/empEmergencyInfo.js';
import AssetManagement from '../src/pages/assetManagement/index';
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
  // { path: '/asset_management', name: 'asset_management', component: AssetManagement },
  // { path: '/holiday_list', name: 'holiday_list', component: HolidayList },
  // { path: '/udpate_details/:id', name: 'udpate_details', component: Update },
  // { path: '/asset_management/assign', name: 'asset_management_assign', component: AssignForm },
  // { path: '/create_asset', name: 'create_asset', component: addAsset },
  // { path: '/common_emp_details', name: 'common_emp_details', component: CommonEmpDetails },
  // { path: '/project_management/client', name: 'client', component: Client},
  // { path: '/project_management/projects', name: 'projects', component: Projects}
  
  // { path: '/project_management', exact: true, name: 'project_management', component: Client},
  // { path: '/change_password', name: 'change_password', component: ChangePassword },
];

export default routes;
