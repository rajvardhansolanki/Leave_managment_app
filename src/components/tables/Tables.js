import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CBadge,
  CFormGroup,
  CInput,
  CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { getToken } from '../storage/LocalStorage'
import AddUser from '../adduser/AddUser'
import StatusModel from '../statusmodel/StatusModel'
import UpdateUser from '../updateuser/UpdateUser'
import DeleteUser from '../deleteuser/DeleteUser'
import { useHistory } from 'react-router'
// import ReactPaginate from "react-paginate";
import { getDateTime } from '../../common/constant'

const fields = [
  'name',
  'department',
  'email',
  'createdAt',
  'role',
  'status',
  'actions'
]

const Tables = () => {
  const history = useHistory()
  var token = getToken()
  const [isLoading, setIsLoading] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [reload, setReload] = useState(false)

  // ! change model add use state
  const changeState = () => {
    setToggle(!toggle)
  }

  // ! status model
  const [statusModelToggle, setStatusModelToggle] = useState(false)
  const [statusId, setStatusId] = useState(null)
  const [status, setStatus] = useState(null)
  const changeModelState = (statusId, buttonStatus) => {
    setStatusId(statusId)
    setStatusModelToggle(!statusModelToggle)
    setStatus(buttonStatus)
  }

  // ! update user model
  const [updateUserModelToggle, setUpdateUserModelToggle] = useState(false)
  const [updateId, setUpdateId] = useState(null)
  const updateUser = updateId => {
    setUpdateUserModelToggle(!updateUserModelToggle)
    setUpdateId(updateId)
  }

  // ! delete user model
  const [deleteUserModelToggle, setDeleteUserModelToggle] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const deleteUser = deleteId => {
    setDeleteUserModelToggle(!deleteUserModelToggle)
    setDeleteId(deleteId)
  }

  // ! user details
  const userDetails = userDetailsId => {
    history.push(`/users/user-details/${userDetailsId}`)
  }

  // ! pagination code
  const [items, setItems] = useState([])
  const [limit, setLimit] = useState(10)

  const [filterToggle, setFilterToggle] = useState(false)
  const [search, setSearch] = useState('')
  const [searchDepartment, setSearchDepartment] = useState('')
  const [searchRole, setSearchRole] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const currentPage = 1

  useEffect(() => {
    const fetchUserListWithLimit = async () => {
      setIsLoading(true)
      const response = await axios.get(
        `/api/auth/user-list?search=${search}&status=${searchStatus}&role=${searchRole}&department=${searchDepartment}&page=${currentPage}&limit=${limit}`,
        {
          headers: {
            authorization: token
          }
        }
      )
      const data = response.data.data
      setLimit(response.data.totalRecords)
      setItems(data)
      setIsLoading(false)
    }

    fetchUserListWithLimit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchStatus, searchRole, searchDepartment, limit, reload])

  // ! user select option by searching
  const departmentChange = e => {
    setSearchDepartment(e.target.value)
  }
  const roleChange = e => {
    setSearchRole(e.target.value)
  }
  const statusChange = e => {
    setSearchStatus(e.target.value)
  }

  // ! For clearing all filters
  const clearFilter = () => {
    setFilterToggle(!filterToggle)
    setSearchDepartment('')
    setSearchRole('')
    setSearchStatus('')
  }

  // for reloading page
  const reloadPage = () => {
    setReload(!reload)
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          Users List
          {localStorage.getItem('role') === 'Admin' && (
            <div className='card-header-actions'>
              <button
                className='btn btn-primary'
                onClick={changeState}
                type='submit'
              >
                Add user +
              </button>
            </div>
          )}
        </CCardHeader>
        <CCardHeader>
          <CRow className='justify-content-center'>
            <CCol md='10'>
              <CFormGroup>
                <CInput
                  id='search'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type='text'
                  placeholder='Search'
                  autoComplete='off'
                />
              </CFormGroup>
            </CCol>
            <CCol md='2'>
              {filterToggle === false ? (
                <button
                  className='btn btn-primary btn-block'
                  onClick={() => setFilterToggle(!filterToggle)}
                >
                  Advance Filter <CIcon width={24} name='cil-chevron-bottom' />
                </button>
              ) : (
                <button
                  className='btn btn-primary btn-block'
                  onClick={clearFilter}
                >
                  Clear Filter
                  <CIcon width={24} name='cil-chevron-top' />
                </button>
              )}
            </CCol>
          </CRow>
          {filterToggle && (
            <CRow className='justify-content-center'>
              <CCol md='4'>
                <CSelect
                  value={searchDepartment}
                  name='department'
                  id='department'
                  onChange={departmentChange}
                >
                  <option value=''>Select Department</option>
                  <option value='Engineering'>Engineering</option>
                  <option value='HR'>HR</option>
                  <option value='Business Development'>
                    Business Development
                  </option>
                </CSelect>
              </CCol>

              <CCol md='4'>
                <CSelect
                  value={searchRole}
                  name='role'
                  id='role'
                  onChange={roleChange}
                >
                  <option value=''>Select Role</option>
                  <option value='Admin'>Admin</option>
                  <option value='Employee'>Employee</option>
                </CSelect>
              </CCol>

              <CCol md='4'>
                <CSelect
                  value={searchStatus}
                  name='status'
                  id='status'
                  onChange={statusChange}
                >
                  <option value=''>Select Status</option>
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </CSelect>
              </CCol>
            </CRow>
          )}
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={items}
            fields={fields}
            hover
            border
            outlined
            loading={isLoading}
            itemsPerPage={10}
            pagination
            scopedSlots={{
              name: item => (
                <td className='text-capitalize'>{item.fullName}</td>
              ),
              createdAt: item => <td>{getDateTime(item.createdAt)}</td>,
              actions: item => (
                <td>
                  <div className='d-flex'>
                    {localStorage.getItem('role') === 'Admin' && (
                      <CBadge color='primary' className='pointer'>
                        <CIcon
                          name='cil-pen'
                          onClick={() => updateUser(item._id)}
                        />
                      </CBadge>
                    )}
                    <CBadge color='success' className='pointer mx-1'>
                      <CIcon
                        name='cil-mood-very-good'
                        onClick={() => userDetails(item._id)}
                      />
                    </CBadge>
                    {localStorage.getItem('role') === 'Admin' && (
                      <CBadge color='danger' className='pointer'>
                        {/* <CIcon
                          name='cil-trash'
                          onClick={() => deleteUser(item._id)}
                        /> */}
                      </CBadge>
                    )}
                  </div>
                </td>
              ),
              status: item => (
                <td>
                  {localStorage.getItem('role') === 'Admin' ? (
                    item.status === 'Active' ? (
                      <CBadge
                        color='success'
                        className='pointer'
                        onClick={() => changeModelState(item._id, item.status)}
                      >
                        {item.status}
                      </CBadge>
                    ) : (
                      <CBadge
                        color='danger'
                        className='pointer'
                        onClick={() => changeModelState(item._id, item.status)}
                      >
                        {item.status}
                      </CBadge>
                    )
                  ) : item.status === 'Active' ? (
                    <CBadge color='success'>{item.status}</CBadge>
                  ) : (
                    <CBadge color='danger'>{item.status}</CBadge>
                  )}
                </td>
              )
            }}
          />
          {/* <ReactPaginateg
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-start"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          /> */}
        </CCardBody>
      </CCard>

      <AddUser
        toggleModel={changeState}
        showHide={toggle}
        reloadPage={reloadPage}
      />
      <StatusModel
        toggleModel={changeModelState}
        showHide={statusModelToggle}
        statusId={statusId}
        status={status}
        reloadPage={reloadPage}
      />
      <UpdateUser
        toggleModel={updateUser}
        showHide={updateUserModelToggle}
        updateId={updateId}
        reloadPage={reloadPage}
      />
      <DeleteUser
        toggleModel={deleteUser}
        showHide={deleteUserModelToggle}
        deleteId={deleteId}
        reloadPage={reloadPage}
      />
    </>
  )
}

export default Tables
