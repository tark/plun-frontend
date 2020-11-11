import React, {useEffect} from 'react';
import moment from 'moment';
import {Card} from '@material-ui/core';
import ContentLoader from 'react-content-loader';
import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import TaskItem from '../../landing/task_item';
import {Plan, PlanEntry, Task, TaskState} from '../../../api/models/models';
import './day.css';
import TaskSelector from '../../landing/task_selector';
import {DATE_FORMAT} from '../../../config/constants';
import {planSelectors} from '../../../store/slices/plan_slice';
import {fetchPlan, updatePlan, createPlan} from '../../../services/plan_service';
import {profileSelectors} from '../../../store/slices/profile_slice';

interface DayProps {
  date: string,
  onCopyToNextPlanPressed?: (date: string, task: Task) => void,
}

/**
 * Show plan for the given date
 * @param props
 * @constructor
 */
export default function Day(props: DayProps) {

  const {date} = props

  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)
  const plan: Plan = useSelector(planSelectors.plan)[date]
  const planLoading: boolean = useSelector(planSelectors.planLoading)[date]
  const planError: string | null = useSelector(planSelectors.planError)[date]
  const dispatch = useDispatch()
  const showTaskSelector = moment().startOf('date').format(DATE_FORMAT) === date

  const {
    onCopyToNextPlanPressed,
  } = props
  const {entries} = plan || {}
  //const {entries: entriesNext} = nextPlan || {}
  const todayMidnight = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0})

  useEffect(() => {
    if (selectedOrganization && selectedProject) {
      console.log(`fetching plan from  - ${date}, ${selectedOrganization.name}, ${selectedProject.name}`)
      dispatch(fetchPlan({
        date,
        organizationName: selectedOrganization?.name,
        projectName: selectedProject?.name
      }))
    }
  }, [selectedOrganization, selectedProject])

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

  const handleCopyToNextPlanPressed = async (task: Task) => {
    if (!onCopyToNextPlanPressed) {
      return
    }
    onCopyToNextPlanPressed(date ?? '', task);
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

  const onTaskSelected = async (task: Task) => {

    console.log(`onTaskSelected - ${task}`)

    // if there was no plan - create a new plan, put task here and save the plan
    if (!plan) {
      dispatch(createPlan(
        {
          plan: {
            date: moment().format(DATE_FORMAT),
            entries: [
              {
                taskId: '',
                taskState: 'created',
                task,
              }
            ]
          },
          organizationName: selectedOrganization?.name ?? '',
          projectName: selectedProject?.name ?? '',
        }
      ))
    } else {

      if (plan.entries.some((e) => e.task.azureId === task.azureId)) {
        return
      }

      dispatch(updatePlan({
        ...plan,
        entries: [
          ...plan.entries,
          {
            task,
            taskId: '',
            taskState: 'created',
          }
        ]
      }))

    }
  }

  return <Card
    className={classNames('day', {day_empty: !entries || !entries.length})}
    variant={!entries || !entries.length ? 'outlined' : 'elevation'}>

    <div className='date_title'>
      <b>{moment(date).format('dddd')}</b>
      <span style={{color: '#bbb'}}>
{' '}
        -
        {moment(date).format('MMM D')}
</span>
    </div>

    {planLoading && <div>
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
        showState={todayMidnight > moment(date)}
        onDeletePressed={handleTaskDelete}
        onCopyToNexPlanPressed={handleCopyToNextPlanPressed}
        onStateChanged={handleTaskStateChanged}
        stateChanging={false}
        date={date ?? ''}
        state={e.taskState}
      />
    ))}

    {showTaskSelector && <TaskSelector onTaskSelect={onTaskSelected}/>}

  </Card>

}
