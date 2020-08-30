import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button';
import queryString from 'querystring'
import './main.css';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {func, array} from 'prop-types';
import {authToAzureByUserId, getProfile, planTasks} from '../../api/plun_api';
import OrganizationsList from './OrganizationsList';
import {UnauthorizedError} from '../../api/unauthorized_error';
import TaskSelector from '../landing/task_selector';
import Loader from '../components/loader';
import TaskItem from '../landing/task_item';

export default function Main(props) {

  //const [authFailed, setAuthFailed] = useState(false)
  //const [authSuccess, setAuthSuccess] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [logging, setLogging] = useState(false)
  const [user, setUser] = useState(null)
  const [authFailed, setAuthFailed] = useState(false)
  const [authFailReason, setAuthFailReason] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [plannedTasks, setPlannedTasks] = useState([])
  const [savingPlan, setSavingPlan] = useState(false)
  const [error, setError] = useState(null)

  //const {store} = props
  //const user = store.getUser();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const search = window.location.search.replace('?', '')
    const {authResult, token: tokenFromQuery} = queryString.parse(search)

    if (authResult === undefined) {
      initData().then()
    } else {
      initDataFromAuthResult(authResult, tokenFromQuery).then()
    }
  }, [])

  useEffect(() => {
    savePlannedTasksToServer()
  }, [plannedTasks])

  const authByAuthCode = async () => {
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

    window.location.href = authUrl
  }

  const onAzureLoginClick = (e) => {
    e.preventDefault();
    authByAuthCode().then()
  }

  const initData = async () => {

    setLogging(true)

    if (!token) {
      setLoggedIn(false)
      authByAuthCode().then()
      return;
    }

    setLoggedIn(true)

    try {
      const profile = await getProfile(token)
      console.log(`initData - ${JSON.stringify(profile)}`)
      setUser(profile)
    } catch (e) {
      console.log(`initData - error - ${e}`)
      setLoggedIn(false)
      authByAuthCode().then()
    }

  }

  /**
   * Handle case when we just have redirected from AzureAuthCallback page
   * @returns {Promise<void>}
   */
  const initDataFromAuthResult = async (authResult, tokenToSave) => {
    if (authResult) {
      localStorage.setItem('token', tokenToSave);
      window.location.assign('https://localhost:3000/app')
    } else {
      setAuthFailed(true)
    }
  }

  const loginOnStart = async () => {
    let userId;
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
      authByAuthCode().then()
      return;
    }

    // otherwise we consider to HAVE a user id
    try {
      // trying to login with it's id
      setLogging(true)
      const authUser = await authToAzureByUserId(userId)
      setLogging(false)
      //store.setUser(authUser)
      //setAuthSuccess(true);

    } catch (e) {
      if (e instanceof UnauthorizedError) {
        authByAuthCode()
      }
    }
  }

  const onTaskSelected = (task) => {
    console.log(`onTaskSelected - ${task}`)
    setPlannedTasks([...plannedTasks, task])
  }

  const onTaskDeleted = (task) => {
    console.log(`onTaskDeleted - ${task}`)
    setPlannedTasks(plannedTasks.filter(t => t.azureId !== task.azureId))
  }

  const savePlannedTasksToServer = async () => {
    if (!plannedTasks || !plannedTasks.length) {
      return
    }
    try {
      setSavingPlan(true)
      await planTasks(plannedTasks)
      setSavingPlan(true)
    } catch (e) {
      setSavingPlan(false)
      setError(e)
    }
  }

  const content = () => {
    return (<div className='main'>
      <Drawer
        className='drawer'
        variant="permanent"
        classes={{paper: 'drawerPaper'}}
        anchor="left">

        <List>

          {!user && <Loader/>}

          {user && <ListItem button key={user.name}>
            <ListItemText primary={user.name}/>
          </ListItem>}

          <Divider/>

          {!user && <Loader/>}

          {user && <OrganizationsList
            token={token}
            onChangeOrganization={setSelectedOrganization}
            onChangeProject={setSelectedProject}
          />}

        </List>

      </Drawer>

      <div className='content'>



        <TaskSelector
          organizationName={selectedOrganization ? selectedOrganization.name : ''}
          projectName={selectedProject ? selectedProject.name : ''}
          token={token}
          onTaskSelect={onTaskSelected}/>
      </div>

      <Button
        onClick={savePlannedTasksToServer}
        disabled={!plannedTasks || !plannedTasks.length}>
        Plan for today
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}>
        <Alert
          onClose={() => setError(null)}
          severity="success">
          {error}
        </Alert>
      </Snackbar>

    </div>)
  }

  console.log(`Main - ${selectedOrganization}, ${selectedProject}`)

  return <div>

    {content()}

  </div>

}


