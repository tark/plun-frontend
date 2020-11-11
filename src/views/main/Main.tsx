import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Button from '@material-ui/core/Button';
import './main.css';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import moment, {Moment} from 'moment';
import copy from 'copy-to-clipboard';
import {useHistory} from 'react-router-dom';
import OrganizationsList from './OrganizationsList';
import Loader from '../components/loader';
import Day from './day/index';
import {DATE_FORMAT} from '../../config/constants';
import {iconByTaskState} from '../../util/task_util';
import {Plan, PlanEntry, Task} from '../../api/models/models';
import {profileSelectors} from '../../store/slices/profile_slice';
import {fetchProfile} from '../../services/profile_service';
import {planSelectors} from '../../store/slices/plan_slice';
import {createPlan, updatePlan} from '../../services/plan_service';

export default function Main(props: any) {

  const dispatch = useDispatch()

  const profile = useSelector(profileSelectors.profile)
  const unauthorized = useSelector(profileSelectors.unauthorized)
  const history = useHistory()
  const todayPlan: Plan = useSelector(planSelectors.plan)[moment().format(DATE_FORMAT)]
  const previousPlan = todayPlan
  const [error, setError] = useState('Super error')
  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile())
    }
  }, [])

  useEffect(() => {
    if (unauthorized) {
      // unauthorized is not our problem
      // let's [Home.tsx] fix it
      history.push('/login')
    }
  }, [unauthorized])

  /**
   * Get a list of tasks and returns a formatted message that can be inserted to the chats
   */
  const plansToMessage = () => {

    if (!previousPlan || !previousPlan.entries || !previousPlan.entries.length) {
      return 'There is no previous plan'
    }

    if (!todayPlan || !todayPlan.entries || !todayPlan.entries.length) {
      return 'There is no today plan'
    }

    let result = planToMessage(previousPlan, true)
    result += '\r\n'
    result += '<p/>'
    result += '\r\n'
    result += planToMessage(todayPlan)

    return result
  }

  const planToMessage = (plan: Plan, showStates?: boolean): string => {


    if (!previousPlan || !previousPlan.entries || !previousPlan.entries.length) {
      return 'There is no previous plan'
    }

    if (!todayPlan || !todayPlan.entries || !todayPlan.entries.length) {
      return 'There is no today plan'
    }

    let result = '<div style="font-size: 14px">'
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
      if (!showStates) {
        icon = ''
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

  const onCopyToNextPlanPressed = async (date: string, task: Task) => {
    //console.log(`handleCopyToNextPlanPressed - nextPlan - ${JSON.stringify(nextPlan)}`)

    try {
      const newEntry: PlanEntry = {
        taskId: '',
        taskState: 'created',
        task,
      }

      if (!todayPlan) {
        dispatch(createPlan({
          plan: {
            date: moment().format(DATE_FORMAT),
            entries: [newEntry],
          },
          organizationName: selectedOrganization?.name ?? '',
          projectName: selectedProject?.name ?? '',
        }));
      } else {
        dispatch(updatePlan({
          ...todayPlan,
          entries: [
            ...todayPlan?.entries ?? [],
            newEntry
          ]
        }))
      }
    } catch (e) {
      setError(e)
    }
  }

  // This function expects an HTML string and copies it as rich text.
  const copyFormatted = (html: string) => {
    // Create container for the HTML
    // [1]
    const container = document.createElement('div')
    container.innerHTML = html

    // Hide element
    // [2]
    container.style.position = 'fixed'
    container.style.pointerEvents = 'none'
    container.style.opacity = '0'

    // Detect all style sheets of the page
    const activeSheets = Array.prototype.slice.call(document.styleSheets)
      .filter((sheet) => {
        return !sheet.disabled
      })

    // Mount the container to the DOM to make `contentWindow` available
    // [3]
    document.body.appendChild(container)

    // Copy to clipboard
    // [4]
    // eslint-disable-next-line no-unused-expressions
    window?.getSelection()?.removeAllRanges()

    const range = document.createRange()
    range.selectNode(container)
    // eslint-disable-next-line no-unused-expressions
    window?.getSelection()?.addRange(range)

    // [5.1]
    document.execCommand('copy')

    // [5.2]
    for (let i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true

    // [5.3]
    document.execCommand('copy')

    // [5.4]
    for (let i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = false

    // Remove the container
    // [6]
    document.body.removeChild(container)
  }

  const dates = (): Array<Moment> => {
    const datesArray: Array<Moment> = [];
    const days = 10;
    for (let i = 0; i < days; i++) {
      datesArray.push(moment().subtract(days - i - 1, 'day'))
    }
    return datesArray
  }

  return <div className='main'>
    <Drawer
      className='drawer'
      variant="permanent"
      classes={{paper: 'drawerPaper'}}
      anchor="left">

      <List>

        {!profile && <Loader/>}

        {profile && <ListItem button key={profile.name}>
          <ListItemText primary={profile.name}/>
        </ListItem>}

        <Divider/>

        {!profile && <Loader/>}

        {profile && <OrganizationsList/>}

      </List>

    </Drawer>

    <div className='content'>

      {dates().map(d => <Day
        date={d.format(DATE_FORMAT)}
        onCopyToNextPlanPressed={onCopyToNextPlanPressed}
      />)}

      <div className='mt-3'>
        <Button
          variant='contained'
          color='primary'
          onClick={_ => {
            console.log(plansToMessage())
            // use a type script version of copy-to-clipboard
            //copy('test')
            //copy(plansToMessage())
            copyFormatted(plansToMessage())
          }}>
          Copy
        </Button>
      </div>

    </div>

    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={() => setError('')}>
      <Alert
        onClose={() => setError('')}
        severity="error">
        {error}
      </Alert>
    </Snackbar>

  </div>
}


