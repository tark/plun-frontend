import CircularProgress, {CircularProgressProps} from '@material-ui/core/CircularProgress';
import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {createStyles} from '@material-ui/core';

const loaderStyles = makeStyles(
  (_) => createStyles(
    {
      root: {
        position: 'relative',
      },
      bottom: {
        color: '#dedede',
      },
      top: {
        color: '#0078D4',
        animationDuration: '1500ms',
        position: 'absolute',
        left: 0,
      },
      circle: {
        strokeLinecap: 'round',
      },
    }
  ),
);

export default function Loader(props: CircularProgressProps) {
  const classes = loaderStyles();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={30}
        thickness={2}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={30}
        thickness={3}
        {...props}
      />
    </div>
  );
}
