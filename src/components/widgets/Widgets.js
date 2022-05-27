import React from 'react'
import { CCol, CRow, CWidgetIcon } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Widgets = () => {
  return (
    <>
      <CRow>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon text="Employees" header="70" color="primary">
            <CIcon width={24} name="cil-user" />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon text="Leaves" header="100" color="info">
            <CIcon width={24} name="cil-moon" />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon text="Approved" header="45" color="success">
            <CIcon width={24} name="cil-check-alt" />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="6">
          <CWidgetIcon text="Pending" header="25" color="warning">
            <CIcon width={24} name="cil-grain" />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="12" lg="6">
          <CWidgetIcon text="Canceled" header="30" color="danger">
            <CIcon width={24} name="cil-x" />
          </CWidgetIcon>
        </CCol>
      </CRow>
    </>
  )
}

export default Widgets
