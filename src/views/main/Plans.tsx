import React, {useEffect} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Divider} from '@material-ui/core';
import {DATE_FORMAT} from '../../config/constants';
import {profileSelectors} from '../../store/slices/profile_slice';
import {usersSelectors} from '../../store/slices/users_slice';
import {createPlan, fetchPlans, updatePlan} from '../../services/plan_service';
import Users from './Users';
import {plansSelectors} from '../../store/slices/plan_slice';
import UserDay from './user_day';
import './plans.css';
import {Plan, Task} from '../../api/models/models';
import {setError} from '../../store/slices/error_slice';
import {moveToStart} from '../../util/list_util';

/**
 * Show plan for the given date
 * @param props
 * @constructor
 */
export default function Plans(props: any) {

  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)
  const dispatch = useDispatch()
  const plans = useSelector(plansSelectors.plans)
  const users = useSelector(usersSelectors.users)
  const profile = useSelector(profileSelectors.profile)

  useEffect(() => {
    if (selectedOrganization && selectedProject) {
      dispatch(fetchPlans({
        organizationName: selectedOrganization.name,
        projectName: selectedProject.name,
        dateFrom: dateFrom(),
        dateTo: dateTo(),
      }))
    }
  }, [selectedOrganization, selectedProject])

  const dateFrom = (): string => {
    return moment().subtract(10, 'days').format(DATE_FORMAT)
  }

  const dateTo = (): string => {
    return moment().format(DATE_FORMAT);
  }

  const dates = (): Array<string> => {
    const result = []
    let lastDate = moment(dateTo())
    do {
      result.push(lastDate.format(DATE_FORMAT))
      lastDate = lastDate.subtract(1, 'days')
    } while (lastDate > moment(dateFrom()))
    return result
  }

  const thisWeek = (date: string): boolean => {
    return moment().isoWeek() === moment(date).isoWeek()
  }

  const addTaskToPlan = (date: string, task: Task) => {

    //const plansForDate = plans[date];
    const plan: Plan = (plans[date] ?? {})[profile?.id ?? '']

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
            ],
            azureOrganizationName: selectedOrganization?.name ?? '',
            azureProjectName: selectedProject?.name ?? '',
            userId: profile?.id ?? '',
          },
        }
      ))
    } else {

      if (plan.entries.some((e) => !!e.task.azureId && e.task.azureId === task.azureId)) {
        dispatch(setError('Task already planned for today'))
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

  const handleCopyToNextPlan = (date: string, task: Task) => {
    addTaskToPlan(moment().format(DATE_FORMAT), task)
  }

  return <div className='plans'>

    <Users/>

    <div className='flex-grow-1' style={{overflow: 'scroll', paddingBottom: 160, width: '100%'}}>
      {dates().map(date => <div>

        <div className='d-flex'>

          <div className='date_title'>
            {thisWeek(date) && <b>{moment(date).format('dddd')}</b>}
            {!thisWeek(date) && <b>{moment(date).format('MMM, D')}</b>}

          </div>

          {moveToStart(users, u => u.email === profile?.email)?.map((user, i) => <div
            className='d-flex'>
            {i === 0 && <Divider orientation='vertical'/>}
            <UserDay
              date={date}
              user={user}
              onTaskSelected={addTaskToPlan}
              onCopyToNextPlan={handleCopyToNextPlan}
            />
            <Divider orientation='vertical'/>

          </div>)}

        </div>

        <Divider style={{width: 'auto !important'}}/>

      </div>)}
    </div>

  </div>

}
