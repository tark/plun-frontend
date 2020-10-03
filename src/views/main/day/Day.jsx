import {array, func, number, bool} from 'prop-types';
import React, {useCallback, useEffect} from 'react';
import moment from 'moment';
import ContentLoader from 'react-content-loader';
import TaskItem from '../../landing/task_item';

Day.propTypes = {
  date: number,
  tasks: array,
  onTaskDelete: func,
  onTaskStateChanged: func,
  loading: bool,
}

/**
 * Show tasks for today
 * @param props
 * @constructor
 */
export default function Day(props) {

  const {date, tasks, onTaskDelete, onTaskStateChanged, loading} = props

  if (loading) {
    return <div>
      <ContentLoader
        speed={2}
        width={500}
        height={124}
        viewBox="0 0 476 124"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="48" y="8" rx="3" ry="3" width="88" height="6"/>
        <rect x="48" y="26" rx="3" ry="3" width="52" height="6"/>
        <rect x="0" y="56" rx="3" ry="3" width="410" height="6"/>
        <rect x="0" y="72" rx="3" ry="3" width="380" height="6"/>
        <rect x="0" y="88" rx="3" ry="3" width="178" height="6"/>
        <circle cx="20" cy="20" r="20"/>
      </ContentLoader>
    </div>
  }

  const todayMidnight = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0})

  return <div>

    <div>
      <b>{moment(date).format('dddd')}</b>
      <span style={{color: '#bbb'}}> - {moment(date).format('MMM D')}</span>
    </div>

    {!tasks && <div>No tasks for today</div>}

    {tasks && tasks.map(t => (
      <TaskItem
        key={t.id}
        task={t}
        showDeleteButton={todayMidnight < date}
        showState={todayMidnight > date}
        onDeletePressed={() => onTaskDelete(t)}
        onStateChanged={state => onTaskStateChanged({...t, state})}
      />
    ))}
  </div>

}
