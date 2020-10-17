import React from 'react'
import {object} from 'prop-types'
import moment from 'moment';
import './period.css';
import TasksList from '../tasks_list/TasksList';

export default function Period(props: any) {

  const {period} = props
  const {tasksLists, startTime, title} = period

  const today = moment(startTime).day() === moment().day()

  return <div className='m-4'>
    <div className='period-title mb-4 ml-2'>
      {/*{title || today ? 'Today' : moment(startTime).format('MMMM, D')}*/}
      {/*{title || today ? 'Today' : 'Yesterday'}*/}
      Today
    </div>
    <div className='d-flex flex-row row'>
      {tasksLists.map((l: any) => <TasksList
        tasksList={l}
        showResult={!today}
      />)}
    </div>
    {/*<div className='mt-5'>
      <hr className='solid'/>
    </div>*/}
  </div>

}

Period.propTypes = {
  period: object,
}

