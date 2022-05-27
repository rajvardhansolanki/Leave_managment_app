import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CBadge,
  CSelect,
  CFormGroup,
  CInput
} from '@coreui/react'
import axios from 'axios'
// import moment from 'moment'
// import dateformat from 'dateformat'
import { getToken } from '../../storage/Local_Storage'
import { getDateTime } from '../../../common/constant'
import Select from 'react-select';
import LeaveRequestModel from '../leaverequestModel/LeaveRequestModel'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CIcon from '@coreui/icons-react'


const fields = ['name', 'datesToRequest', 'reason', 'status']

const LeaveRequests = () => {
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [reportingPersonsList, setReportingPersonsList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionValue, setSelectedOptionValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDateSearch, setStartDateSearch] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endDateSearch, setEndDateSearch] = useState("");
  const [status, setStatus] = useState(null)


  const changeModelState = (statusId, buttonStatus) => {
    setStatusId(statusId)
    setStatusModelToggle(!statusModelToggle)
    setStatus(buttonStatus)
  }

  useEffect(() => {

    var token = getToken();

    //! fetch Reporting Persons from api
    const ReportingPersons = async () => {
      const response = await axios.get('/api/auth/reporting-person-list', {
        headers: {
          'authorization': token
        }
      })
      setReportingPersonsList(response.data.data);
    }
    ReportingPersons();
  }, []);

  // ! status model
  const [statusModelToggle, setStatusModelToggle] = useState(false);
  const [statusId, setStatusId] = useState();
  const leaveStatus = (statusId) => {
    setStatusId(statusId);
    setStatusModelToggle(!statusModelToggle);
  }

  const handleChange = (selectedOptionByUser) => {
    setSelectedOption(selectedOptionByUser.value);
    setSelectedOptionValue(selectedOptionByUser);
  };

  // ! searching functionality
  const [filterToggle, setFilterToggle] = useState(false);
  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  useEffect(() => {
    var token = getToken();

    const getSearchApi = async () => {
      setIsLoading(true);
      const response = await axios.get(`/api/leave-request/list?limit=100&userId=${selectedOption}&search=${search}&status=${searchStatus}&fromDate=${startDateSearch}&toDate=${endDateSearch}`, {
        headers: {
          'authorization': token
        }
      });
      const data = response.data.data;
      setLeaveRequests(data);
      setIsLoading(false);
    };
    getSearchApi();
    // }
  }, [search, searchStatus, selectedOption, startDateSearch, endDateSearch, reload]);

  // ! user select option by searching
  const statusChange = (e) => {
    setSearchStatus(e.target.value);
  }

  // ! For clearing all filters
  const clearFilter = () => {
    setFilterToggle(!filterToggle);
    setSearchStatus("");
    setSelectedOptionValue("");
    setSelectedOption("");
    setStartDate("");
    setStartDateSearch("");
    setEndDate("");
    setEndDateSearch("");
  }

  // new Date()
  const changeDate = (date) => {
    setStartDate(date);
    setStartDateSearch(new Date(date).toISOString());
  }

  const changeEndDate = (date) => {
    setEndDate(date);
    setEndDateSearch(new Date(date).toISOString());
  }

  // for reloading page
  const reloadPage = () => {
    setReload(!reload);
  }

  return (
    <>
      <CCard>
        <CCardHeader>Leave Requests</CCardHeader>
        <CCardHeader>
          <CRow className="justify-content-center">
            <CCol md="10">
              <CFormGroup>
                <CInput id="search" value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search" autoComplete="off" />
              </CFormGroup>
            </CCol>
            <CCol md="2">
              {
                filterToggle === false ? <button className="btn btn-primary btn-block" onClick={() => setFilterToggle(!filterToggle)}>Advance Filter <CIcon width={24} name='cil-chevron-bottom' /></button> :
                  <button className="btn btn-primary btn-block" onClick={clearFilter}>Clear Filter
                    <CIcon width={24} name='cil-chevron-top' /></button>
              }
            </CCol>
          </CRow>
          {
            filterToggle &&
            <CRow className="justify-content-start">
              <CCol md="3">
                <Select
                  isSearchable={true}
                  value={selectedOptionValue}
                  onChange={handleChange}
                  options={reportingPersonsList}
                />
              </CCol>
              <CCol md="3">
                <CSelect className="form-control" value={searchStatus} name="status" id="status" onChange={statusChange}>
                  <option value="">Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Disapproved">Disapproved</option>
                  <option value="Pending">Pending</option>
                </CSelect>
              </CCol>
              <CCol md="3">
                <DatePicker className="form-control" placeholderText="Start Date" selected={startDate} onChange={changeDate} />
              </CCol>
              <CCol md="3">
                <DatePicker className="form-control" placeholderText="End Date" selected={endDate} onChange={changeEndDate} />
              </CCol>
            </CRow>
          }
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={leaveRequests}
            fields={fields}
            itemsPerPage={10}
            pagination
            hover
            border
            outlined
            loading={isLoading}
            scopedSlots={{
              name: item => (
                <td className="text-capitalize">{item.fullName}</td>
              ),
              datesToRequest: item => (
                <td className='text-capitalize'>
                  {item.datesToRequest.map(date => getDateTime(date))[0] + "to " + item.datesToRequest.map(date => getDateTime(date)).slice(-1)}
                </td>
              ),
              reason: item => (
                <td className="text-capitalize">{item.reason}</td>
              ),
              status: item => (
                <td>
                  {
                    localStorage.getItem('role') === "Admin"
                      ?
                      item.status === "Inactive" ? <CBadge color="danger">
                        {item.status}
                      </CBadge>
                        : item.status === "Pending" ? <CBadge color="warning"
                          className='pointer'
                          onClick={() => changeModelState(item._id, item.status)}>
                          {item.status}
                        </CBadge>
                          : item.status === "Approved" ? <CBadge color="success"
                            className='pointer'
                            onClick={() => changeModelState(item._id, item.status)}>
                            {item.status}
                          </CBadge> : item.status === "Disapproved" ? <CBadge color="danger"
                            className='pointer'
                            onClick={() => changeModelState(item._id, item.status)}>
                            {item.status}
                          </CBadge> : <CBadge color="primary" className="pointer" onClick={() => leaveStatus(item._id, item.status)}>
                            {item.status}
                          </CBadge>
                      :
                      item.status === "Pending" ? <CBadge color="warning">
                        {item.status}
                      </CBadge>
                        : item.status === "Approved" ? <CBadge color="success" >
                          {item.status}
                        </CBadge> : item.status === "Disapproved" ? <CBadge color="danger" >
                          {item.status}
                        </CBadge> : <CBadge color="primary" >
                          {item.status}
                        </CBadge>
                  }
                </td>
              )
            }}
          />
        </CCardBody>
      </CCard>
      <LeaveRequestModel toggleModel={leaveStatus} showHide={statusModelToggle} statusId={statusId} reloadPage={reloadPage} />
    </>
  )
}

export default LeaveRequests
