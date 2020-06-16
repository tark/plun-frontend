import React, {useEffect} from 'react'
import {Frame, Color, useAnimation} from 'framer';
import './sprint_anim.css';
import {bool, number, object} from 'prop-types';
import {remToPx} from '../../../util/screen_util';
import {timeout} from '../../../util/async_util';

const defaultDuration = 0.2
const sprintAppearanceTime = defaultDuration
const taskAppearanceTime = defaultDuration
const taskMarkTime = defaultDuration
const taskMarkDelay = 0.3
const beforeTaskMoveOutDelay = defaultDuration
const green = '#43a047'
const red = '#e53935'
const grey = '#bbb'
const totalTasksCount = 3;
const sprintsDistance = remToPx(13)
const tasksDistance = remToPx(3)
const sprintPadding = remToPx(1)
const minTasks = 2
const maxTasks = 3

export default function SprintAnim(props) {

  const sprintVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: {duration: 0.3},
        scale: {
          type: 'spring',
          stiffness: 400,
          damping: 20,
          restSpeed: 0.6
        }
      }
    }
  }

  const taskVariants = {
    taskHidden: {
      y: 20,
      opacity: 0
    },
    taskVisible: {
      y: 0,
      opacity: 1,
      background: '#bbb',
      /*transition: {
        duration: 1,
      }*/
    },
    taskGreen: {
      background: '#43a047',
      transition: {
        duration: 0.2
      }
    },
    taskRed: {
      background: '#e53935',
      transition: {
        duration: 0.2
      }
    },
  }

  const {
    z,
    index,
    centralIndex,
    animation,
    tasksVisible,
    tasksMarked,
    failedTasksMoved,
    failedTasksHidden,
    isPlun,
    tasksCount,
    tasksCountFailed,
    id,
  } = props


  // some number of animations. IT should be bigger than tasksCount + tasksCountFailed
  // despite the fact failed tasks includes in tasks, for isPlun case we are creating duplicates
  // for the failed tasks, so we need more animations than simply tasksCount.
  // we need tasksCount + tasksFailedCount as minimum.
  // we can't create exact number of animations, because useEffect can't be used in loop, so
  // we simply creating enough animations.
  const animations = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ]

  const visibleState = () => {
    return tasksVisible ? 'taskVisible' : 'taskHidden';
  }

  useEffect(() => {
    showTasks().then()
  }, [tasksVisible])

  useEffect(() => {
    markTasks().then()
  }, [tasksMarked])

  useEffect(() => {
    console.log(`nonMarkedTasksMoved - ${failedTasksMoved}`)
    if (!failedTasksMoved) {
      return
    }
    moveFailedTasks().then()
  }, [failedTasksMoved])

  useEffect(() => {
    console.log(`nonMarkedTasksHidden - ${failedTasksHidden}`)
    if (!failedTasksHidden) {
      return
    }
    hideFailedTasks().then()
  }, [failedTasksHidden])

  const showTasks = async () => {
    console.log(`showTasks - tasksVisible - ${id}, ${tasksVisible}`)

    for (let i = 0; i < tasksCount; i++) {
      await animations[i].start(visibleState())
    }

    if (isPlun) {
      for (let i = 0; i < tasksCountFailed; i++) {
        animations[tasksCount + i].start(visibleState())
      }
    }

  }

  const markTasks = async () => {
    for (let i = 0; i < tasksCount; i++) {
      const taskDone = i < tasksCount - tasksCountFailed
      const variant = taskDone ? 'taskGreen' : 'taskRed'
      await animations[i].start(tasksMarked ? variant : visibleState())
    }

    if (isPlun) {
      for (let i = 0; i < tasksCountFailed; i++) {
        animations[tasksCount + i].start('taskRed')
      }
    }
  }

  const moveFailedTasks = async () => {
    console.log(`moveFailedTasks - count - ${tasksCountFailed}`)

    // when isPlun, move the copy of failed tasks, failed tasks itself stays here
    const from = isPlun ? tasksCount : tasksCount - tasksCountFailed
    const to = isPlun ? tasksCount + tasksCountFailed : tasksCount

    for (let i = from; i < to; i++) {
      console.log(`moveFailedTasks - iterating - ${i}`)
      await animations[i].start({
        x: sprintsDistance,
        y: -tasksDistance * (tasksCount - tasksCountFailed),
        background: '#bbb'
      })
    }
  }

  const hideFailedTasks = async () => {

    // when isPlun, hide the copy of failed tasks, failed tasks itself stays visible
    const from = isPlun ? tasksCount : tasksCount - tasksCountFailed
    const to = isPlun ? tasksCount + tasksCountFailed : tasksCount

    for (let i = from; i < to; i++) {
      await animations[i].start({
        //background: '#bbb'
        opacity: 0
      })
    }
  }

  // moving steps count up to being at the central index
  let stepsCountToCentral = index - centralIndex
  if (stepsCountToCentral < 0) {
    stepsCountToCentral += totalTasksCount
  }

  const zIndex = z || 1

  console.log(`SprintAnim - tasksCount - ${tasksCount}`)

  return <Frame
    position='relative'
    style={{width: '12rem', height: '15rem', overflow: 'visible', zIndex}}
    className='p-3 rounded-lg grey-bg mr-3'
    variants={sprintVariants}
    initial='hidden'
    animate={animation}>

    {/*
    we need absolute position to show the task stay and fly form the same place (like copying)
    for the plun section
    */}

    {Array(tasksCount).fill(null).map((_, i) => <Frame
      style={{opacity: 0, top: sprintPadding + tasksDistance * i}}
      className='anim-task rounded-sm mb-3'
      variants={taskVariants}
      animate={animations[i]}/>)}


    {/*
    Additional tasks duplicating the failed tasks for the Plun case.
    For the Plun we are COPYING the tasks to the next milestone, so the previous tasks
    should stay here. That is why we will move the copy of tasks, not itself.
    Only for isPlun case
    */}

    {isPlun && Array(tasksCountFailed).fill(null).map((_, i) => <Frame
      style={{opacity: 0, top: sprintPadding + tasksDistance * (tasksCount - tasksCountFailed + i)}}
      className='anim-task rounded-sm mb-3'
      variants={taskVariants}
      animate={animations[tasksCount + i]}/>)}

  </Frame>

}

SprintAnim.propTypes = {
  z: number,
  // The first sprint appears and it's tasks should appears immediately after that.
  // all other sprints appears with another logic. It appears empty and get the task form the
  // previous sprint moved over it. Then it should move left and only after that it's tasks will
  // appears. So we are using this index number to differentiate animation logic of the first and
  // other sprints
  // Also, depends on this number we will calculate the delay before the appearance
  index: number,
  centralIndex: number,
  animation: object,
  tasksVisible: bool,
  tasksMarked: bool,
  failedTasksMoved: bool,
  failedTasksHidden: bool,
  isPlun: bool,
  tasksCount: number,
  tasksCountFailed: number,
  id: number,
}

