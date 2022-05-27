import {
  CCard,
  CRow,
  CCardBody,
  CCol,
  CCardHeader,
  CForm,
  CFormGroup,
  CLabel,
  CDataTable,
  CBadge
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getDateTime } from '../../../common/constant'
import { getToken } from '../../../components/storage/LocalStorage'
import FullCalander from '../full_calander/FullCalander'

const fields = ['datesToRequest', 'reason', 'status']

const UserDashboard = props => {
  const [usersList, setUsersList] = useState([])

  const fetchUsers = async () => {
    var token = getToken()
    try {
      const response = await axios.get('/api/leave-request/me', {
        headers: {
          authorization: token
        }
      })
      setUsersList(response.data.data)
      // console.log('response: ', response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <>
      <CRow>
        <CCol xs='12'>
          <CCard>
            <CCardHeader>Add leave</CCardHeader>
            <CCardBody>
              <CForm>
                <CRow>
                  <CCol md='12'>
                    <CFormGroup>
                      <CLabel>Select date</CLabel>
                      <CRow>
                        <CCol md='12'>
                          <FullCalander />
                        </CCol>
                      </CRow>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md='12'>
          <CCard>
            <CCardHeader>My Leaves</CCardHeader>
            <CCardBody>
              <CForm>
                <CRow>
                  <CCol md='12'>
                    <CDataTable
                      items={usersList}
                      fields={fields}
                      itemsPerPage={5}
                      pagination
                      hover
                      border
                      outlined
                      scopedSlots={{
                        datesToRequest: item => (
                          <td className='text-capitalize'>
                            {item.datesToRequest.map(date =>
                              getDateTime(date)
                            )[0] +
                              'to ' +
                              item.datesToRequest
                                .map(date => getDateTime(date))
                                .slice(-1)}
                          </td>
                        ),
                        reason: item => (
                          <td className='text-capitalize'>{item.reason}</td>
                        ),
                        status: item => (
                          <td>
                            {item.status === 'Pending' ? (
                              <CBadge color='warning'>{item.status}</CBadge>
                            ) : item.status === 'Approved' ? (
                              <CBadge color='success'>{item.status}</CBadge>
                            ) : item.status === 'Disapproved' ? (
                              <CBadge color='danger'>{item.status}</CBadge>
                            ) : (
                              <CBadge color='primary'>{item.status}</CBadge>
                            )}
                          </td>
                        )
                      }}
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default UserDashboard
