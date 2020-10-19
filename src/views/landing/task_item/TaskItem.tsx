import React, {useState} from 'react'
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import './task_item.css';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import classnames from 'classnames';
import {Moment} from 'moment';
import {iconByTaskState} from '../../../util/task_util';
import {Task, TaskState} from '../../../api/models/models';

const TITLE_MAX_LENGTH = 42

const options = [
  {
    state: 'created',
    label: '🔘 Created'
  },
  {
    state: 'progress',
    label: '🚧 Progress'
  },
  {
    state: 'done',
    label: '✅ Finished'
  },
  {
    state: 'failed',
    label: '❌ Not started'
  },
  {
    state: 'cancelled',
    label: '🗑️ Cancelled'
  },
]

interface TaskItemProps {
  task: Task;
  state: TaskState;
  date: Moment;
  isLocal: boolean;
  showDeleteButton: boolean;
  onDeletePressed: Function;
  onStateChanged: Function;
  stateChanging: boolean;
  showState: boolean;
}

export default function TaskItem(props: TaskItemProps) {

  const {
    task,
    showDeleteButton,
    showState,
    onDeletePressed,
    onStateChanged,
    isLocal,
    date,
    state,
    stateChanging,
  } = props

  const {name} = task
  console.log(`TaskItem - ${JSON.stringify(task)}`)
  const [menuAnchor, setMenuAnchor] = useState<HTMLDivElement | null>(null);

  /*const stateView = () => {
    return <div
      className='status-icon'
      onClick={e => setMenuAnchor(e.currentTarget)}>
      {iconByTaskState(state.find(s => s.date === date.format(DATE_FORMAT))?.state)}
    </div>
  }*/

  const titleClipped = () => {

    if (!name) {
      return ''
    }

    if (name.length < TITLE_MAX_LENGTH) {
      return name
    }
    return `${name.substr(0, TITLE_MAX_LENGTH)}...`
  }

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (event: any, option: any) => {
    onStateChanged(option.state);
    setMenuAnchor(null);
  };

  /*const taskState = () : TaskState => {
    console.log(`taskState - ${JSON.stringify(state)}`)
    console.log(`taskState - ${date.format(DATE_FORMAT)}`)
    return state.find(s => s.date === date.format(DATE_FORMAT))?.state ?? 'created';
  }*/

  return <div className='d-flex flex-row task'>

    {showState && <div
      className='status-icon'
      onClick={e => setMenuAnchor(e.currentTarget)}>
      {iconByTaskState(state)}
    </div>}

    <div
      className={classnames(
        'task-title flex-grow-1',
        {'task-title-local': isLocal}
      )}>
      {titleClipped()}
    </div>

    {showDeleteButton && !isLocal && <div>
      <IconButton size='small' onClick={() => onDeletePressed(task)}>
        <DeleteIcon fontSize='small' className='status-icon' style={{color: '#bbb'}}/>
      </IconButton>
    </div>}

    <Menu
      id="lock-menu"
      anchorEl={menuAnchor}
      keepMounted
      open={Boolean(menuAnchor)}
      onClose={handleMenuClose}>
      {options.map((option, index) => (
        <MenuItem
          key={option.label}
          disabled={state === option.state}
          selected={state === option.state}
          onClick={(event) => handleMenuItemClick(event, option)}>
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  </div>

}


