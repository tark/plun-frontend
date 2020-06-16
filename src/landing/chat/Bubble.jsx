import React, {useRef} from 'react'
import {bool, string} from 'prop-types'
import './chat.css';

export default function Bubble(props) {

  const {animated, side} = props

  const refSpeaker1 = useRef(null);

  const speakerOne = () => {
    return document.getElementById('speaker-1');
  }

  const speakerTwo = () => {
    return document.getElementById('speaker-2');
  }

  const speakerThree = () => {
    return document.getElementById('speaker-3');
  }

  const blip = (element, opacity) => {
    if (!element) {
      return;
    }
    element.style.opacity = opacity || '1'
    setTimeout(() => element.style.opacity = '0', 300)
  }

  const animateSpeaker = () => {
    setTimeout(() => blip(speakerOne(), 0.2), 1000)
    setTimeout(() => blip(speakerTwo(), 0.2), 1150)
    setTimeout(
      () => {
        blip(speakerThree(), 0.2)
        if (animated) {
          animateSpeaker()
        }
      },
      1300
    )
  }

  animateSpeaker()

  return (
    <div className='chat-bubble position-relative'>
      <div className=' chat-bubble-inner'>
        <img
          id='speaker-full'
          src='ic_speaker_full.png'
          className='chat-speaker-icon'
          style={{opacity: 0.2}}/>
      </div>
      <div className='chat-bubble-inner'>
        <img
          ref={refSpeaker1}
          id='speaker-1'
          src='ic_speaker_1.png'
          className='position-absolute chat-speaker-icon'/>
      </div>
      <div className=' chat-bubble-inner'>
        <img
          id='speaker-2'
          src='ic_speaker_2.png'
          className='position-absolute chat-speaker-icon'/>
      </div>
      <div className=' chat-bubble-inner'>
        <img
          id='speaker-3'
          src='ic_speaker_3.png'
          className='position-absolute chat-speaker-icon'/>
      </div>
    </div>
  )

}

Bubble.propTypes = {
  animated: bool,
  side: string, // left / right
}

