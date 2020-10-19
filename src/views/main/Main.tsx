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
//import copy from 'copy-html-to-clipboard';
import moment, {Moment} from 'moment';
import {
  authToAzureByUserId, createPlan,
  deleteTask, getPlanForToday,
  getPreviousNearestPlan,
  getProfile,
  planTasks, updatePlan,
  updateTask
} from '../../api/plun_api';
import OrganizationsList from './OrganizationsList';
import {UnauthorizedError} from '../../api/unauthorized_error';
import TaskSelector from '../landing/task_selector';
import Loader from '../components/loader';
import Day from './day/index';
import {DATE_FORMAT, TaskStatus} from '../../config/constants';
import {iconByTaskState} from '../../util/task_util';
import {Organization, Plan, PlanEntry, Project, Task, User} from '../../api/models/models';
import {last} from '../../util/list_util';

export default function Main(props: any) {

  //const [authFailed, setAuthFailed] = useState(false)
  //const [authSuccess, setAuthSuccess] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [logging, setLogging] = useState(false)
  const [user, setUser] = useState<User>()
  const [authFailed, setAuthFailed] = useState(false)
  const [authFailReason, setAuthFailReason] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization>()
  const [selectedProject, setSelectedProject] = useState<Project>()
  const [previousPlan, setPreviousPlan] = useState<Plan>()
  // local tasks created here on client as a suggestion
  // for today plan
  const [todayLocalPlan, setTodayLocalPlan] = useState<Plan>()
  const [todayPlan, setTodayPlan] = useState<Plan>()
  const [planForTodaySaved, setPlanForTodaySaved] = useState(false)
  const [savingPlan, setSavingPlan] = useState(false)
  const [error, setError] = useState(null)
  const [loadingTodayPlan, setLoadingTodayPlan] = useState(false)
  const [loadingPreviousPlan, setLoadingPreviousPlan] = useState(false)

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

  /*useEffect(() => {
    // as a reaction on changing previousTasks we should adjust today tasks
    // once today tasks saved we should
    if (!planForTodaySaved) {
      setTodayTasks(previousTasks.filter(t => t.state === TaskStatus.created && t.state === TaskStatus.progress));
    }
  }, [previousTasks])*/

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

    window.location.href = authUrl.toString()
  }

  const onAzureLoginClick = (e: any) => {
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
  const initDataFromAuthResult = async (authResult: any, tokenToSave: any) => {
    if (authResult) {
      localStorage.setItem('token', tokenToSave);
      window.location.assign('https://localhost:3000/app')
    } else {
      setAuthFailed(true)
    }
  }

  const loginOnStart = async () => {
    let userId: string = '';
    if (user) {
      userId = user?.id;
    }

    if (!userId) {
      userId = localStorage.getItem('userId') ?? '';
    }

    if (!userId) {
      const search = window.location.search.replace('?', '')
      userId = queryString.parse(search).userId?.toString() ?? ''
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

  const onTaskSelected = async (task: Task) => {
    console.log(`onTaskSelected - ${task}`)
    await planTask(task)
    await refreshTodayAndPreviousDayTasks()
  }

  const onTaskDeleted = (task: Task) => {
    console.log(`onTaskDeleted - ${task}`)
    //setPlannedTasks(plannedTasks.filter(t => t.azureId !== task.azureId))
  }

  const planTask = async (task: Task) => {
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

      setLoadingPreviousPlan(true)
      const prevPlan = await getPreviousNearestPlan(
        selectedOrganization?.name ?? '',
        selectedProject?.name ?? '',
        token ?? ''
      )
      setPreviousPlan(prevPlan);
      setLoadingPreviousPlan(false)

      setLoadingTodayPlan(true)
      const todayPlanFromApi = await getPlanForToday(
        selectedOrganization?.name ?? '',
        selectedProject?.name ?? '',
        token ?? ''
      )
      setTodayPlan(todayPlanFromApi);
      setLoadingTodayPlan(false)

      const todayPlanLocal = {
        date: moment().format(DATE_FORMAT),
        entries: prevPlan.entries.filter((e) => {
          // skip if it already planned on a server side
          return todayPlanFromApi.entries.every((e1) => e1.taskId !== e.taskId)
            // and take from prev plan created or in progress
            && (e.taskState === TaskStatus.created || e.taskState === TaskStatus.progress)
        })
      };
      setTodayLocalPlan(todayPlanLocal);
      setPlanForTodaySaved(false);
    } catch (e) {
      setError(e)
    }
  }


  const onTaskDelete = async (task: Task) => {
    console.log(`onTaskDelete - ${JSON.stringify(task, null, 2)}`)
    await deleteTask(task)
    await refreshTodayAndPreviousDayTasks()
  }

  const onTaskStateChanged = async (task: Task) => {
    console.log(`onTaskStateChanged - ${JSON.stringify(task)}`)
    await updateTask(task)
    await refreshTodayAndPreviousDayTasks()
  }

  /**
   * Get a list of tasks and returns a formatted message that can be inserted to the chats
   */
  const planToMessage = (plan?: Plan) => {

    if (!plan || !plan.entries || !plan.entries.length) {
      return ''
    }

    let result = '<div>'
    result += '<div>'
      + `<b>${moment(plan.date).format('dddd')}</b>`
      + `<span style='color: "#bbb"'>, ${moment(plan.date).format('MMM D')}</span>`
      + '</div>'

    plan.entries.forEach((e: PlanEntry) => {
      const {task: {azureUrl, name}, taskState} = e
      result += '\r\n'
      let icon = iconByTaskState(taskState);
      if (icon) {
        icon += ' '
      }
      if (azureUrl) {
        result += `<p>- ${icon}<a href='${azureUrl}'>${name}</a></p>`
      } else {
        result += `- ${icon}${name}`
      }
    })
    result += '\r\n'
    result += '</div>'
    return result
  }

  const onSavePlanClick = async () => {
    if (!todayLocalPlan) {
      return
    }
    await createPlan(todayLocalPlan)
    setPlanForTodaySaved(true)
  }

  const onPlanChanged = async (plan: Plan) => {
    if (!plan) {
      return
    }
    await updatePlan(plan)
  }

  return <div className='main'>
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
          token={token ?? ''}
          onChangeOrganization={setSelectedOrganization}
          onChangeProject={setSelectedProject}
        />}

      </List>

    </Drawer>

    <div className='content'>

      {/* previous day - show result */}
      {previousPlan && <Day
        plan={previousPlan}
        onPlanChanged={onPlanChanged}
      />}

      {/* current day - show the plan */}
      <div className='mt-5'>
        <Day
          plan={todayPlan}
          localPlan={todayLocalPlan}
          onPlanChanged={onPlanChanged}
          loading={loadingTodayPlan || loadingPreviousPlan || !selectedProject || !selectedOrganization}
        />
      </div>

      <TaskSelector
        organizationName={selectedOrganization ? selectedOrganization.name : ''}
        projectName={selectedProject ? selectedProject.name : ''}
        token={token ?? ''}
        onTaskSelect={onTaskSelected}/>

      {planForTodaySaved && <div className='mt-3'>
        <Button
          variant='contained'
          color='primary'
          onClick={e => {
            console.log(planToMessage(previousPlan))
            // use a type script version of copy-to-clipboard
            //copy(tasksToMessage(moment(), previousTasks), {asHtml: true})
          }}>
          Copy
        </Button>
      </div>}

      {!planForTodaySaved && <div className='mt-3'>
        <Button
          variant='contained'
          color='primary'
          onClick={onSavePlanClick}>
          Save plan
        </Button>
      </div>}

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

  </div>
}


