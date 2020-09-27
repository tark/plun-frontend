import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react'
import {func, string} from 'prop-types'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import './task_selector.css';
import debounce from 'lodash/debounce';
import {getSuggestions} from '../../../api/plun_api';

// todo understand why filter options returns empty tasks list
const filter = createFilterOptions();

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
      getOptionLabel={(task) => {
        if (task.newTask) {
          return `Add "${task.name}"`;
        }

        return task.name;
      }}
      renderInput={(params) => <TextField
        {...params}
        label='Add task'
      />}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            newTask: true,
            name: params.inputValue,
          });
        }

        return filtered;
      }}
      onInputChange={(event, newInputValue) => {
        onInputChange(newInputValue)
      }}
      onChange={handleTaskSelect}
      blurOnSelect
      freeSolo
      handleHomeEndKeys
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

