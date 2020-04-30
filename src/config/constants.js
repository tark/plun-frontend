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
  opened: 'opened',
}

export const BackgrooundColors = {
  green: '#ffcdd2',
  blue: '#bbdefb',
  red: '#c8e6c9',
}

export const peopleNames = [
  'Mike', 'Jane', 'Paul', 'Alex'
]

export const tasksNames = [
  'Position screen logic',
  'Perpetual details screen logic',
  'Share ROE',
  'Share trade',
  'Create order logic',
  'Security screen',
  'Change password screen',
  'Settings screen',
  'About screen',
  'Assets screen',
  'Implement candlestick chart',
  'Perpetual details screen',
  'Trade screen',
  'Splash screen',
  'Account screen',
  'Home screen',
  'Password recovery screen',
  'Markets screen',
  'Phone & Email settings screen',
  'Positions screen',
  'Implement UI layouts of different screens',
  'Calculator screen',
  'Login screen',
  'Create project base',
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
