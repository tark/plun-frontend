import React, {useState} from 'react'
import '../landing.css';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import Button from '@material-ui/core/Button';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import {defaultTasks, ListStatus, tasksNames, TaskStatus} from '../../../config/constants';
import TaskItem from '../task_item'
import TaskSelector from '../task_selector'
import {Task} from '../../../api/models/models';

interface TasksListProps {
  tasksList: any;
  showResult: boolean;
  editable?: boolean;
  onPlanned?: Function;
}

export default function TasksList(props: TasksListProps) {

  //const
  const {tasksList, showResult, editable, onPlanned} = props
  const {name, tasks} = tasksList

  const [innerTasks, setInnerTasks] = useState<Array<Task>>([])
  //const [innerEditable, setInnerEditable] = useState(true)
  const [listStatus, setListStatus] = useState(ListStatus.planning)

  console.log(`TasksList - innerTasks - ${innerTasks}`)

  // todo fix it later, because the state now is a list
  //let percent = tasks.filter((t: Task) => t.state === TaskStatus.done).length / tasks.length;
  let percent = 50;
  percent = Math.round(percent * 100);

  let resultText
  let color
  if (percent >= 50) {
    resultText = 'Good'
    color = green['700']
  } else if (percent >= 30) {
    resultText = 'Could be better'
    color = yellow['800']
  } else {
    resultText = 'Need attention'
    color = red['700']
  }


  const removeElementFromList = (list: any, element: any) => {
    const listInner = [...list]
    const index = listInner.indexOf(element);
    if (index > -1) {
      listInner.splice(index, 1);
    }
    return listInner;
  }

  const onDeletePressed = (task: Task) => {
    // remove task from tasks
    setInnerTasks(innerTasks.filter((t: Task) => t.id !== task.id))
  }

  const defaultTasksSorted = () => {
    const defaultTasksInner = [...defaultTasks]
    defaultTasksInner.sort((t1, t2) => {
      const name1 = t1.name.toLowerCase();
      const name2 = t2.name.toLowerCase();
      return name1 > name2 ? 1 : name1 < name2 ? -1 : 0
    })
    return defaultTasksInner
  }

  return <div className='col-lg' style={{maxWidth: 300}}>
    {/*<div className='ml-2 d-flex' style={{fontSize: '1.2rem'}}>
      <strong>{name}</strong>
      {showResult && <div
        className='ml-2'
        style={{color: color, textSize: '1.2rem'}}>
        <strong>{resultText}</strong>
      </div>}
    </div>*/}
    {innerTasks.map(t => <TaskItem
      task={{...t, status: TaskStatus.created}}
      showDeleteButton={listStatus === ListStatus.planning}
      onDeletePressed={onDeletePressed}
    />)}

    {listStatus === ListStatus.planning && <div style={{marginLeft: 10, marginRight: 10}}>
      {/*todo fix later*/}
      {/*<TaskSelector
        tasks={defaultTasksSorted().filter(t => innerTasks.every(t1 => t1.id !== t.id))}
        onTaskSelected={(t: Task) => setInnerTasks([...innerTasks, t])}/>*/}
    </div>}

    {listStatus === ListStatus.planning && <div className='row'>
      <Button
        variant='contained'
        color='primary'
        className='mt-3 flex-grow-1 mx-4 action_button'
        size='small'
        onClick={() => setListStatus(ListStatus.planned)}>
        <PlaylistAddCheckIcon style={{fontSize: '1.2rem'}} className='mr-2'/>
        Plan it
      </Button>
    </div>}

    {/*{listStatus === ListStatus.planned && <div className='row'>
      <Button
        variant='contained'
        color='primary'
        className='mt-3 flex-grow-1 mx-4 action_button'
        size='small'
        onClick={() => setListStatus(ListStatus.resultSaved)}>
        <DoneIcon style={{fontSize: '1.2rem'}} className='mr-2'/>
        Save & Share result
      </Button>
    </div>}*/}

    {listStatus === ListStatus.planned && <div>
      <Button
        disabled
        variant='text'
        className='mt-3 flex-grow-1 mx-4 action_button'
        size='small'>
        Plan copied to clipboard
      </Button>
    </div>}

    {listStatus === ListStatus.resultSaved && <div>
      <Button
        disabled
        variant='text'
        className='mt-3 flex-grow-1 mx-4 action_button'
        size='small'>
        Result copied to clipboard
      </Button>
    </div>}

  </div>

}


