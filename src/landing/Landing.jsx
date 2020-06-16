import React from 'react'
import {createMuiTheme} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import {ThemeProvider} from '@material-ui/styles';
import './message/message.css';
import './landing.css'
import Footer from './footer';
import Example from './example';
import Roulette from "./Roulette";

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

  return <ThemeProvider theme={theme}>

    <div className='col pb-5'>

      <div className='my-5 text-center'>
        <div className='d-flex flex-wrap justify-content-center'>
          <div className='title word'>Plun</div>
          <div className='title word'>is</div>
          <div className='title word'>a</div>
          <div className='title word'>plun-result</div>
          <div className='title word'>tool</div>
          <div className='title word'>for</div>
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
            <div className='title word'>Work</div>
            <Roulette
              options={['calmly', 'focused', 'confident', 'clear', 'fast']}
              className='word'
              color='blue'/>
            <div className='title word'>after</div>
            <div className='title word'>create</div>
            <div className='title word'>plan</div>
            <div className='title word'>for</div>
            <Roulette
              options={['today', 'week', 'month']}
              className='word'
              color='red'/>
            <div className='title word'>from</div>
            <div className='title word'>your</div>
            <Roulette
              options={['Teams', 'Jira', 'Trello', 'Asana']}
              className='word'
              color='blue'/>
            <div className='title word'>tasks</div>
            <div className='title word'>in</div>
            <div className='title word'>2</div>
            <div className='title word'>minutes,</div>
            <div className='subtitle word'>instead</div>
            <div className='subtitle word'>of</div>
            <div className='subtitle word'>rush</div>
            <div className='subtitle word'>between</div>
            <div className='subtitle word'>tasks</div>
            <div className='subtitle word'>every</div>
            <div className='subtitle word'>hour</div>
            <div className='subtitle word'>and</div>
            <div className='subtitle word'>loose</div>
            <div className='subtitle word'>context</div>
            <div className='subtitle word'>every</div>
            <div className='subtitle word'>time</div>
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
            <div className='title word'>Feel</div>
            <Roulette
              options={['connected', 'free', 'funny', 'together', 'nice', 'safe', 'confident', 'talking']}
              color='orange'
            />
            <div className='title word'>after</div>
            <div className='title word'>update</div>
            <div className='title word'>your</div>
            <div className='title word'>team</div>
            <div className='title word'>with</div>
            <div className='title word'>the</div>
            <div className='title word'>progress</div>
            <div className='title word'> in</div>
            <Roulette
              options={['Slack', 'Teams', 'Skype']}
              color='blue'/>
            <div className='title word'>in</div>
            <div className='title word'>2</div>
            <div className='title word'>clicks,</div>
            <div className='subtitle word'>instead</div>
            <div className='subtitle word'>of</div>
            <div className='subtitle word'>trying</div>
            <div className='subtitle word'>to</div>
            <div className='subtitle word'>remember</div>
            <div className='subtitle word'>it,</div>
            <div className='subtitle word'>scroll</div>
            <div className='subtitle word'>it,</div>
            <div className='subtitle word'>search</div>
            <div className='subtitle word'>for</div>
            <div className='subtitle word'>it,</div>
            <div className='subtitle word'>and</div>
            <div className='subtitle word'>copy-past</div>
            <div className='subtitle word'>in</div>
            <div className='subtitle word'>a hurry</div>
          </div>

          <div
            className='card mt-5 shadow text-center justify-content-center'
            >
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

