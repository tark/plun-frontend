import React from 'react'
import './message/message.css';
import './landing.css'

export default function TasksDemo(props: any) {

  const days : Array<any> = []

  const dayItem = (day: any) => {
    return <div>
      Today
      {day.tasks.map((t: any) => taskItem(t))}
    </div>
  }

  const taskItem = (task: any) => {
    return <div className='row'>


    </div>
  }

  return <div>
    {days.map(d => dayItem(d))}
  </div>

}

