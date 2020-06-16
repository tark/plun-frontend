import React from 'react'
import {string} from 'prop-types'
import './message.css';

export default function Message(props) {

  const {text, color} = props

  return <div
    style={{backgroundColor: color || '#ff0000'}}
    className='message text-center text'>
    {text}
  </div>

}

Message.propTypes = {
  text: string,
  color: string,
}

