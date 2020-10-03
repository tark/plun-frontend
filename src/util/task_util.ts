import {TaskState} from '../api/models/models';

export const iconByTaskState = (state : TaskState) : string => {
  switch (state) {
    case 'created':
    default:
      return '🔘';
    case 'done':
      return '✅';
    case 'progress':
      return '🚧';
    case 'failed':
      return '❌';
    case 'cancelled':
      return '🗑️';
  }
}
