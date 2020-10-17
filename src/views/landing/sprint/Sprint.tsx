import React from 'react'
import {string, number} from 'prop-types'
import './sprint.css';

export default function Sprint(props: any) {

  const {title, doneTasksCount, failedTasksCount} = props

  const doneArray = new Array(doneTasksCount)

  console.log(`Sprint - ${doneArray.length}`)

  const doneTasksNumbers = () => {
    const numbers = []
    for (let i = 0; i < doneTasksCount; i++) {
      numbers.push(i)
    }
    return numbers
  }

  const array = (count: number): Array<number> => {
    const result = Array(count);
    for (let i = 0; i < count; i++) {
      result.push(i)
    }
    return result;
  }

  return <div className='m-4'>
    {/*<div className='sprint-title'>
      {title}
    </div>*/}

    <div className='sprint-container'>

      {doneTasksCount && array(doneTasksCount).map(x => <div
        key={`done-${x}`}
        className='sprint-task sprint-task-done'/>)}

      {failedTasksCount && array(failedTasksCount).fill(0).map(x => <div
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

