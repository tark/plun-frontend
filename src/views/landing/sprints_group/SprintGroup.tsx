import React, {useState, useEffect} from 'react'
import './sprint_group.css';
import {AnimationControls, useAnimation} from 'framer';
import SprintAnim from '../anim/sprint_anim';
import {timeout} from '../../../util/async_util';
import {remToPx} from '../../../util/screen_util';

const sprintsDistance = remToPx(13)
const centralSprintIndex = 2
const sprintsCount = 2
const tasksCounts = [4, 3, 4, 4, 3, 2, 4, 3, 4, 5, 3, 3, 4, 4, 3, 3, 4, 3, 4, 5]
const tasksCountFailed = [2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2]

export default function SprintGroup(props: any) {

  const [tasksVisible, setTasksVisible] = useState(Array(sprintsCount).fill(false));
  const [tasksMarked, setTasksMarked] = useState(Array(sprintsCount).fill(false));
  const [failedTasksMoved, setFailedTasksMoved] = useState(Array(sprintsCount).fill(false));
  const [failedTasksHidden, setFailedTasksHidden] = useState(Array(sprintsCount).fill(false));

  // Can't do it inside a loop, so will do manually

  const animations : Array<AnimationControls> = []
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())
  animations.push(useAnimation())

  useEffect(() => {
    startMainAnimation().then()
  }, []);

  const startMainAnimation = async () => {

    await appearAllSprints()
    await waitOneSec()

    // ---

    for (let i = 0; i < sprintsCount; i++) {
      await moveCycle(i)
    }

  }

  const moveCycle = async (cycleNumber: number) => {

    // Values are the animations values contains TRUE/FALSE for the sprints that
    // should be animated. For example on cycle 1, only the central sprint should be animated
    // so we put TRUE to the central index
    // For the next step, the next sprint will be animated, so we put tru to both of them
    // this is not about exact animations, but mostly about for what sprints tasks should be visible
    const values = Array(sprintsCount).fill(false)

    for (let i = 0; i < sprintsCount; i++) {
      const shiftedIndex = (i + centralSprintIndex) % sprintsCount
      values[shiftedIndex] = i <= cycleNumber
    }

    console.log(`moveCycle - ${values}`)

    setTasksVisible(values)
    await wait(2)
    setTasksMarked(values)
    await waitOneSec()
    await moveAllSprintsLeft(cycleNumber)
    setFailedTasksMoved(values)
    await waitOneSec();
    setFailedTasksHidden(values)
    await waitOneSec();
  }

  const appearAllSprints = async () => {
    for (let i = 0; i < sprintsCount; i++) {
      animations[i].start('visible')
    }
    await waitOneSec()
  }

  /**
   * @param cycleNumber - Number of step we are moving. moving distance calculates based on that.
   * @returns {Promise<void>}
   */
  const moveAllSprintsLeft = async (cycleNumber: number) => {
    animations.forEach((a) => {
      a.start({
        x: (cycleNumber + 1) * -sprintsDistance,
        transition: {
          duration: 0.3
        }
      })
    })

    await waitOneSec();

  }

  const waitOneSec = async () => {
    await timeout(1000);
  }

  const wait = async (seconds: number) => {
    await timeout(seconds * 1000);
  }

  return <div
    className='bg-danger d-flex'
    style={{margin: 200, padding: 15, overflow: 'visible'}}>

    {Array(sprintsCount).fill(null).map((e, i) => i).map((i) => <SprintAnim
      z={1005 - i}
      animation={animations[i]}
      tasksVisible={tasksVisible[i]}
      tasksMarked={tasksMarked[i]}
      failedTasksMoved={failedTasksMoved[i]}
      failedTasksHidden={failedTasksHidden[i]}
      tasksCount={tasksCounts[i]}
      tasksCountFailed={tasksCountFailed[i]}
      id={i}
      isPlun/>)}

  </div>

}


