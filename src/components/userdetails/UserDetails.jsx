import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import {
    CCol,
    CRow,
    CFormGroup,
    CLabel,
    CInput,
    CForm,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import axios from 'axios'
import { getToken } from '../storage/LocalStorage'
import Loader from '../../containers/Loader/Loader'
import { titleCase } from '../../common/constant';

const UserDetails = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [singleUser, setSingleUser] = useState([]);
    const [reportingPersons, setReportingPersons] = useState([]);
    const [reportingPersonsCollection, setReportingPersonsCollection] = useState([]);
    const { UserId } = useParams();

    useEffect(() => {
        const token = getToken();
        // ! fetch reporting persons data
        const fetchReportingPersonsApi = async () => {
            try {
                const response = await axios.get(`/api/auth/reporting-person-list`, {
                    headers: {
                        'authorization': token
                    }
                })
                setReportingPersonsCollection(response.data.data)
                // console.log("data change ", response.data.data);
            } catch (error) {
                console.log("Somethong went wrong!", error);
            }
        }

        //! fetch users list from api
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/auth/user-view/${UserId}`, {
                    headers: {
                        'authorization': token
                    }
                });
                setSingleUser(response.data.data[0]);
                setReportingPersons(response.data.data[0].reportingPerson);
                // console.log("data", response.data.data[0].reportingPerson);
            } catch (error) {
                console.log("Something went wrong!", error)
            }
            setIsLoading(false);
        }

        fetchUser();
        fetchReportingPersonsApi();
    }, []);


    const setReportingPersonNames = []
    for (let i = 0; i < reportingPersons.length; i++) {
        for (let j = 0; j < reportingPersonsCollection.length; j++) {
            if (reportingPersons[i] === reportingPersonsCollection[j]['value']) {
                setReportingPersonNames.push(reportingPersonsCollection[j]['label']);
            }
        }
    }


    return (
        <>
            {
                isLoading ? <Loader /> : <CRow>
                    <CCol xs="12">
                        <CCard>
                            <CCardHeader>
                                User Details
                            </CCardHeader>
                            <CCardBody>
                                <CForm>
                                    <fieldset>
                                        <CRow>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <CLabel htmlFor="fname">Name</CLabel>
                                                    <CInput defaultValue={singleUser.firstName} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <CLabel htmlFor="mname">Middle Name</CLabel>
                                                    <CInput defaultValue={singleUser.middleName} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <CLabel htmlFor="lname">Last Name</CLabel>
                                                    <CInput defaultValue={singleUser.lastName} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <CLabel htmlFor="email">Email</CLabel>
                                                    <CInput defaultValue={singleUser.email} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="12">
                                                <CFormGroup>
                                                    <CLabel htmlFor="designation">Designation</CLabel>
                                                    <CInput defaultValue={singleUser.designation} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <CLabel htmlFor="department">Department</CLabel>
                                                    <CInput defaultValue={singleUser.department} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <CLabel htmlFor="role">Role</CLabel>
                                                    <CInput defaultValue={singleUser.role} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="12">
                                                <CFormGroup>
                                                    <CLabel htmlFor="reportingPerson">Reporting Person</CLabel>
                                                    <CInput defaultValue={setReportingPersonNames.map(person => titleCase(person))} readOnly />
                                                </CFormGroup>
                                            </CCol>
                                        </CRow>
                                    </fieldset>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            }
        </>
    )
}

export default UserDetails
