import React from 'react'
import {string, number} from 'prop-types'
import './chat.css';
import Bubble from './Bubble';

export default function Chat(props: any) {

  const {type, title} = props

  const bubbleOne = () => {
    return document.getElementById('bubble-1');
  }

  const bubbleTwo = () => {
    return document.getElementById('bubble-2');
  }

  return <div className='m-4'>
    <div className='chat-container'>
      <div className='chat-title mb-3'>
      {title}
      </div>

      <div className='pl-5 mb-3'>
        <Bubble animated/>
      </div>

      <div className='pr-5'>
        <Bubble animated/>
      </div>

    </div>

  </div>

}

Chat.propTypes = {
  type: string, //'voice' or 'text'
  title: string,
}

