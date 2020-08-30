import React from 'react'
import moment from 'moment';
import {string} from 'prop-types'
import './one_person_example.css';
import Period from '../period';
import {getRandomInt, getRandomIntInRange} from '../../util/math';
import {peopleNames, TasksManagers, tasksNames, TaskStatus} from '../../config/constants';
import {getRandomElement} from '../../util/list_util';

export default function OnePersonExample(props) {

  const {text, color} = props

  console.log(`Message - ${color}`)

  const generatePeriods = () => {
    const localPeriods = []

    for (let i = 0; i < 7; i++) {

      console.log(`generatePeriods - now - ${moment()}`)

      localPeriods.push({
        startTime: moment().subtract(i + 1, 'days').valueOf(),
        tasksLists: generateTasksLists(false/*i === 0*/)
      })
    }
    return localPeriods
  }

  const generateTasksLists = (today) => {
    return peopleNames.map(n => ({
      name: n,
      tasks: generateTasks(today)
    }));
  }

  const generateTasks = (today) => {
    const tasks = []
    const tasksCount = getRandomIntInRange(3, 7);
    const doneTasksCount = getRandomInt(tasksCount);

    for (let i = 0; i < tasksCount; i++) {

      let status;
      if (i <= doneTasksCount) {
        status = TaskStatus.done
      } else if (today) {
        status = TaskStatus.opened
      } else {
        status = TaskStatus.failed
      }

      tasks.push({
        taskManager: getRandomElement([
          TasksManagers.trello,
          TasksManagers.jira,
          TasksManagers.teams
        ]),
        title: getRandomElement(tasksNames),
        status,
      })
    }
    return tasks;
  }

  return <div className='d-flex text-center'>
    <div
      className='d-flex align-items-center'
      style={{marginTop: 110, height: 140, color: '#ff5555'}}>
      <div className='mr-2'><strong>Plan</strong></div>
      <img src='curly_bracket_left.svg' height={140} style={{fill: '#ff5555'}}/>
    </div>
    <Period period={{
      title: 'Yesterday',
      tasksLists: [{
        name: 'Jane',
        tasks: [
          {
            taskManager: TasksManagers.trello,
            title: 'Implement combining bars data',
            status: TaskStatus.done,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'iOS chart rendering problem',
            status: TaskStatus.done,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Bugs 0.0.51',
            status: TaskStatus.done,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Prepare build 0.0.61',
            status: TaskStatus.failed,
          }
        ]
      }]
    }}/>
    <div
      className='d-flex align-items-center'
      style={{marginTop: 110, height: 100, color: '#ff5555'}}>
      <img src='curly_bracket_right.svg' height={100}/>
      <div className='ml-2'><strong>Result</strong></div>
    </div>
  </div>

}

OnePersonExample.propTypes = {
  text: string,
  color: string,
}

