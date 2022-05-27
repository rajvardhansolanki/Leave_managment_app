import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { TextField } from '../../../components/textfield/TextField'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { setUserSession, getToken } from '../../storage/LocalStorage'

import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow
} from '@coreui/react'

const Login = () => {
  const [error, setError] = useState(null)

  const history = useHistory()
  useEffect(() => {
    var token = getToken()
    if (token === null) {
      history.push('/login')
    } else {
      history.push('/dashboard')
    }
  }, [])

  const validate = Yup.object({
    email: Yup.string()
      .trim()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .trim()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  })

  const sendGetRequest = async data => {
    setError(null)
    try {
      const response = await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password
      })
      setUserSession(response.data.token, response.data.data.role)
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      // alert(response.data.message)
      history.push('/dashboard')
    } catch (error) {
      // Handle Error Here
      toast.error(error.response.data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      // alert(error.response.data.message)
      setError('Something went wrong Please try again !')
    }
  }

  const onSubmitEvent = values => {
    console.log('submit data', values)
    sendGetRequest(values)
    document.getElementById('form').reset()
  }

  return (
    <>
      <div className='c-app c-default-layout flex-row align-items-center'>
        <CContainer>
          <CRow className='justify-content-center'>
            <CCol md='6'>
              <CCardGroup>
                <CCard className='p-4'>
                  <CCardBody>
                    <h1>Login</h1>
                    <p className='text-muted'>Sign In to your account</p>
                    <Formik
                      initialValues={{
                        email: '',
                        password: ''
                      }}
                      validationSchema={validate}
                      onSubmit={onSubmitEvent}
                    >
                      {formik => (
                        <Form id='form'>
                          <TextField label='Email' name='email' type='email' />
                          <TextField
                            label='password'
                            name='password'
                            type='password'
                          />
                          {error && <div className='error-1'>{error}</div>}
                          <button
                            className='btn btn-primary mt-3'
                            type='submit'
                            disabled={!(formik.isValid && formik.dirty)}
                          >
                            Login
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
          <ToastContainer />
        </CContainer>
      </div>
    </>
  )
}

export default Login
