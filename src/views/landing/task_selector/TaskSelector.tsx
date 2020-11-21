import React, {useState, useCallback, ChangeEvent, useReducer, useEffect} from 'react'
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import './task_selector.css';
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme, MuiThemeProvider
} from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme: Theme) => createStyles(
  {
    popper: {
      marginTop: 10,
    },
    paper: {
      elevation: 4,
    },
  }),
);

const paperTheme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        elevation: 4,
      },
    },
  }
});

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
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const classes = useStyles();

  useEffect(() => {
    // force re-render once we have a suggestions to show new suggestions in a dropdown
    forceUpdate();
  }, [suggestions])

  const sendQuery = async (org: string, project: string, query: string) => {
    if (!query || !org || !project) {
      return
    }
    dispatch(fetchSuggestions({
      organizationName: org,
      projectName: project,
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

  const taskWrappers = (): Array<TaskWrapper> => {
    return suggestions?.map((t) => (
      {
        task: t,
        new: false,
      }
    )) ?? []
  }

  return <div className='task-selector-root'>
    <MuiThemeProvider theme={paperTheme}>
      <Autocomplete
        classes={{
          popper: classes.popper,
          paper: classes.paper,
        }}
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
                azureProjectName: '',
                azureOrganizationName: '',
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
    </MuiThemeProvider>
  </div>

}
