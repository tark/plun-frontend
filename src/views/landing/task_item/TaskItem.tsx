import React, {useState} from 'react'
import {Divider, MenuItem} from '@material-ui/core';
import './task_item.css';
import classnames from 'classnames';
import moment from 'moment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {
  faHammer,
  faCheckSquare,
  faTimes,
  faTrash,
  faCircle
} from '@fortawesome/free-solid-svg-icons'
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import Menu from '@material-ui/core/Menu';
import {red} from '@material-ui/core/colors';
import {useSelector} from 'react-redux';
import {Plan, Task, TaskState} from '../../../api/models/models';
import {DATE_FORMAT, TaskStatus} from '../../../config/constants';
import {plansSelectors} from '../../../store/slices/plan_slice';
import {profileSelectors} from '../../../store/slices/profile_slice';

const TITLE_MAX_LENGTH = 42

interface TaskItemProps {
  task: Task;
  state: TaskState;
  date: string;
  taskInNextPlan: boolean;
  onCopyToNexPlanPressed: (task: Task) => void;
  onStateChanged: (task: Task, state: TaskState) => void;
  onDelete: (task: Task) => void;
  stateChanging: boolean;
  allowChangeState: boolean;
}

export type Option = {
  state: TaskState,
  icon: string,
  label: string,
}

const options: Array<Option> = [
  {
    state: 'created',
    icon: '-',
    label: 'Created'
  },
  {
    state: 'progress',
    icon: '🚧',
    label: 'Progress'
  },
  {
    state: 'done',
    icon: '✅',
    label: 'Finished'
  },
  {
    state: 'failed',
    icon: '❌',
    label: 'Not started'
  },
  {
    state: 'cancelled',
    icon: '🗑️',
    label: 'Cancelled'
  },
]

export default function TaskItem(props: TaskItemProps) {

  const {
    task,
    date,
    state,
    taskInNextPlan,
    onCopyToNexPlanPressed,
    onStateChanged,
    onDelete,
    allowChangeState,
  } = props

  const {name, azureUrl} = task
  const [showMenuButton, setShowMenuButton] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLDivElement | null>(null);
  const profile = useSelector(profileSelectors.profile)
  const plan: Plan = (useSelector(plansSelectors.plans)[date] ?? {})[profile?.id ?? '']

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (event: any, option: any) => {
    onStateChanged(task, option.state);
    setMenuAnchor(null);
  };

  const handleDeleteClick = (event: any) => {
    onDelete(task);
    setMenuAnchor(null);
  };

  const titleClipped = () => {

    if (!name) {
      return ''
    }

    if (name.length < TITLE_MAX_LENGTH) {
      return name
    }
    return `${name.substr(0, TITLE_MAX_LENGTH)}...`
  }

  const canMoveTaskToNextPlan = (): boolean => {
    return !taskInNextPlan && (state === TaskStatus.created || state === TaskStatus.progress) && date !== moment().format(DATE_FORMAT)
  }

  const iconByTaskState = (taskState: TaskState): IconDefinition => {
    console.log(`iconByTaskState - ${taskState}`)
    switch (taskState) {
      case 'created':
      default:
        return faCircle
      case 'done':
        return faCheckSquare
      case 'progress':
        return faHammer
      case 'failed':
        return faTimes
      case 'cancelled':
        return faTrash
    }
  }

  const taskStateAsString = (taskState: TaskState): string => {
    switch (taskState) {
      case 'created':
      default:
        //return '—'
        return '-'
      case 'done':
        return '✅'
      case 'progress':
        return '🚧'
      case 'failed':
        return '❌'
      case 'cancelled':
        return '🗑'
    }
  }

  const actionStateButton = (taskState: TaskState) => {
    return <div
      className='action-icon'
      onClick={_ => onStateChanged(task, taskState)}
    >
      <FontAwesomeIcon icon={iconByTaskState(taskState)}/>
    </div>
  }

  const today = (): boolean => {
    return date === moment().format(DATE_FORMAT)
  }

  return <div
    className='task'
    onMouseEnter={() => setShowMenuButton(true)}
    onMouseLeave={() => setShowMenuButton(false)}>

    <div className='status-icon-container'>

      {state === TaskStatus.created && <div className='status-icon'>
        {taskStateAsString(state)}
      </div>}

      {state !== TaskStatus.created && <div
        className='status-icon'>
        {taskStateAsString(state)}
        {/*<FontAwesomeIcon icon={iconByTaskState(state)}/>*/}
      </div>}
    </div>

    <div
      className={classnames(
        'task-title flex-grow-1',
        {'task-title-local': !!azureUrl}
      )}>
      {azureUrl && <a href={azureUrl}>{name}</a>}
      {!azureUrl && name}
    </div>

    {showMenuButton && <div
      className='status-icon'
      onClick={e => setMenuAnchor(e.currentTarget)}>
      <MoreVertIcon className='more-icon'/>
    </div>}

    <Menu
      disableAutoFocusItem
      id="lock-menu"
      anchorEl={menuAnchor}
      keepMounted
      open={Boolean(menuAnchor)}
      onClose={handleMenuClose}>

      {allowChangeState && options.map((option, index) => (
        <MenuItem
          disableGutters
          key={option.label}
          disabled={state === option.state}
          onClick={(event) => handleMenuItemClick(event, option)}>
          <div className='menu-item'>
            <div className='menu-icon'>
              {option.icon}
            </div>
            {option.label}
          </div>
        </MenuItem>
      ))}

      {allowChangeState && <Divider className='menu-divider'/>}

      {!today() && <MenuItem
        disableGutters
        key='delete'
        onClick={_ => onCopyToNexPlanPressed(task)}>
        <div className='menu-item'>
          <div className='menu-icon'>
            <ArrowDownwardIcon style={{fontSize: 15}}/>
          </div>
          Plan for today
        </div>
      </MenuItem>}

      {today() && <MenuItem
        disableGutters
        key='delete'
        onClick={handleDeleteClick}>
        <div className='menu-item' style={{color: red[900]}}>
          <div className='menu-icon'>
            <DeleteIcon style={{color: red[900], fontSize: 15}}/>
          </div>
          Delete task
        </div>
      </MenuItem>}

    </Menu>

  </div>

}


