import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

export default function Loader(props: any) {
  return <div style={{margin: 10}}>
    <CircularProgress
      thickness={2}
      size={20}
    />
  </div>
}
