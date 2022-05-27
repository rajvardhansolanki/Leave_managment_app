import React, { useState, useEffect } from 'react'
import {
    CCol,
    CRow,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CFormGroup,
    CLabel,
    CSelect,
    CInputRadio,
    CSpinner
} from '@coreui/react'
import axios from 'axios'
import { getToken } from '../storage/LocalStorage'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from "../../components/textfield/TextField"
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateUser = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [reportingPersons, setReportingPersons] = useState([]);

    const [singleUser, setSingleUser] = useState([]);

    const initialValues = {
        fname: singleUser.firstName,
        mname: singleUser.middleName,
        lname: singleUser.lastName,
        email: singleUser.email,
        designation: singleUser.designation,
        role: singleUser.role,
        department: singleUser.department,
        gender: singleUser.gender,
        reportingPerson: [],
    }

    const validate = Yup.object({
        email: Yup.string().trim()
            .email('Email is invalid')
            .required('Email is required'),
        fname: Yup.string().trim()
            .max(15, 'Maximum 15 character allow.')
            .required('First Name is required'),
        mname: Yup.string().trim(),
        lname: Yup.string().trim()
            .max(15, 'Maximum 15 character allow.')
            .required('Last Name is required'),
        designation: Yup.string().trim()
            .required('Designation is required'),
        gender: Yup.string().required("Gender is require"),
    });

    useEffect(() => {
        var token = getToken();

        //! fetch users list from api
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/auth/user-view/${props.updateId}`, {
                    headers: {
                        'authorization': token
                    }
                });
                setSingleUser(response.data.data[0]);
                // console.log("Single user data", singleUser);
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false);
        }

        if (props.updateId !== null && props.updateId !== undefined) {
            fetchUser();
        }
    }, [props.updateId])


    // ! update user api
    const updateUserApi = async (values) => {
        var token = getToken();
        setIsLoading(true);
        try {
            const response = await axios.put(`/api/auth/update-user/${props.updateId}`, {
                firstName: values.fname,
                middleName: values.mname,
                lastName: values.lname,
                email: values.email,
                department: values.department,
                role: values.role,
                reportingPerson: selectedReportingPersons,
                gender: values.gender
            }, {
                headers: {
                    'authorization': token
                }
            });
            
            console.log('response: ', response);
            toast.success('Update user Successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } catch (error) {
            console.log("Something went wrong!", error);
            toast.error('Something went wrong!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        props.reloadPage();
        setIsLoading(false);
        props.toggleModel();
    }

    const onSubmitEvent = (values, onSubmitProps) => {
        updateUserApi(values);
        onSubmitProps.resetForm();
    }

    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedReportingPersons, setSelectedReportingPersons] = useState();
    const handleChange = (selectedOptionByUser) => {
        setSelectedOption(selectedOptionByUser);
        setSelectedReportingPersons(Array.isArray(selectedOptionByUser) ? selectedOptionByUser.map(option => option.value) : []);
    };


    useEffect(() => {
        var token = getToken();

        //! fetch Reporting Persons from api
        const ReportingPersons = async () => {
            const response = await axios.get('/api/auth/reporting-person-list', {
                headers: {
                    'authorization': token
                }
            })
            setReportingPersons(response.data.data);
        }
        ReportingPersons();
    }, []);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
            />
            {singleUser &&
                <CModal
                    show={props.showHide}
                    onClose={props.toggleModel}
                    color="primary"
                    className="modal"
                    tabIndex="-1"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>Update user</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CRow>
                            <CCol md="12">
                                <Formik initialValues={initialValues} validationSchema={validate} onSubmit={onSubmitEvent} enableReinitialize >
                                    {formik => (
                                        <Form id="form">
                                            <CRow>
                                                <CCol md="6">
                                                    <CFormGroup>
                                                        <TextField label="First Name" name="fname" type="text" />
                                                    </CFormGroup>
                                                </CCol>
                                                <CCol md="6">
                                                    <CFormGroup>
                                                        <TextField label="Middle Name" name="mname" type="text" />
                                                    </CFormGroup>
                                                </CCol>
                                                <CCol md="6">
                                                    <CFormGroup>
                                                        <TextField label="Last Name" name="lname" type="text" />
                                                    </CFormGroup>
                                                </CCol>
                                                <CCol md="6">
                                                    <CFormGroup>
                                                        <TextField label="Email" name="email" type="email" />
                                                    </CFormGroup>
                                                </CCol>
                                                <CCol md="12">
                                                    <CFormGroup>
                                                        <TextField label="Designation" name="designation" type="text" />
                                                    </CFormGroup>
                                                </CCol>

                                                <CCol md="6">
                                                    <Field name="department" render={({ field }) => {
                                                        return <>
                                                            <CFormGroup>
                                                                <CLabel htmlFor="department">Department</CLabel>
                                                                <CSelect {...field} custom name="department" id="department">
                                                                    <option value="Engineering">Engineering</option>
                                                                    <option value="HR">HR</option>
                                                                    <option value="Business Development">Business Development</option>
                                                                </CSelect>
                                                            </CFormGroup>
                                                        </>
                                                    }}></Field>
                                                </CCol>


                                                <CCol md="6">
                                                    <Field name="role" render={({ field }) => {
                                                        return <>
                                                            <CFormGroup>
                                                                <CLabel htmlFor="role">Role</CLabel>
                                                                <CSelect {...field} custom name="role" id="role">
                                                                    <option value="Admin">Admin</option>
                                                                    <option value="Employee">Employee</option>
                                                                </CSelect>
                                                            </CFormGroup>
                                                        </>
                                                    }}></Field>
                                                </CCol>

                                                <CCol md="12">
                                                    <CLabel>Reporting Person</CLabel>
                                                    <Select
                                                        isMulti
                                                        value={selectedOption}
                                                        onChange={handleChange}
                                                        options={reportingPersons}
                                                    />
                                                </CCol>
                                                <CCol md="12" className="mt-2">
                                                    <CFormGroup row>
                                                        <CCol md="2">
                                                            <CLabel>Gender</CLabel>
                                                        </CCol>
                                                        <CCol md="10">
                                                            <Field name="gender" render={({ field }) => {
                                                                return <>
                                                                    <CFormGroup variant="custom-radio" inline>
                                                                        <CInputRadio {...field} custom id="update-male" checked={singleUser.gender==='Male'} name="gender" value="Male" />
                                                                        <CLabel variant="custom-checkbox" htmlFor="update-male">Male</CLabel>
                                                                    </CFormGroup>
                                                                    <CFormGroup variant="custom-radio" inline>
                                                                        <CInputRadio {...field} custom id="update-female" checked={singleUser.gender==='Female'} name="gender" value="Female" />
                                                                        <CLabel variant="custom-checkbox" htmlFor="update-female">Female</CLabel>
                                                                    </CFormGroup>
                                                                    <CFormGroup variant="custom-radio" inline>
                                                                        <CInputRadio {...field} custom id="update-others" name="gender" value="Other" />
                                                                        <CLabel variant="custom-checkbox" htmlFor="update-others">Others</CLabel>
                                                                    </CFormGroup>
                                                                </>
                                                            }}></Field>
                                                        </CCol>
                                                    </CFormGroup>
                                                </CCol>

                                                {
                                                    isLoading ?
                                                        <CCol md="12">
                                                            <button className="btn btn-primary btn-block " disabled>
                                                                <CSpinner component="span" size="sm" aria-hidden="true" className="mr-2" />
                                                                Loading...
                                                            </button>
                                                        </CCol>
                                                        :
                                                        <CCol md="12">
                                                            <button className="btn btn-primary btn-block" type="submit"
                                                                disabled={!(formik.isValid && formik.dirty)}> Submit</button>
                                                        </CCol>
                                                }
                                            </CRow>
                                        </Form>
                                    )}
                                </Formik>
                            </CCol>
                        </CRow>
                    </CModalBody>
                </CModal>
            }

        </>
    )
}

export default UpdateUser
