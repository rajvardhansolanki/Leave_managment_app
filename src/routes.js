import React from 'react';

const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const UserDashboard = React.lazy(() => import('./UserSide/Components/userdashboard/UserDashboard'));
// const Holidays = React.lazy(() => import('./components/holidays/Holidays'));
const Users = React.lazy(() => import('./components/tables/Tables'));
const Settings = React.lazy(() => import('./components/settings/Settings'))
const UserDetails = React.lazy(() => import("./components/userdetails/UserDetails"))
const UserProfile = React.lazy(() => import('./UserSide/Components/Userprofile/UserProfile'))
const ChangePassword = React.lazy(() => import('./UserSide/Components/changepassword/ChangePassword'))
const LeaveRequests = React.lazy(() => import('./UserSide/Components/leaverequests/LeaveRequests'))

const routes = [
  { path: '/leave-requests', exact: true, name: 'Leave Request', component: LeaveRequests },
  { path: '/add-leave', exact: true, name: 'Add Leave', component: UserDashboard },
  // { path: '/holidays', exact: true, name: 'Holidays', component: Holidays },
  { path: '/user-profile', exact: true, name: 'User Profile', component: UserProfile },
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/settings', exact: true, name: 'Settings', component: Settings },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/user-details/:UserId', name: 'User Details', component: UserDetails },
  { path: '/change-password', exact: true, name: 'Change Password', component: ChangePassword },
];

export default routes;
