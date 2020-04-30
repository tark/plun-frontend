import React from 'react'
import moment from 'moment';
import {string} from 'prop-types'
import './example.css';
import Period from '../period';
import {getRandomInt, getRandomIntInRange} from '../../util/math';
import {peopleNames, TasksManagers, tasksNames, TaskStatus} from '../../config/constants';
import {getRandomElement} from '../../util/list_util';

export default function Example(props) {

  const {text, color} = props

  console.log(`Message - ${color}`)

  const generatePeriods = () => {
    const localPeriods = []

    for (let i = 0; i < 7; i++) {

      console.log(`generatePeriods - now - ${moment()}`)

      localPeriods.push({
        startTime: moment().subtract(i, 'days').valueOf(),
        tasksLists: generateTasksLists(i === 0)
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
    //const noDoneTasksCount = tasksCount - doneTasksCount;
    //console.log(`generateTasks - all - ${tasksCount}`)
    //console.log(`generateTasks - done - ${doneTasksCount}`)
    //console.log(`generateTasks - not done - ${noDoneTasksCount}`)
    //console.log('generateTasks - ===========')

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

  return <div className='example'>
    {generatePeriods().map(p => <Period period={p}/>)}
  </div>

}

Example.propTypes = {
  text: string,
  color: string,
}

