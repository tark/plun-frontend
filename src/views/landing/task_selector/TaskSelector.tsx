import React, {useState, useCallback, ChangeEvent} from 'react'
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import './task_selector.css';
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {Task} from '../../../api/models/models';
import {tasksSelectors} from '../../../store/slices/tasks_slice';
import {fetchSuggestions} from '../../../services/tasks_service';
import {profileSelectors} from '../../../store/slices/profile_slice';

// todo understand why filter options returns empty tasks list
const filter = createFilterOptions<TaskWrapper>();

interface TaskSelectorProps {
  onTaskSelect: Function;
}

type TaskWrapper = {
  task: Task;
  new: boolean;
}

export default function TaskSelector(props: TaskSelectorProps) {

  const dispatch = useDispatch()

  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)
  const suggestions = useSelector(tasksSelectors.suggestions)
  const suggestionsLoading = useSelector(tasksSelectors.suggestionsLoading)
  const suggestionsError = useSelector(tasksSelectors.suggestionsError)
  const [input, setInput] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const {onTaskSelect} = props

  const sendQuery = async (org: string, project: string, query: string) => {
    console.log(`sendQuery - ${org}, ${project}, ${query}`)
    if (!query || !selectedOrganization || !selectedProject) {
      return
    }
    dispatch(fetchSuggestions({
      organizationName: selectedOrganization.name,
      projectName: selectedProject.name,
      query
    }))
  }

  const delayedQuery = useCallback(debounce(sendQuery, 300), []);

  const onInputChange = (newInput: any) => {
    console.log(`onInputChange - ${newInput}`)
    if (selectedOrganization && selectedProject) {
      delayedQuery(selectedOrganization.name, selectedProject.name, newInput)
    }
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

  const taskWrappers = () : Array<TaskWrapper> => {
    return suggestions?.map((t) => (
      {
        task: t,
        new: false,
      }
    )) ?? []
  }


  return <div className='task-selector-root'>
    <Autocomplete
      value={null}
      inputValue={input}
      options={taskWrappers()}
      getOptionLabel={(taskWrapper: TaskWrapper) => {
        if (taskWrapper.new) {
          return `Add "${taskWrapper.task.name}"`;
        }

        return taskWrapper.task?.name ?? '';
      }}

      renderInput={(params) => (
        <div ref={params.InputProps.ref} className='input-wrapper'>
          <input
            {...params.inputProps}
            type="text"
            placeholder='+Add Task'
          />
        </div>
      )}
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
