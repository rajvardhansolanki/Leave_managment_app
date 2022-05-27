import React, { useState, useEffect } from 'react'
import {
    CCol,
    CRow,
    CFormGroup,
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CSpinner
} from '@coreui/react'
import axios from 'axios'
import { getToken } from '../storage/LocalStorage'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from "../../components/textfield/TextField"
import { getDateTime } from '../../common/constant';
import { useHistory } from 'react-router';

const Settings = () => {
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const [items, setItems] = useState([]);
    const token = getToken();
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        const fetchUserListWithLimit = async () => {
            setIsLoading(true);
            const response = await axios.get(`/api/auth/user-list?limit=${limit}`, {
                headers: {
                    'authorization': token
                }
            });
            setItems(response.data.data);
            setLimit(response.data.totalRecords);
            setIsLoading(false);
        };

        fetchUserListWithLimit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit]);



    useEffect(() => {
        localStorage.getItem("role") !== "Admin" && history.push("/dashboard")
    });

    const [settingsData, setSettingsData] = useState([])
    useEffect(() => {
        var token = getToken();
        //! fetch settings api
        const fetchSettingsApi = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/setting`, {
                    headers: {
                        'authorization': token
                    }
                });
                setSettingsData(response.data.data[0]);
                console.log("data", response.data.data[0]);
            } catch (error) {
                console.log("Something went wrong!", error)
            }
            setIsLoading(false);
        }
        fetchSettingsApi();
    }, [reload]);

    // ! yup validation
    const validate = Yup.object({
        orgName: Yup.string().required('Organization is required'),
        websiteUrl: Yup.string().required('Website is required'),
        youtubeUrl: Yup.string().required('Youtubesite url is required'),
        linkedinUrl: Yup.string().required('Linkedin url is required'),
        twitterUrl: Yup.string().required('Twitter url is required'),
    })

    // ! form initial values
    const initialValues = {
        websiteUrl: settingsData.websiteUrl,
        youtubeUrl: settingsData.youtubeUrl,
        linkedinUrl: settingsData.linkedinUrl,
        twitterUrl: settingsData.twitterUrl,
        orgName: settingsData.orgName,
        createdAt: getDateTime(settingsData.createdAt),
        email: settingsData.email
    }

    const updateSettingsApi = async (values) => {
        var token = getToken();
        setIsLoading(true);
        try {
            const response = await axios.put(
                `/api/setting/${settingsData._id}`,
                {
                    websiteUrl: values.websiteUrl,
                    youtubeUrl: values.youtubeUrl,
                    linkedinUrl: values.linkedinUrl,
                    twitterUrl: values.twitterUrl,
                    orgName: values.orgName,
                    email: values.email,
                },
                {
                    headers: {
                        authorization: token
                    }
                }
            )
            console.log('Update Settings Successfully', response)
        } catch (error) {
            console.log('Something went wrong!', error)
        }
        setReload(!reload);
        setIsLoading(false);
    }

    const onSubmitEvent = (values, onSubmitProps) => {
        updateSettingsApi(values);
        onSubmitProps.resetForm();
    }

    return (
        <>
            {/* {
                isLoading ? <Loader /> : */}
            <CCard>
                <CCardHeader>
                    Settings
                </CCardHeader>
                <Formik initialValues={initialValues} validationSchema={validate} onSubmit={onSubmitEvent} enableReinitialize >
                    {formik => (
                        <Form id="form">
                            <CCardBody>
                                <CRow>
                                    <CCol md="12">
                                        <CRow>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Organization Name" name="orgName" type="text" />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Website Url" name="websiteUrl" type="text" />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Youtube Url" name="youtubeUrl" type="text" />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Linkedin Url" name="linkedinUrl" type="text" />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Twitter Url" name="twitterUrl" type="text" />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Email" name="email" />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormGroup>
                                                    <TextField label="Created At" name="createdAt" type="text" readOnly />
                                                </CFormGroup>
                                            </CCol>
                                        </CRow>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardFooter>
                                {
                                    isLoading ?
                                        <button className="btn btn-primary btn-block" disabled>
                                            <CSpinner component="span" size="sm" aria-hidden="true" className="mr-2" />
                                            Loading...
                                        </button>
                                        :
                                        <button className="btn btn-primary btn-block" type="submit" disabled={!(formik.isValid && formik.dirty)}> Update </button>
                                }

                            </CCardFooter>
                        </Form>
                    )}
                </Formik>
            </CCard>
            {/* } */}
        </>
    )
}

export default Settings
