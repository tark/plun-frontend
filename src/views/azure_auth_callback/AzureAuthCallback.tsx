import React, {useEffect, useState} from 'react'
import queryString from 'querystring'
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {profileSelectors} from '../../store/slices/profile_slice';
import {auth} from '../../services/profile_service';
import '../login/login.css'
import Loader from '../components/loader';

export const AzureAuthCallback: React.FC = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const authError = useSelector(profileSelectors.authError)
  const profile = useSelector(profileSelectors.profile)
  const [error, setError] = useState('')

  useEffect(() => {
    // on start - get the code from url and auth
    const search = window.location.search.replace('?', '')

    const {code, error: codeError} = queryString.parse(search)

    if (codeError) {
      setError(codeError.toString())
      return
    }

    if (code) {
      dispatch(auth(code.toString()))
      return
    }

    setError('Something gonna wrong')

  }, [])

  useEffect(() => {
    if (profile) {
      history.push('/login')
    }
  }, [profile])

  useEffect(() => {
    if (authError) {
      history.push('/login')
    }
  }, [authError])

  return <div className='login'>
    {!error && <div className='redirect-message-container'>
      <div className='login-message mb-3'>
        Logging in...
      </div>
      <Loader/>
    </div>}

    {error && <div className='login-error-message'>
      Error: {error}
    </div>}

  </div>
}


