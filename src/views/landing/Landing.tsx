import React from 'react'
import classnames from 'classnames';
import {createMuiTheme} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import queryString from 'querystring'
import {ThemeProvider} from '@material-ui/styles';
import './message/message.css';
import './landing.css'
import Button from '@material-ui/core/Button';
import Roulette from './Roulette';
import ActionButton from './action_button/ActionButton';
import TaskSelector from './task_selector';

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
        fontWeight: 800,
      },
    },
    /*MuiAutocomplete: {
      popper: {
        maxHeight: 160,
      },
      paper: {
        maxHeight: 160,
      }
    }*/
  }
});

export default function Landing(props: any) {

  const title = (text: string) => {
    return text.split(' ').map(w => <div className={classnames('title word')}>{w}</div>)
  }

  const subtitle = (text: string) => {
    return text.split(' ').map(w => <div className={classnames('subtitle word')}>{w}</div>)
  }

  const rouletteBlue = (text: string) => {
    return <Roulette options={text.split(' ')} color='blue'/>
  }

  const rouletteRed = (text: string) => {
    return <Roulette options={text.split(' ')} color='red'/>
  }

  const rouletteOrange = (text: string) => {
    return <Roulette options={text.split(' ')} color='orange'/>
  }

  const onAzureAuthClick = (e: any) => {
    e.preventDefault();

    const appId = process.env.REACT_APP_AZURE_APP_ID
    const state = '...'
    const scope = 'vso.work_full'
    const callbackUrl = process.env.REACT_APP_AZURE_CALLBACK_URL
    const authUrl = new URL('https://app.vssps.visualstudio.com/oauth2/authorize')

    authUrl.search = queryString.stringify({
      client_id: appId,
      response_type: 'Assertion',
      state,
      scope,
      redirect_uri: callbackUrl,
    });

    window.location.href = authUrl.toString()
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

          {/*{isBrowser && <div className='card mt-5 mx-5 shadow text-center justify-content-center'>
            <img
              src='plan_image.gif'
              style={{width: 374, height: 337}}
              className='align-self-center'/>
          </div>}

          {isMobile && <img
            src='plan_image.gif'
            style={{width: '100%'}}
            className='align-self-center mb-5'/>}*/}

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

          {/*{isBrowser && <div className='card mt-5 mx-5 shadow text-center justify-content-center'>
            <img
              src='result_image.gif'
              style={{width: 374, height: 297, marginTop: 20, marginBottom: 20}}
              className='align-self-center'/>
          </div>}

          {isMobile && <img
            src='result_image.gif'
            style={{width: '100%', marginTop: 20, marginBottom: 20}}
            className='align-self-center'/>}*/}

        </div>

      </div>

      <div className='w-100 d-flex align-items-center justify-content-center py-5'>
        <ActionButton/>
      </div>

      {/*<TaskSelector/>*/}

      <Button onClick={onAzureAuthClick}>
        Auth azure
      </Button>

    </div>

  </ThemeProvider>

}

