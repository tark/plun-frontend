import React from 'react'
import './message/message.css';
import './landing.css'

export default function TasksDemo(props) {


  const days = []

  const dayItem = (day) => {
    return <div>
      Today
      {day.tasks.map(t => taskItem(t))}
    </div>
  }

  const taskItem = (task) => {
    return <div className='row'>


    </div>
  }

  return <div>
    {days.map(d => dayItem(d))}
  </div>

}

