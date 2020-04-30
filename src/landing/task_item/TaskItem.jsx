import React from 'react'
import {object} from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import {Close} from '@material-ui/icons';
import {TasksManagers, TaskStatus} from '../../config/constants';
import './task_item.css';

const TITLE_MAX_LENGTH = 22

export default function TaskItem(props) {

  const {task} = props
  const {title, status, taskManager} = task

  const taskManagerIconSrc = () => {
    switch (taskManager) {
      case TasksManagers.trello:
      default:
        return '/ic_trello.png'
      case TasksManagers.jira:
        return '/ic_jira.png'
      case TasksManagers.teams:
        return '/ic_teams.png'
    }
  }

  const statusView = () => {
    switch (status) {
      case TaskStatus.opened:
      default:
        return <Checkbox size='small'/>
      case TaskStatus.done:
        return <CheckBoxIcon size='small' className='status-icon done'/>
      case TaskStatus.failed:
        return <IndeterminateCheckBoxIcon className='status-icon fail'/>
    }
  }

  const titleClipped = () => {
    if (title.length < TITLE_MAX_LENGTH) {
      return title
    }
    return `${title.substr(0, TITLE_MAX_LENGTH)}...`
  }

  return <div className='d-flex flex-row task'>
    <div className='mr-1'>{statusView()}</div>
    <img src={taskManagerIconSrc()} className='task-management-icon'/>
    <div className='task-title'>{titleClipped()}</div>
  </div>


}

TaskItem.propTypes = {
  task: object,
}

