import React, {useEffect, useState} from 'react'
import queryString from 'querystring'
import CircularProgress from '@material-ui/core/CircularProgress';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import {getToken} from '../../api/plun_api';

export default function AzureAuthCallback(props: any) {

  const [authInProgress, setAuthInProgress] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authFail, setAuthFail] = useState(false);

  useEffect(() => {
    authToAzure().then();
  }, [])

  const authToAzure = async () => {
    const search = window.location.search.replace('?', '')
    //var x: string | string[] = null
    //var y = x as string
    const {code} = queryString.parse(search)
    try {
      setAuthInProgress(true)
      const token = await getToken(code?.toString() ?? '')
      if (token) {
        setAuthSuccess(true)
        window.location.assign(`https://localhost:3000/app?authResult=success&token=${token}`)
      } else {
        setAuthFail(true)
        window.location.assign('https://localhost:3000/app?authResult=fail')
      }
    } catch (e) {
      console.log(`authToAzure - ${e}`)
      setAuthFail(true)
      window.location.assign(`https://localhost:3000/app?authResult=fail&reason=${e}`)
    }
  }

  const handleSuccessClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthSuccess(false);
  };

  const handleFailClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthSuccess(false);
  };

  return <div>

    {authInProgress && <CircularProgress/>}

    {authFail && <Close/>}

    {authSuccess && <Done/>}

  </div>
}


