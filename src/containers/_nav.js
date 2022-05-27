import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  // ! Dashboard sidebar
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name='cil-speedometer' customClasses='c-sidebar-nav-icon' />
  },

  // // ! Holidays sidebar
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Holidays',
  //   to: '/holidays',
  //   icon: <CIcon name='cil-object-group' customClasses='c-sidebar-nav-icon' />
  // },

  // ! Users sidebar
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: <CIcon name='cil-people' customClasses='c-sidebar-nav-icon' />
  },

  // ! Dashboard sidebar
  {
    _tag: 'CSidebarNavItem',
    name: 'Leave Requests',
    to: '/leave-requests',
    icon: <CIcon name='cil-puzzle' customClasses='c-sidebar-nav-icon' />
  },

  {
    _tag: 'CSidebarNavItem',
    name: 'Add Leave',
    to: '/add-leave',
    icon: <CIcon name="cil-object-group" customClasses="c-sidebar-nav-icon" />,
  }

  // // ! Designation sidebar
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Designations',
  //   to: '/designations',
  //   icon: <CIcon name="cil-send" customClasses="c-sidebar-nav-icon" />,
  // },

  // // ! Reports sidebar
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Reports',
  //   to: '/reports',
  //   icon: <CIcon name="cil-spreadsheet" customClasses="c-sidebar-nav-icon" />,
  // },
]

export default _nav
