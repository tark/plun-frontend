import React, {useRef, useState} from 'react';
import moment from 'moment';
import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  fade, IconButton,
  Theme
} from '@material-ui/core';
import ContentLoader from 'react-content-loader';
import ShareIcon from '@material-ui/icons/Share';
import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import {createStyles, withStyles} from '@material-ui/styles';
import TaskItem from '../../landing/task_item';
import {Plan, PlanEntry, Task, TaskState, User} from '../../../api/models/models';
import './user_day.css';
import TaskSelector from '../../landing/task_selector';
import {DATE_FORMAT} from '../../../config/constants';
import {updatePlan} from '../../../services/plan_service';
import {profileSelectors} from '../../../store/slices/profile_slice';
import {plansSelectors} from '../../../store/slices/plan_slice';
import {iconByTaskState} from '../../../util/task_util';
import {timeout} from '../../../util/async_util';

interface UserDayProps {
  date: string,
  user: User,
  onTaskSelected: (date: string, task: Task) => void,
  onCopyToNextPlan: (date: string, task: Task) => void,
}

const BorderLinearProgress = withStyles((theme: Theme) => createStyles(
  {
    root: {
      height: 3,
    },
    colorPrimary: {
      backgroundColor: fade('#0078D4', 0.2),
    },
    bar: {
      backgroundColor: '#0078D4',
    },
  }),
)(LinearProgress);

/**
 * Show plan for the given date
 * @param props
 * @constructor
 */
