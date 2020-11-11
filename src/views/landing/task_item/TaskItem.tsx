import React, {useState} from 'react'
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import './task_item.css';
import classnames from 'classnames';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faHammer,
  faCheckSquare,
  faTimes,
  faTrash,
  faCircle
} from '@fortawesome/free-solid-svg-icons'
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {Task, TaskState} from '../../../api/models/models';
import {DATE_FORMAT, TaskStatus} from '../../../config/constants';

const TITLE_MAX_LENGTH = 42

interface TaskItemProps {
  task: Task;
  state: TaskState;
  date: string;
  taskInNextPlan: boolean;
  onDeletePressed: (task: Task) => void;
  onCopyToNexPlanPressed: (task: Task) => void;
  onStateChanged: (task: Task, state: TaskState) => void;
  stateChanging: boolean;
  showState: boolean;
}

export default function TaskItem(props: TaskItemProps) {

  const {
    task,
    date,
    showState,
    onDeletePressed,
    state,
    taskInNextPlan,
    onCopyToNexPlanPressed,
  } = props

  const {name, azureUrl} = task
  const [showActions, setShowActions] = useState(false)

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

  const actionStateButton = (taskState: TaskState) => {
    return <div className='action-icon'>
      <FontAwesomeIcon icon={iconByTaskState(taskState)}/>
    </div>
  }

  return <div
    className='d-flex flex-row task'
    onMouseEnter={() => setShowActions(true)}
    onMouseLeave={() => setShowActions(false)}>

    <div className='status-icon-container'>

      {state === TaskStatus.created && <div className='status-icon icon-bullet'>
        <FontAwesomeIcon icon={iconByTaskState(state)}/>
      </div>}

      {showState && state !== TaskStatus.created && <div
        className='status-icon'>
        <FontAwesomeIcon icon={iconByTaskState(state)}/>
      </div>}
    </div>

    <div
      className={classnames(
        'task-title flex-grow-1',
        {'task-title-local': !!azureUrl}
      )}>
      {azureUrl && <a href={azureUrl}>{titleClipped()}</a>}
      {!azureUrl && titleClipped()}
    </div>


    {showActions && date === moment().format(DATE_FORMAT) && <div>
      <IconButton size='small' onClick={() => onDeletePressed(task)}>
        <DeleteIcon fontSize='small' className='action-icon'/>
      </IconButton>
    </div>}

    {showActions && canMoveTaskToNextPlan() && <div>
      <IconButton size='small' onClick={() => onCopyToNexPlanPressed(task)}>
        <ArrowDownwardIcon fontSize='small' className='action-icon'/>
      </IconButton>
    </div>}

    {showActions && actionStateButton('failed')}

    {showActions && actionStateButton('progress')}

    {showActions && actionStateButton('cancelled')}

    {showActions && actionStateButton('done')}

  </div>

}


