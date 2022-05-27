import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CSpinner
} from '@coreui/react'
import axios from 'axios';
import { getToken } from '../../../components/storage/LocalStorage';

const LeaveRequestModel = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    var token = getToken();

    const updateLeaveStatus = async (updatedStatus) => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/leave-request/update-status/${props.statusId}`, {
                status: updatedStatus
            }, {
                headers: {
                    'authorization': token
                }
            });
            console.log("Successfully", response);
        } catch (error) {
            console.log("Something went wrong!", error)
        }
        props.reloadPage();
        setIsLoading(false);
        props.toggleModel();
    }

    const approve = (updateStatus) => {
        if (props.statusId !== null && props.statusId !== undefined) {
            updateLeaveStatus(updateStatus);
        }
    }
    const reject = (updateStatus) => {
        if (props.statusId !== null && props.statusId !== undefined) {
            updateLeaveStatus(updateStatus);
        }
    }

    return (
        <>
            <CModal
                show={props.showHide}
                onClose={props.toggleModel}
                color="primary"
                className="modal"
                tabIndex="-1"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Leave Requests</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <h5 className="text-center">Change leave request.</h5>
                </CModalBody>
                <CModalFooter>
                    {
                        isLoading ?
                            <button className="btn btn-success btn " disabled>
                                <CSpinner component="span" size="sm" aria-hidden="true" className="mr-2" />
                                Loading...
                            </button>
                            :
                            <button className="btn btn-success btn" onClick={() => approve("Approved")} disabled={(isLoading ? true : false)}> Approve</button>
                    }
                    {
                        isLoading ?
                            <button className="btn btn-danger btn " disabled>
                                <CSpinner component="span" size="sm" aria-hidden="true" className="mr-2" />
                                Loading...
                            </button>
                            :
                            <button className="btn btn-danger btn" onClick={() => reject("Disapproved")} disabled={(isLoading ? true : false)}> Reject</button>
                    }
                </CModalFooter>
            </CModal>
        </>
    )
}

export default LeaveRequestModel
