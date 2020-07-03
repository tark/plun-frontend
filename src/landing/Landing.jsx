import {isBrowser, isMobile} from 'react-device-detect';
import React from 'react'
import classnames from 'classnames';
import {createMuiTheme} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import {ThemeProvider} from '@material-ui/styles';
import './message/message.css';
import './landing.css'
import Roulette from './Roulette';
import ActionButton from './action_button/ActionButton';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0C6CB6',
    },
    secondary: {
      main: red[500],
    },
  },
  overrides: {
    MuiButton: {
      label: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        fontSize: '0.7rem',
        fontWeight: '800',
      },
    },
    MuiAutocomplete: {
      popper: {
        maxHeight: 160,
      },
      paper: {
        maxHeight: 160,
      }
    }
  }
});

export default function Landing(props) {

  const title = (text) => {
    return text.split(' ').map(w => <div className={classnames('title word')}>{w}</div>)
  }

  const subtitle = (text) => {
    return text.split(' ').map(w => <div className={classnames('subtitle word')}>{w}</div>)
  }

  const rouletteBlue = (text) => {
    return <Roulette options={text.split(' ')} className='word' color='blue'/>
  }

  const rouletteRed = (text) => {
    return <Roulette options={text.split(' ')} className='word' color='red'/>
  }

  const rouletteOrange = (text) => {
    return <Roulette
      options={text.split(' ')}
      className='word'
      color='orange'/>
  }

  return <ThemeProvider theme={theme}>

    <div className='col pb-5'>

      <div className='my-5 text-center px-5'>
        <div className='d-flex flex-wrap justify-content-center'>
          {title('Plun is a plun-result tool for')}
          {rouletteBlue('Teams Jira Trello')}
        </div>
      </div>

      <div className='w-100 d-flex align-items-center justify-content-center pb-5'>
        <ActionButton/>
      </div>

      <div className='row flex-grow-1'>

        <div className='col-lg-6'>

          <div className='d-flex flex-wrap mx-5'>
            {title('Work')}
            {rouletteBlue('peaceful calm focused confident clear fast')}
            {title('after create plan for')}
            {rouletteRed('today week month')}
            {title('from your')}
            {rouletteBlue('Teams Jira Trello Asana')}
            {title('tasks in 2 minutes, ')}
            {subtitle('instead of rush between tasks every hour and loose context every time')}
          </div>

          {isBrowser && <div className='card mt-5 mx-5 shadow text-center justify-content-center'>
            <img
              src='plan_image.gif'
              style={{width: 374, height: 337}}
              className='align-self-center'/>
          </div>}

          {isMobile && <img
            src='plan_image.gif'
            style={{width: '100%'}}
            className='align-self-center mb-5'/>}

        </div>

        <div className='col-lg-6'>
          <div className='d-flex flex-wrap mx-5'>
            <div className='title word'>Be</div>
            {rouletteOrange('transparent structured informed connected opened honest reliable friendly')}
            {title('after update your team with the progress in')}
            {rouletteBlue('Slack Teams Skype')}
            {title('in 4 clicks,')}
            {subtitle('instead of searching, copying, writing a long message and forgetting to send finally')}
          </div>

          {isBrowser && <div className='card mt-5 mx-5 shadow text-center justify-content-center'>
            <img
              src='result_image.gif'
              style={{width: 374, height: 297, marginTop: 20, marginBottom: 20}}
              className='align-self-center'/>
          </div>}

          {isMobile && <img
            src='result_image.gif'
            style={{width: '100%', marginTop: 20, marginBottom: 20}}
            className='align-self-center'/>}

        </div>

      </div>

      <div className='w-100 d-flex align-items-center justify-content-center py-5'>
        <ActionButton/>
      </div>

    </div>

  </ThemeProvider>

}

