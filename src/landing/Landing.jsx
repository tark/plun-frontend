import React from 'react'
import classnames from 'classnames';
import {createMuiTheme} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import {ThemeProvider} from '@material-ui/styles';
import './message/message.css';
import './landing.css'
import Roulette from './Roulette';

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

  const onActionButtonClick = (buttonIndex) => {
    switch (buttonIndex) {
      case 0:
        // send a data to firebase about a free trial
        break;
    }
  }

  //return <Roulette options={['test', 'super', 'AI', 'blockchain']}/>

  const title = (text) => {
    return text.split(' ').map(w => <div className={classnames('title word')}>{w}</div>)
  }

  const subtitle = (text) => {
    return text.split(' ').map(w => <div className={classnames('subtitle word')}>{w}</div>)
  }

  const rouletteBlue = (text) => {
    return <Roulette
      options={text.split(' ')}
      className='word'
      color='blue'/>
  }

  const rouletteRed = (text) => {
    return <Roulette
      options={text.split(' ')}
      className='word'
      color='red'/>
  }

  const rouletteOrange = (text) => {
    return <Roulette
      options={text.split(' ')}
      className='word'
      color='orange'/>
  }

  return <ThemeProvider theme={theme}>

    <div className='col pb-5'>

      <div className='my-5 text-center'>
        <div className='d-flex flex-wrap justify-content-center'>
          {title('Plun is a plun-result tool for')}
          <Roulette
            options={['Teams', 'Jira', 'Trello']}
            className='word'
            color='blue'
          />
        </div>
      </div>

      <div className='row flex-grow-1'>

        <div className='col-lg-6 px-5'>
          <div className='d-flex flex-wrap'>
            {title('Work')}
            {rouletteBlue('peaceful calm focused confident clear fast')}
            {title('after create plan for')}
            {rouletteRed('today week month')}
            {title('from your')}
            {rouletteBlue('Teams Jira Trello Asana')}
            {title('tasks in 2 minutes, ')}
            {subtitle('instead of rush between tasks every hour and loose context every time')}
          </div>

          <div className='card mt-5 shadow text-center justify-content-center'>
            <img
              src='plan_image.gif'
              style={{width: 374, height: 337}}
              className='align-self-center'/>
          </div>

        </div>

        <div className='col-lg-6 px-5'>
          <div className='d-flex flex-wrap'>
            <div className='title word'>Be</div>
            {rouletteOrange('transparent structured informed connected opened honest reliable friendly')}
            {title('after update your team with the progress in')}
            {rouletteBlue('Slack Teams Skype')}
            {title('in 4 clicks,')}
            {subtitle('instead of searching, copying, composing a long message and forgetting to send finally')}
          </div>

          <div className='card mt-5 shadow text-center justify-content-center'>
            <img
              src='result_image.gif'
              style={{width: 374, height: 297, marginTop: 20, marginBottom: 20}}
              className='align-self-center'/>
          </div>

        </div>

      </div>

    </div>

  </ThemeProvider>

}

