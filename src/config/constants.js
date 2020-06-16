export const TasksManagers = {
  trello: 'trello',
  jira: 'jira',
  teams: 'teams',
}

export const TimePeriod = {
  day: 'day',
  week: 'week',
  month: 'month',
}

export const TaskStatus = {
  done: 'done',
  failed: 'failed',
  created: 'created',
}

export const ListStatus = {
  planning: 'planning',
  planned: 'planned',
  resultSaved: 'resultSaved',
}

export const BackgroundColors = {
  green: '#ffcdd2',
  blue: '#bbdefb',
  red: '#c8e6c9',
}

export const peopleNames = ['Mike', 'Jane', 'Paul']

export const defaultTasks = [
  {id: 0, name: 'Position screen logic'},
  {id: 1, name: 'Perpetual details screen logic'},
  {id: 2, name: 'Share ROE'},
  {id: 3, name: 'Share trade'},
  {id: 4, name: 'Create order logic'},
  {id: 5, name: 'Security screen'},
  {id: 6, name: 'Change password screen'},
  {id: 7, name: 'Settings screen'},
  {id: 8, name: 'About screen'},
  {id: 9, name: 'Assets screen'},
  {id: 11, name: 'Implement candlestick chart'},
  {id: 12, name: 'Perpetual details screen'},
  {id: 13, name: 'Trade screen'},
  {id: 14, name: 'Splash screen'},
  {id: 15, name: 'Account screen'},
  {id: 16, name: 'Home screen'},
  {id: 17, name: 'Password recovery screen'},
  {id: 18, name: 'Markets screen'},
  {id: 19, name: 'Phone & Email settings screen'},
  {id: 20, name: 'Positions screen'},
  {id: 21, name: 'Implement UI layouts of different screens'},
  {id: 22, name: 'Calculator screen'},
  {id: 23, name: 'Login screen'},
  {id: 24, name: 'Create project base'}
]

export const periods = [
  {
    startTime: 1234134,
    timePeriod: TimePeriod.day,
    tasksLists: [
      {
        name: 'Jane',
        tasks: [
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            created: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            created: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            created: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            created: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            created: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            created: true,
          },
        ],
      },
      {
        name: 'Mike',
        tasks: [
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            opened: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            opened: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            opened: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            opened: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            opened: true,
          },
          {
            taskManager: TasksManagers.trello,
            title: 'Order confirmation screen - check cost @ leverage logic',
            opened: true,
          },
        ],
      }
    ]
  }
]
