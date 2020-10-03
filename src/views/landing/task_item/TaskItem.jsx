import React, {useState} from 'react'
import {object, bool, func} from 'prop-types'
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import './task_item.css';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import classnames from 'classnames';
import {iconByTaskState} from '../../../util/task_util.ts';

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

TaskItem.propTypes = {
  task: object,
  showDeleteButton: bool,
  onDeletePressed: func,
  onStateChanged: func,
  stateChanging: bool,
  showState: bool,
}

export default function TaskItem(props) {

  // todo implement show it grey if this is a local task
  const {
    task,
    showDeleteButton,
    showState,
    onDeletePressed,
    onStateChanged,
    stateChanging,
  } = props

  const {id, name, state, isLocal} = task
  const [menuAnchor, setMenuAnchor] = useState(null);

  const stateView = () => {
    return <div
      className='status-icon'
      onClick={e => setMenuAnchor(e.currentTarget)}>
      {iconByTaskState(state)}
    </div>
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

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (event, option) => {
    onStateChanged(option.state);
    setMenuAnchor(null);
  };

  return <div className='d-flex flex-row task'>

    {showState && <div
      className='status-icon'
      onClick={e => setMenuAnchor(e.currentTarget)}>
      {iconByTaskState(state)}
    </div>}

    {/*todo implement task title is local grey*/}
    <div
      className={classnames(
        'task-title flex-grow-1',
        {'task-title-local': isLocal}
      )}>
      {titleClipped()}
    </div>

    {showDeleteButton && !isLocal && <div>
      <IconButton size='small' onClick={() => onDeletePressed(task)}>
        <DeleteIcon className='status-icon' size='small' style={{color: '#bbb'}}/>
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


