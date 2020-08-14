import {object} from 'prop-types'
import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button';
import queryString from 'querystring'
import {authToAzureByUserId} from '../api/plun_api';
import {UnauthorizedError} from '../api/unauthorized_error';
import './main.css';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Business';

export default function Main(props) {

  const [authFailed, setAuthFailed] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)

  const {store} = props
  const user = store.getUser();

  useEffect(() => {
    loginOnStart().then()
  }, [])

  const authByAuthCode = async () => {
    console.log(`authByAuthCode`)
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

    window.location.href = authUrl
  }

  const onAzureLoginClick = (e) => {
    e.preventDefault();
    authByAuthCode().then()
  }

  const loginOnStart = async () => {
    let userId;
    const user = store.getUser()
    if (user) {
      userId = user.id;
    }

    if (!userId) {
      userId = localStorage.getItem('userId');
    }

    if (!userId) {
      const search = window.location.search.replace('?', '')
      userId = queryString.parse(search).userId
    }

    // if for the moment we still haven't user id = go and login by code
    // and quit, because the next time we get back here he should have a user id
    if (!userId) {
      authByAuthCode();
      return;
    }

    // otherwise we consider to HAVE a user id
    try {
      // trying to login with it's id
      const authUser = await authToAzureByUserId(userId)
      store.setUser(authUser)
      setAuthSuccess(true);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        authByAuthCode()
      }
    }
  }

  const content = () => {
    return (<div>
      <Drawer
        className='drawer'
        variant="permanent"
        classes={{paper: 'drawerPaper'}}
        anchor="left">

        <List>

          <ListItem button key={user.name}>
            <ListItemText primary={user.name}/>
          </ListItem>

          <Divider/>

          <ListItem button key='organizaton'>
            <ListItemIcon><MailIcon/></ListItemIcon>
            <ListItemText primary='DueDEX'/>
          </ListItem>

          <ListItem button key='project'>
            <ListItemIcon/>
            <ListItemText primary='Mex'/>
          </ListItem>

        </List>

      </Drawer>

    </div>)
  }


  return <div className='main'>

    {!authSuccess && <div>
      <div>
        Auth failed
      </div>

      <Button onClick={onAzureLoginClick}>
        Login with Azure
      </Button>

    </div>}

    {authSuccess && content()}

  </div>

}

Main.propTypes = {
  store: object,
}

