import React from 'react'
import {string, number} from 'prop-types'
import './sprint.css';

export default function Sprint(props) {

  const {title, doneTasksCount, failedTasksCount} = props

  const doneArray = new Array(doneTasksCount)
  doneArray.forEach(x => console.log(`asdfasdf`))

  console.log(`Sprint - ${doneArray.length}`)

  const doneTasksNumbers = () => {
    const numbers = []
    for (let i = 0; i < doneTasksCount; i++) {
      numbers.push(i)
    }
    return numbers
  }

  return <div className='m-4'>
    {/*<div className='sprint-title'>
      {title}
    </div>*/}

    <div className='sprint-container'>

      {doneTasksCount && Array(doneTasksCount).fill().map(x => <div
        key={`done-${x}`}
        className='sprint-task sprint-task-done'/>)}

      {failedTasksCount && Array(failedTasksCount).fill().map(x => <div
        key={`done-${x}`}
        className='sprint-task sprint-task-failed'/>)}

    </div>

  </div>

}

Sprint.propTypes = {
  title: string,
  doneTasksCount: number,
  failedTasksCount: number,
}

