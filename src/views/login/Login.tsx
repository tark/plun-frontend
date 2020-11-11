import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import queryString from 'querystring';
import {useHistory} from 'react-router-dom';
import {Button, withStyles} from '@material-ui/core';
import {profileSelectors} from '../../store/slices/profile_slice';
import {fetchProfile} from '../../services/profile_service';
import './login.css'
import Loader from '../components/loader';

const AzureButton = withStyles({
  root: {
    background: '#0078D4',
    color: 'white',
    '&:hover': {
      backgroundColor: '#005BA1'
    }
  },
})(Button);

export const Login: React.FC = () => {

  const dispatch = useDispatch()
  const history = useHistory()

  const profile = useSelector(profileSelectors.profile)
  const unauthorized = useSelector(profileSelectors.unauthorized)
  const [redirectingToAuth, setRedirectingToAuth] = useState(false)

  console.log(`Home - unauthorized - ${unauthorized}`)

  useEffect(() => {
    console.log('useEffect')

    if (profile) {
      // open the main screen, because we already has a profile
      // which mean we authenticated
      // so main screen can get projects and organizations
      history.push('/app')
      return
    }

    // we have no profile,
    // let's try to get the profile
    dispatch(fetchProfile())

  }, [])

  useEffect(() => {
    if (profile) {
      history.push('/app')
    }
  }, [profile])

  const authByAuthCode = () => {
    console.log('authByAuthCode')
    const appId = process.env.REACT_APP_AZURE_APP_ID
    const state = 'User name'
    const scope = 'vso.work_full'
    const callbackUrl = process.env.REACT_APP_AZURE_CALLBACK_URL
    const authUrl = new URL('https://app.vssps.visualstudio.com/oauth2/authorize')

    authUrl.search = queryString.stringify({
      client_id: appId,
      response_type: 'Assertion',
      state,
      scope,
      redirect_uri: callbackUrl,
    });

    console.log(`authByAuthCode - ${authUrl}`)

    setRedirectingToAuth(true)

    window.location.href = authUrl.toString()
  }

  const devopsIcon = () => {
    return <img
      src='https://localhost:3000/devops_logo_transparent.png'
      width={20}
      alt='Devops logo'
    />
  }

  return (
    <div className='login'>

      {redirectingToAuth && <div className='redirect-message-container'>
        <div className='login-message mb-3'>
          Redirecting to Azure Devops...
        </div>
        <Loader/>
      </div>}

      {unauthorized && !redirectingToAuth && <div className='text-center'>
        <div className='login-message'>
          Please login first
        </div>
        <div className='login-button'>
          <AzureButton
            variant='contained'
            onClick={authByAuthCode}
            startIcon={devopsIcon()}>
            Login with Azure
          </AzureButton>
        </div>
      </div>}

    </div>
  )

}
