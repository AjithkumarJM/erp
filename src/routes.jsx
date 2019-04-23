
import Dashboard from './pages/dashboard';
import EmployeeTrackerHome from './pages/employeeManagement';
import LeaveManagementHome from './pages/leaveManagement/index';
import commonEmployees from './pages/commonEmployees';
import AssetManagementHome from './pages/assetManagement';
import ClientManagementHome from './pages/clientManagement';
import ProjectManagementHome from './pages/projectManagement';


const routes = [
  { path: '/dashboard', exact: true, name: 'dashboard', component: Dashboard },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },

  { path: '/employee_tracker', name: 'employee_tracker', component: EmployeeTrackerHome },

  { path: '/leave_management', name: 'leave_management', component: LeaveManagementHome },  

  { path: '/common_employees_info', name: 'common_employees_info', component: commonEmployees },

  { path: '/asset_management', name: 'asset_management', component: AssetManagementHome },

  { path: '/client_management', name: 'Clients', component: ClientManagementHome },
  { path: '/project_management', name: 'Projects', component: ProjectManagementHome },
  // { path: '/project_management', exact: true, name: 'project_management', component: ClientManagementHome },
];

export default routes;
