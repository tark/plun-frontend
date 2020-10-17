import React from 'react'
import {string} from 'prop-types'
import './message.css';

interface MessageProps {
  text: string;
  color: string;
}

export default function Message(props: MessageProps) {

  const {text, color} = props

  return <div
    style={{backgroundColor: color || '#ff0000'}}
    className='message text-center text'>
    {text}
  </div>

}


