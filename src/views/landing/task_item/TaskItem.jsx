import React from 'react'
import {object, bool, func} from 'prop-types'
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {TaskStatus} from '../../../config/constants';
import './task_item.css';

const TITLE_MAX_LENGTH = 42


TaskItem.propTypes = {
  task: object,
  showDeleteButton: bool,
  onDeletePressed: func,
  onStateChanged: func,
}

export default function TaskItem(props) {

  const {task, showDeleteButton, onDeletePressed, onStateChanged} = props
  const {id, name, state} = task

  const statusView = () => {
    switch (state) {
      case TaskStatus.created:
      default:
        return <FiberManualRecordIcon
          className='status-icon created'
          onClick={() => onStateChanged(TaskStatus.done)}
        />
      case TaskStatus.done:
        return <FiberManualRecordIcon
          className='status-icon done'
          onClick={() => onStateChanged(TaskStatus.progress)}
        />
      case TaskStatus.failed:
        return <FiberManualRecordIcon
          className='status-icon fail'
          onClick={() => onStateChanged(TaskStatus.cancelled)}
        />
      case TaskStatus.progress:
        return <FiberManualRecordIcon
          className='status-icon progressx'
          onClick={() => onStateChanged(TaskStatus.failed)}
        />
      case TaskStatus.cancelled:
        return <DeleteIcon
          className='status-icon created'
          onClick={() => onStateChanged(TaskStatus.created)}
        />
    }
  }


  const titleClipped = () => {

    if (!name) {
      return ''
    }

    if (name.length < TITLE_MAX_LENGTH) {
      return name
    }
    return `${name.substr(0, TITLE_MAX_LENGTH)}...`
  }

  return <div className='d-flex flex-row task'>
    {statusView()}
    <div className='task-title flex-grow-1'>{titleClipped()}</div>
    {showDeleteButton && <div>
      <IconButton size='small' onClick={() => onDeletePressed(task)}>
        <DeleteIcon className='status-icon' size='small' style={{color: '#bbb'}}/>
      </IconButton>
    </div>}
  </div>


}


