export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-tachometer-alt',
    }, {
      name: 'Employee Tracker',
      url: '/employee_tracker',
      icon: 'fa fa-desktop',
    }, {
      name: 'Leave Management',
      url: '/leave_management',
      icon: 'fa fa-calendar',
    }, {
      name: 'Asset Management',
      url: '/asset_management',
      icon: 'fa fa-building',
    }, {
      name: 'Holilday List',
      url: '/holiday_list',
      icon: 'fa fa-list',
    }, {
      name: "JAISHUians",
      url: '/common_employees_info',
      icon: 'fa fa-user-friends',
    }, {
      name: 'Project Management',
      url: '/project_management',
      icon: 'fa fa-tasks',
      children: [
        {
          name: 'projects',
          url: '/project_management',
          icon: 'fa fa-project-diagram'
        },
        {
          name: 'Clients',
          url: '/client_management',
          icon: 'fa fa-users'
        }
      ],
    },
  ],
};
