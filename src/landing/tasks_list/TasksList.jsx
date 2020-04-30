import React from 'react'
import {object, bool} from 'prop-types'
import '../landing.css';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import {TaskStatus} from '../../config/constants';
import TaskItem from '../task_item';

export default function TasksList(props) {

  const {tasksList, showResult} = props
  const {name, tasks} = tasksList

  let percent = tasks.filter(t => t.status === TaskStatus.done).length / tasks.length;
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

  return <div className='col-lg'>
    <div className='ml-2 d-flex' style={{fontSize: '1.2rem'}}>
      <strong>{name}</strong>
      {showResult && <div
        className='ml-2'
        style={{color: color, textSize: '1.2rem'}}>
        <strong>{resultText}</strong>
      </div>}
    </div>
    {tasks.map(t => <TaskItem task={t}/>)}
  </div>

}

TasksList.propTypes = {
  tasksList: object,
  showResult: bool
}

