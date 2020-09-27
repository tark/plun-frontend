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
import copy from 'copy-html-to-clipboard';
import moment from 'moment';
import {
  authToAzureByUserId,
  deleteTask,
  getPreviousNearestPlan,
  getProfile,
  planTasks, updateTask
} from '../../api/plun_api';
import OrganizationsList from './OrganizationsList';
import {UnauthorizedError} from '../../api/unauthorized_error';
import TaskSelector from '../landing/task_selector';
import Loader from '../components/loader';
import Day from './day';

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
  const [previousTasks, setPreviousTasks] = useState([])
  const [todayTasks, setTodayTasks] = useState([])
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
    if (selectedOrganization && selectedProject) {
      refreshTodayAndPreviousDayTasks()
    }
  }, [selectedProject, selectedOrganization])

  useEffect(() => {
    // as a reaction on changing previousTasks we should adjust today tasks
    // once today tasks saved we should
  }, [previousTasks])

  //useEffect(() => {
  //  savePlannedTasksToServer()
  //}, [plannedTasks])

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

  const onTaskSelected = async (task) => {
    console.log(`onTaskSelected - ${task}`)
    await planTask(task)
    await refreshTodayAndPreviousDayTasks()
  }

  const onTaskDeleted = (task) => {
    console.log(`onTaskDeleted - ${task}`)
    //setPlannedTasks(plannedTasks.filter(t => t.azureId !== task.azureId))
  }

  const planTask = async (task) => {
    if (!task) {
      return
    }
    try {
      setSavingPlan(true)
      await planTasks([task])
      setSavingPlan(true)
    } catch (e) {
      setSavingPlan(false)
      setError(e)
    }
  }

  const refreshTodayAndPreviousDayTasks = async () => {
    try {
      // to test old tasks
      const tasks = await getPreviousNearestPlan(selectedOrganization.name, selectedProject.name, token)

      //const tasks = await getPlanForToday(selectedOrganization.name, selectedProject.name, token)
      setPreviousTasks(tasks);

      //const previousTasks = await getPlanForToday(selectedOrganization.name, selectedProject.name, token)
      //setTodayTasks(tasks);
    } catch (e) {
      setError(e)
    }
  }

  const onTaskDelete = async (task) => {
    console.log(`onTaskDelete - ${JSON.stringify(task, null, 2)}`)
    await deleteTask(task)
    await refreshTodayAndPreviousDayTasks()
  }

  const onTaskStateChanged = async (task) => {
    await updateTask(task)
    await refreshTodayAndPreviousDayTasks()
  }

  /**
   * Get a list of tasks and returns a formatted message that can be inserted to the chats
   */
  const tasksToMessage = (date, tasks) => {
    let result = '<div>'
    result += '<div>'
      + `<b>${moment(date).format('dddd')}</b>`
      + `<span style='color: "#bbb"'>, ${moment(date).format('MMM D')}</span>`
      + '</div>'

    tasks.forEach(t => {
      const {azureUrl, name, state} = t
      result += '\r\n'
      let icon = iconByTaskState(state);
      if (icon) {
        icon += ' '
      }
      if (azureUrl) {
        result += `<p>- ${icon}<a href='${azureUrl}'>${name}</a></p>`
      } else {
        result += `- ${icon}${t.name}`
      }
    })
    result += '\r\n'
    result += '</div>'
    return result
  }

  const iconByTaskState = (state) => {
    // 'created' | 'done' | 'progress' | 'failed' | 'cancelled'
    switch (state) {
      case 'created':
      default:
        return '';
      case 'done':
        return '✅';
      case 'progress':
        return '🚧';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🗑️';
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

        {/* previous day - show result */}
        <Day
          date={new Date().getTime()}
          tasks={previousTasks}
          onTaskDelete={onTaskDelete}
          onTaskStateChanged={onTaskStateChanged}
        />

        {/* current day - show the plan */}
        <Day
          date={new Date().getTime()}
          tasks={previousTasks}
          onTaskDelete={onTaskDelete}
          onTaskStateChanged={onTaskStateChanged}
        />

        <TaskSelector
          organizationName={selectedOrganization ? selectedOrganization.name : ''}
          projectName={selectedProject ? selectedProject.name : ''}
          token={token}
          onTaskSelect={onTaskSelected}/>

        <Button
          variant='contained'
          color='primary'
          onClick={e => {
            console.log(tasksToMessage(moment.now(), previousTasks))
            copy(tasksToMessage(moment.now(), previousTasks), {asHtml: true})
          }}>
          Copy
        </Button>

      </div>

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

  return <div>

    {content()}

  </div>

}


