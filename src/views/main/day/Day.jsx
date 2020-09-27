import {array, func, number} from 'prop-types';
import React, {useCallback, useEffect} from 'react';
import moment from 'moment';
import TaskItem from '../../landing/task_item';

Day.propTypes = {
  date: number,
  tasks: array,
  onTaskDelete: func,
  onTaskStateChanged: func,
}

/**
 * Show tasks for today
 * @param props
 * @constructor
 */
export default function Day(props) {

  const {date, tasks, onTaskDelete, onTaskStateChanged} = props

  return <div>

    <div>
      <b>{moment(date).format('dddd')}</b>
      <span style={{color: '#bbb'}}> - {moment(date).format('MMM D')}</span>
    </div>

    {!tasks && <div>No tasks for today</div>}

    {tasks && tasks.map(t => (
      <TaskItem
        task={t}
        showDeleteButton
        onDeletePressed={() => onTaskDelete(t)}
        onStateChanged={state => onTaskStateChanged({...t, state})}
      />
    ))}
  </div>

}
