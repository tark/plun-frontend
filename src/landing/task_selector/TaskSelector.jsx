import React, {useEffect, useRef, useState} from 'react'
import {func, array} from 'prop-types'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './task_selector.css';

export default function TaskSelector(props) {

  //const [value, setValue] = useState('')
  const [key, setKey] = useState(0)

  const {onTaskSelected, tasks} = props

  const onChange = (event, value1) => {
    onTaskSelected(value1)
    setKey(key + 1)
  }

  return <div>
    <Autocomplete
      key={key}
      options={tasks}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField
        {...params}
        //ref={input}
        label='Add task'/>}
      onChange={onChange}
      //value={value}
      blurOnSelect
    />
  </div>

}

TaskSelector.propTypes = {
  onTaskSelected: func,
  tasks: array,
}

