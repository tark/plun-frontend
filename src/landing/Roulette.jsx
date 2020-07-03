import React, {useEffect} from 'react'
import {useAnimation, Frame} from 'framer';
import {array, string} from 'prop-types';
import {remToPx} from '../util/screen_util';
import {timeout} from '../util/async_util';
import './landing.css'

const height = remToPx(3)

export default function Roulette(props) {

  const {options, color} = props

  const animation = useAnimation()

  useEffect(() => {
    scroll().then()
  }, [])

  const scroll = async () => {
    for (let i = 0; i < options.length; i++) {
      await animation.start({
        y: -height * i,
      })
      await timeout(4000)
    }

    await scroll()
  }

  return <div style={{height, overflow: 'hidden'}} className='word'>
    <Frame animate={animation} style={{backgroundColor: 'transparent', width: 'auto'}} className='position-relative'>
      {options.map(o => <div style={{height, color}} className='title text-center'>{o}</div>)}
    </Frame>
  </div>
}


Roulette.propTypes = {
  options: array,
  color: string,
}

