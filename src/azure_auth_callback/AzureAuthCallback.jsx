import React, {useEffect, useState} from 'react'
import queryString from 'querystring'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import {object} from 'prop-types';
import {authToAzureByCode} from '../api/plun_api';

export default function AzureAuthCallback(props) {

  const [authInProgress, setAuthInProgress] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authFail, setAuthFail] = useState(false);
  const history = useHistory();
  const {store} = props;

  useEffect(() => {
    authToAzure().then();
  }, [])

  const authToAzure = async () => {
    const search = window.location.search.replace('?', '')
    const {code} = queryString.parse(search)
    try {
      const user = await authToAzureByCode(code)
      if (user) {
        setAuthSuccess(true)
        store.setUser(user)
        localStorage.setItem('userId', user.id)
        window.location.assign(`https://localhost:3000/app?authResult=success&userId=${user.id}`)
      } else {
        setAuthFail(true)
        window.location.assign('https://localhost:3000/app?authResult=fail')
      }
    } catch (e) {
      console.log(`authToAzure - ${e}`)
      setAuthFail(true)
      window.location.assign('https://localhost:3000/app?authResult=fail')
    }
  }

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthSuccess(false);
  };

  const handleFailClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthSuccess(false);
  };

  return <div>
    <Snackbar
      open={authSuccess}
      autoHideDuration={6000}
      onClose={handleSuccessClose}>
      <Alert onClose={handleFailClose} severity="success">
        Auth success!
      </Alert>
    </Snackbar>
    <Snackbar
      open={authFail}
      autoHideDuration={6000}
      onClose={handleFailClose}>
      <Alert onClose={handleFailClose} severity="error">
        Auth fails
      </Alert>
    </Snackbar>
  </div>
}

AzureAuthCallback.propTypes = {
  store: object,
}