export default function UserDay(props: UserDayProps) {

  const {date, user, onTaskSelected, onCopyToNextPlan} = props
  const ref = useRef(null);
  const profile = useSelector(profileSelectors.profile)
  const dispatch = useDispatch()
  const showTaskSelector = moment().format(DATE_FORMAT) === date && user.email === profile?.email
  const plans = useSelector(plansSelectors.plans)
  const plan: Plan = (plans[date] ?? {})[user.id]
  const planLoadingObject = useSelector(plansSelectors.plansLoading)
  const planUpdating = useSelector(plansSelectors.planUpdating)[date]
  const [shareDialogOpened, setShareDialogOpened] = useState(false)

  const {entries} = plan || {}

  const handleTaskStateChanged = async (task: Task, state: TaskState) => {
    if (!plan) {
      return
    }
    dispatch(updatePlan({
      ...plan,
      entries: entries?.map((e) => ({
        ...e,
        taskState: e.taskId === task.id ? state : e.taskState
      })) ?? []
    }))
  }

  const handleCopyToNextPlanPressed = (task: Task) => {
    if (onCopyToNextPlan) {
      onCopyToNextPlan(date, task)
    }
  }

  const handleTaskDelete = async (task: Task) => {
    if (!plan) {
      return
    }
    dispatch(updatePlan({
      ...plan,
      entries: entries?.filter((e) => e.taskId !== task.id) ?? []
    }))
  }

  const inEntriesNext = (entry: PlanEntry): boolean => {
    // todo fix it
    //return entriesNext?.some((e1) => e1.taskId === entry.taskId) ?? false
    return false;
  }

  const handleTaskSelected = async (task: Task) => {
    if (onTaskSelected) {
      onTaskSelected(date, task)
    }
  }

  const planLoading = (): boolean => {
    const {dateFrom, dateTo, loading} = planLoadingObject
    if (moment(date) >= moment(dateFrom) && moment(date) <= moment(dateTo)) {
      return loading ?? false
    }
    return false
  }

  /**
   * Returns tru if the given plan is the exactly previous plan
   * That mean there is no plans between today and the given plan
   * The given plan can be very old, the main point our plan goes
   * right after it
   */
  const currentPlanIsThePrevious = (): boolean => {
    const myPreviousPlan = previousPlan();
    return myPreviousPlan?.date === plan.date
  }

  const previousPlan = (): Plan | null => {
    const now = moment()
    //let foundPlan;

    // looking for the first found plan starting from today
    // and moving to the past.
    // return first found plan
    for (let i = 0; i < 365; i++) {
      const iteratingDate = now.subtract(i + 1, 'days').format(DATE_FORMAT)
      const foundPlan = (plans[iteratingDate] ?? {})[user.id]
      if (foundPlan) {
        return foundPlan
      }
    }
    return null
  }

  const onShareClick = async () => {
    setShareDialogOpened(true)
    await timeout(1000)
    copyElementToClipboard(ref.current)
  }

  const onShareDialogClose = async () => {
    setShareDialogOpened(false)
  }

  function copyElementToClipboard(node: Node | null) {

    if (!node) {
      return
    }

    // eslint-disable-next-line no-unused-expressions
    window?.getSelection()?.removeAllRanges();
    const range = document.createRange();
    range.selectNode(node);
    // eslint-disable-next-line no-unused-expressions
    window?.getSelection()?.addRange(range);
    document.execCommand('copy');
    // eslint-disable-next-line no-unused-expressions
    window?.getSelection()?.removeAllRanges();
  }

  const planToMessage = (planParam: Plan | null, showStates?: boolean) => {

    if (!planParam) {
      return <div/>
    }

    return <div style={{fontSize: 14}}>
      <br/>
      <div>
        <b>{moment(planParam.date).format('dddd')}</b>
        <span style={{color: '#bbb'}}>
          {', '}
          {moment(planParam.date).format('MMM D')}
        </span>
        {planParam.entries.map(e => {
          const {task: {azureUrl, name}, taskState} = e
          const icon = ` ${iconByTaskState(taskState)}`
          const nameElement = azureUrl ? <a href={azureUrl}>{name}</a> : name

          return <div>
            {'-'}
            {icon}
            &nbsp;
            {nameElement}
          </div>

        })}
        {/*<p>- {iconByTaskState(taskState)}<a href='${azureUrl}'>${name}</a></p>*/}
      </div>
    </div>
  }

  return <div className={classNames('day', {day_empty: !entries || !entries.length})}>

    {planUpdating && user.email === profile?.email && <BorderLinearProgress/>}

    <div className='top_stub'/>

    {planLoading() && !entries && <div>
      <ContentLoader
        speed={2}
        width={500}
        height={124}
        viewBox="0 0 476 124"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="0" y="16" rx="4" ry="4" width="16" height="16"/>
        <rect x="32" y="16" rx="4" ry="4" width="230" height="16"/>

        <rect x="0" y="48" rx="4" ry="4" width="16" height="16"/>
        <rect x="32" y="48" rx="4" ry="4" width="220" height="16"/>

        <rect x="0" y="80" rx="4" ry="4" width="16" height="16"/>
        <rect x="32" y="80" rx="4" ry="4" width="180" height="16"/>

      </ContentLoader>
    </div>}

    {entries && entries.map(e => (
      <TaskItem
        key={e.task.id}
        task={e.task}
        taskInNextPlan={inEntriesNext(e)}
        allowChangeState={currentPlanIsThePrevious()}
        onCopyToNexPlanPressed={handleCopyToNextPlanPressed}
        onStateChanged={handleTaskStateChanged}
        onDelete={handleTaskDelete}
        stateChanging={false}
        date={date ?? ''}
        state={e.taskState}
      />
    ))}

    {showTaskSelector && <TaskSelector onTaskSelect={handleTaskSelected}/>}

    {showTaskSelector && <div className='share-button-container'>
      <IconButton
        aria-label="Share"
        onClick={onShareClick}
        color='inherit'>
        <ShareIcon fontSize='small'/>
      </IconButton>
    </div>}

    <Dialog
      disablePortal
      open={shareDialogOpened}
      onClose={onShareDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Copied to clipboard</DialogTitle>
      <DialogContent ref={ref}>
        <div>
          {planToMessage(previousPlan())}
          {planToMessage(plan)}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onShareDialogClose} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>

  </div>

}
