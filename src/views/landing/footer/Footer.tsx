import React from 'react'
import {string} from 'prop-types'
import './footer.css';

export default function Footer(props: any) {

  const {text, color} = props

  return <div
    style={{
      backgroundColor: color || '#222',
      color: '#777777',
      fontSize: '0.8rem',
    }}
    className='text-center py-4'>
    Made by Tark
  </div>

}

Footer.propTypes = {
  text: string,
  color: string,
}

