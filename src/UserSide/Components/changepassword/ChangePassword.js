import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { TextField } from '../text_field/TextField'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../../storage/Local_Storage'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CSpinner,
  CButton
} from '@coreui/react'

const ChangePassword = () => {
  const history = useHistory()
  const [error, setError] = useState(null)
  var token = getToken()
  const [isLoading, setIsLoading] = useState(false)

  const validate = Yup.object({
    oldPassword: Yup.string()
      .trim()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    newPassword: Yup.string()
      .trim()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      'Passwords must match'
    )
  })

  const sendGetRequest = async data => {
    // setError(null)
    setIsLoading(true)
    try {
      const response = await axios.put(
        '/api/auth/change-password',
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        },
        {
          headers: {
            authorization: token
          }
        }
      )
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })

      console.log('response: ', response)
    } catch (error) {
      setError('Something went wrong Please try again !')
      toast.error(error.response.data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
    setIsLoading(false)
  }

  const onSubmitEvent = values => {
    console.log('submit data', values)
    sendGetRequest(values)
    document.getElementById('form').reset()
    document.getElementById('confirm').value = null
  }

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      <CCardGroup>
        <CCard>
          <CCardHeader>Change your password</CCardHeader>
          <CCardBody>
            <Formik
              initialValues={{
                oldPassword: '',
                newPassword: ''
              }}
              validationSchema={validate}
              onSubmit={onSubmitEvent}
            >
              {formik => (
                <Form id='form'>
                  <TextField
                    label='Old Password'
                    name='oldPassword'
                    type='password'
                  />
                  <TextField
                    label='New Password'
                    name='newPassword'
                    type='password'
                  />
                  <TextField
                    label='Confirm Password'
                    name='passwordConfirmation'
                    type='password'
                    id='confirm'
                  />
                  {error && <div className='error-1'>{error}</div>}

                  {isLoading ? (
                    <CButton
                      className='btn btn-primary btn-block mt-3'
                      disabled
                    >
                      <CSpinner
                        component='span'
                        size='sm'
                        aria-hidden='true'
                        className='mr-2'
                      />
                      Loading...
                    </CButton>
                  ) : (
                    <CButton
                      className='btn btn-primary btn-block mt-3'
                      type='submit'
                      disabled={!(formik.isValid && formik.dirty)}
                    >
                      Change Password
                    </CButton>
                  )}
                </Form>
              )}
            </Formik>
          </CCardBody>
        </CCard>
      </CCardGroup>
    </>
  )
}

export default ChangePassword
