import React, {useState, useCallback, ChangeEvent} from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import './task_selector.css';
import debounce from 'lodash/debounce';
import {getSuggestions} from '../../../api/plun_api';
import {Task} from '../../../api/models/models';

// todo understand why filter options returns empty tasks list
const filter = createFilterOptions<TaskWrapper>();

interface TaskSelectorProps {
  organizationName: string;
  projectName: string;
  token: string;
  onTaskSelect: Function;
  onInputChange?: Function;
}

type TaskWrapper = {
  task: Task;
  new: boolean;
}

export default function TaskSelector(props: TaskSelectorProps) {

  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Array<TaskWrapper>>([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const {organizationName, projectName, token, onTaskSelect} = props

  //console.log(`TaskSelector - ${JSON.stringify(tasks, null, 2)}`)

  const sendQuery = async (org: string, project: string, query: string) => {
    console.log(`sendQuery - ${org}, ${project}, ${query}`)
    if (!query) {
      return
    }
    const tasksFromApi = await getSuggestions(org, project, query, token)
    setTasks(tasksFromApi)
  }

  const delayedQuery = useCallback(debounce(sendQuery, 300), []);

  const onInputChange = (newInput: any) => {
    console.log(`onInputChange - ${newInput}`)
    delayedQuery(organizationName, projectName, newInput)
    setInput(newInput)
  }

  const handleTaskSelect = (e: ChangeEvent<{}>, taskWrapper: TaskWrapper | null) => {
    console.log('handleTaskSelect')
    if (taskWrapper?.task && onTaskSelect) {
      onTaskSelect(taskWrapper.task)
      console.log('handleTaskSelect - set empty input')
      setInput('')
    }
  }

  return <div className='task-selector-root'>
    <Autocomplete
      value={null}
      inputValue={input}
      options={tasks}
      getOptionLabel={(taskWrapper: TaskWrapper) => {
        if (taskWrapper.new) {
          return `Add "${taskWrapper.task.name}"`;
        }

        return taskWrapper.task.name;
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
            new: true,
            task: {
              name: params.inputValue,
            },
          });
        }

        return filtered;
      }}
      onInputChange={(event, newInputValue) => onInputChange(newInputValue)}
      onChange={handleTaskSelect}
      blurOnSelect
      handleHomeEndKeys
      clearOnBlur
    />
  </div>

}
