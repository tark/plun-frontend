import React, {useEffect} from 'react'
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

  useEffect(() => {
    // on start - get the code from url and auth
    const search = window.location.search.replace('?', '')
    console.log(`search - ${search}`)
    const {code} = queryString.parse(search)
    dispatch(auth(code?.toString() ?? ''))
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
    <div className='redirect-message-container'>
      <div className='login-message mb-3'>
        Logging in...
      </div>
      <Loader/>
    </div>
  </div>
}


