import React, {useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader,CCol,CRow,CWidgetIcon } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CChartPie } from '@coreui/react-chartjs'
import UserDashboard from '../../UserSide/Components/userdashboard/UserDashboard'
import axios from 'axios'
import { getToken } from '../storage/LocalStorage'

const Dashboard = () => {

  const [userdata, setUserdata] = useState("");
  
  
  

  const token = getToken()

  const dashboardData = async () => {
    try {
      const response = await axios.get(`/api/dashboard/user-leave-count`, {
        headers: {
          authorization: token
        }
      })
      setUserdata(response.data.data)
      
      
    } catch (error) {
      console.log('Somethong went wrong!', error)
    }
  }

  useEffect(() => {
    dashboardData();
  }, []);

  return (
    <>
      {localStorage.getItem('role') === 'Admin' ? (
        <>
          <CRow>
            <CCol md="4">
              <CWidgetIcon text='Employees' header={userdata.totalEmployees}  color='primary'>
                <CIcon width={24} name='cil-user' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='TOTAL ADMIN' header={userdata.totalAdmin} color='info'>
                <CIcon width={24} name='cil-moon' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='TOTAL USER' header={userdata.totalUsers} color='success'>
                <CIcon width={24} name='cil-user' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='ACTIVE USERS' header={userdata.totalActiveUser} color='success'>
                <CIcon width={24} name='cil-user' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='UNACTIVER USERS' header={userdata.totalUnActiveUser} color='danger'>
                <CIcon width={24} name='cil-user' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='LEAVE REQUEST' header={userdata.totalRequestedLeaves} color='info'>
                <CIcon width={24} name='cil-moon' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='PENDING LEAVES' header={userdata.pendingLeaves} color='warning'>
                <CIcon width={24} name='cil-moon' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='APPROVED LEAVES' header={userdata.approvedLeaves} color='success'>
                <CIcon width={24} name='cil-moon' />
              </CWidgetIcon>
            </CCol>
            <CCol md="4">
              <CWidgetIcon text='DISAPPROVED LEAVES' header={userdata.disapprovedLeaves} color='danger'>
                <CIcon width={24} name='cil-moon' />
              </CWidgetIcon>
            </CCol>
            <CCol md="12">
              <CWidgetIcon text='PAID LEAVES' header={userdata.paidLeaves} color='primary'>
                <CIcon width={24} name='cil-moon' />
              </CWidgetIcon>
            </CCol>
          </CRow>
          <CCard>
            <CCardHeader>Leaves Status Chart</CCardHeader>
            <CCardBody>
              <CChartPie
                datasets={[
                  {
                    backgroundColor: [
                      '#55efc4',
                      '#fab1a0',
                      '#74b9ff',
                      '#6c5ce7',
                      '#ff7675',
                      '#74b9ff',
                      '#fdcb6e',
                      '#55efc4',
                      '#d63031',
                      '#00cec9'
                    ],
                    data: [userdata.totalEmployees, userdata.totalAdmin,
                       userdata.totalUsers, userdata.totalActiveUser,
                        userdata.totalUnActiveUser,userdata.totalRequestedLeaves,
                        userdata.pendingLeaves,userdata.approvedLeaves,userdata.disapprovedLeaves,
                        userdata.paidLeaves]
                  }
                ]}
                labels={[
                  'Employees',
                  'Admin',
                  'User',
                  'Active User',
                  'UnActive User',
                  'Leave Requeste',
                  'Pending Requeste',
                  'Approved Requeste',
                  'Disapproved Requeste',
                  'Paid Leaves'
                ]}
                options={{ tooltips: { enabled: true } }}
              />
            </CCardBody>
          </CCard>
        </>
      ) : (
        <UserDashboard />
      )}
    </>
  )
}

export default Dashboard
