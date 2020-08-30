import {array, func} from 'prop-types';
import React from 'react';
import TaskItem from '../../landing/task_item';

Day.propTypes = {
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

  const {tasks, onTaskDelete, onTaskStateChanged} = props

  return <div>

    <div />

    {!tasks && <div>No tasks for today</div>}

    {tasks && tasks.map(t => (
      <TaskItem
        task={t}
        showDeleteButton
        onDeletePressed={onTaskDelete}
      />
    ))}
  </div>



}
