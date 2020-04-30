import React from 'react'
import {string} from 'prop-types'
import './footer.css';

export default function Footer(props) {

  const {text, color} = props

  console.log(`Message - ${color}`)

  return <div
    //style={{'background-color': {color} || '#ff0000'}}
    style={{'background-color': color || '#ff0000'}}
    className='message text-center text'>
      {text}
  </div>

}

Footer.propTypes = {
  text: string,
  color: string,
}

