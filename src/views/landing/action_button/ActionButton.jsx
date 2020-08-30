import React from 'react'
import './action_button.css';
import Button from '@material-ui/core/Button';
import * as typeformEmbed from '@typeform/embed';
import {createMuiTheme} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import {ThemeProvider} from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
      },
      label: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        fontSize: '1rem',
        fontWeight: '800',
      },
    },
  }
});

export default function ActionButton(props) {

  const popup = typeformEmbed.makePopup(
    'https://airon921592.typeform.com/to/f0pfmQ',
    {mode: 'popup'}
  )

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant='contained'
        color='primary'
        onClick={() => popup.open()}>
        Get a free trial
      </Button>
    </ThemeProvider>
  )

}
