import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react'
import {func, string} from 'prop-types'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './task_selector.css';
import debounce from 'lodash/debounce';
import {getSuggestions} from '../../../api/plun_api';

export default function TaskSelector(props) {

  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);

  const {organizationName, projectName, token, onTaskSelect} = props

  console.log(`TaskSelector - ${JSON.stringify(tasks, null, 2)}`)

  const sendQuery = async (org, project, query) => {
    console.log(`sendQuery - ${org}, ${project}, ${query}`)
    if (!query) {
      return
    }
    const tasksFromApi = await getSuggestions(org, project, query, token)
    setTasks(tasksFromApi)
  }

  const delayedQuery = useCallback(debounce(sendQuery, 300), []);

  const onInputChange = (newInput) => {
    delayedQuery(organizationName, projectName, newInput)
    setInput(newInput)
  }

  const handleTaskSelect = (e, task) => {
    if (task && onTaskSelect) {
      onTaskSelect(task)
    }
  }

  return <div className='task-selector-root'>
    <Autocomplete
      options={tasks}
      getOptionLabel={(task) => task.name || task.azureName}
      renderInput={(params) => <TextField
        {...params}
        label='Add task'
      />}
      filterOptions={x => x}
      onInputChange={(event, newInputValue) => {
        onInputChange(newInputValue)
      }}
      onChange={handleTaskSelect}
      blurOnSelect
    />
  </div>

}

TaskSelector.propTypes = {
  organizationName: string,
  projectName: string,
  token: string,
  onTaskSelect: func,
  onInputChange: func,
}

