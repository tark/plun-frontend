export type User = {
  id: string;
  azureProfileId: string;
  email: string;
  name: string;
  organizations?: Array<string>;
};

export type Organization = {
  id: string;
  azureId: string;
  name: string;
  projects?: Array<string>;
};

export type Project = {
  id: string;
  azureId: string;
  name: string;
};

export type Task = {
  id?: string;
  name: string;
  state: Array<DayState>;
  plannedAt: Array<string>;
  azureId?: number;
  azureState?: TaskState;
  azureUrl?: string;
};

export type DayState = {
  date: string,
  state: TaskState,
}

export type TaskState = 'created' | 'done' | 'progress' | 'failed' | 'cancelled'


