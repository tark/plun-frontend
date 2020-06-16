import React from 'react'
import {object, bool, func} from 'prop-types'
import {ThemeProvider} from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox'
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {createMuiTheme, IconButton} from '@material-ui/core';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import {TaskStatus} from '../../config/constants';
import './task_item.css';
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

const TITLE_MAX_LENGTH = 22

const checkBoxTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[700],
    },
    secondary: {
      main: green[700],
    },
  },
});

export default function TaskItem(props) {

  const {task, showDeleteButton, onDeletePressed} = props
  const {id, name, status} = task

  console.log(`TaskItem - ${JSON.stringify(task, null, 2)}`)

  /*const taskManagerIconSrc = () => {
    switch (taskManager) {
      case TasksManagers.trello:
      default:
        return '/ic_trello.png'
      case TasksManagers.jira:
        return '/ic_jira.png'
      case TasksManagers.teams:
        return '/ic_teams.png'
    }
  }*/

  const statusView = () => {
    switch (status) {
      case TaskStatus.created:
      default:
        return <ThemeProvider theme={checkBoxTheme}>
          <Checkbox size='small'/>
        </ThemeProvider>
      case TaskStatus.done:
        return <CheckBoxIcon size='small' className='status-icon done'/>
      case TaskStatus.failed:
        return <IndeterminateCheckBoxIcon className='status-icon fail'/>
      //case TaskStatus.created:
      //  return <div className='mr-2'/>
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
    {showDeleteButton ? <div className='mr-2'/>:statusView()}
    <div className='task-title flex-grow-1'>{titleClipped()}</div>
    {showDeleteButton && <div>
      <IconButton size='small' onClick={() => onDeletePressed(task)}>
        <DeleteIcon className='status-icon' size='small' style={{color: '#bbb'}}/>
      </IconButton>
    </div>}
  </div>


}

TaskItem.propTypes = {
  task: object,
  showDeleteButton: bool,
  onDeletePressed: func,
}

