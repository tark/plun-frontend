import React from 'react';
import moment from 'moment';
import ContentLoader from 'react-content-loader';
import TaskItem from '../../landing/task_item';
import {Plan, Task} from '../../../api/models/models';
import './day.css';

interface DayProps {
  plan?: Plan,
  localPlan?: Plan,
  onPlanChanged: Function,
  // using special flag instead of stay on plan == null
  // because after loaded plan still can be null
  loading?: boolean,
}

/**
 * Show tasks for today
 * @param props
 * @constructor
 */
export default function Day(props: DayProps) {

  const {plan, localPlan, onPlanChanged, loading} = props
  const {entries: entriesRemote, date} = plan || {}
  const {entries: entriesLocal} = localPlan || {}
  const todayMidnight = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0})

  const entries = [...entriesRemote ?? [], ...entriesLocal ?? []]

  const handleTaskStateChanged = (task: Task, state: string) => {

    onPlanChanged({
      ...plan,
      entries: entriesRemote?.map((e) => {
        if (e.taskId === task.id) {
          return {...e, taskState: state}
        }
        return e
      })
    })
  }

  const handleTaskDelete = (task: Task) => {
    onPlanChanged({
      ...plan,
      entries: entriesRemote?.filter((e) => e.taskId !== task.id)
    })
  }

  return <div>

    <div>
      <b>{moment(date).format('dddd')}</b>
      <span style={{color: '#bbb'}}> - {moment(date).format('MMM D')}</span>
    </div>

    {loading && <div>
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

    {!loading && !plan && <div className='placeholder'>No tasks for today. Create your first one.</div>}

    {entries && entries.map(e => (
      <TaskItem
        key={e.task.id}
        task={e.task}
        showDeleteButton={todayMidnight < moment(date)}
        showState={todayMidnight > moment(date)}
        onDeletePressed={() => handleTaskDelete(e.task)}
        onStateChanged={(s: any) => handleTaskStateChanged(e.task, s)}
        stateChanging={false}
        isLocal={entriesLocal?.some((e1) => e1.taskId === e.task.id) ?? false}
        date={moment(date)}
        state={e.taskState}
      />
    ))}
  </div>

}
