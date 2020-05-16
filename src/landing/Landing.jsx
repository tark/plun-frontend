import React from 'react'
import {BackgrooundColors} from '../config/constants';
import Message from './message';
import Example from './example';


export default function Landing(props) {

  return <div className=''>

    <Message
      text={'Can\'t see what your team actually done last week?!'}
      color={BackgrooundColors.green}/>

    <Message
      text='Hard to compare what was planned and what was done?'
      color={BackgrooundColors.red}/>

    <Message
      text={'Plun is a tool for \n\n\n\nplan-result\n\n comparison.'}
      color={BackgrooundColors.blue}/>

    <Example/>

  </div>

}

