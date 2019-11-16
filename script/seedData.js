const netflixObjects = [
  {
    title: 'API',
    description: 'create routes',
    points: 3,
    order: 0,
    status: 'to_do',
    columnId: 1
  },
  {
    title: 'REACT component',
    description: 'create component',
    points: 5,
    order: 0,
    status: 'in_progress',
    columnId: 2
  },
  {
    title: 'seed file',
    description: 'create seed file',
    points: 3,
    order: 0,
    status: 'in_review',
    columnId: 3
  },
  {
    title: 'bootstrap',
    description: 'install bootstrap',
    points: 3,
    order: 0,
    status: 'done',
    columnId: 4
  },
  {
    title: 'Logo',
    description: 'create logo',
    points: 3,
    order: 1,
    status: 'to_do',
    columnId: 1
  },
  {
    title: 'edit project title',
    description: 'ability to edit a project title',
    points: 5,
    order: 1,
    status: 'in_progress',
    columnId: 2
  },
  {
    title: 'edit project total time',
    description: 'ability to edit the total time of a project ',
    points: 3,
    order: 1,
    status: 'in_review',
    columnId: 3
  },
  {
    title: 'front end route error handling',
    description: 'send to 404 component if not found',
    points: 3,
    order: 1,
    status: 'done',
    columnId: 4
  },
  {
    title: '404 component',
    description:
      'create 404 component to render when user goes to unidentified URLs ',
    points: 3,
    order: 2,
    status: 'to_do',
    columnId: 1
  },
  {
    title: 'More seed file data',
    description: 'add more data to seed file',
    points: 5,
    order: 2,
    status: 'in_progress',
    columnId: 2
  },
  {
    title: 'timer isolation',
    description: 'ensure that user can only start one timer at a time',
    points: 3,
    order: 2,
    status: 'in_review',
    columnId: 3
  },
  {
    title: 'start timer hidden',
    description: 'hide start timer from unassigned user',
    points: 3,
    order: 2,
    status: 'done',
    columnId: 4
  }
];

const hersheyFrontEndObjects = [
  {
    title: 'API',
    description: 'create routes',
    points: 3,
    order: 0,
    status: 'to_do',
    columnId: 5
  },
  {
    title: 'REACT component',
    description: 'create component',
    points: 5,
    order: 0,
    status: 'in_progress',
    columnId: 6
  },
  {
    title: 'seed file',
    description: 'create seed file',
    points: 3,
    order: 0,
    status: 'in_review',
    columnId: 7
  },
  {
    title: 'bootstrap',
    description: 'install bootstrap',
    points: 3,
    order: 0,
    status: 'done',
    columnId: 8
  },
  {
    title: 'timer when running fixes',
    description: 'if timer is running, do not allow ticket to be re-assigned',
    points: 3,
    order: 1,
    status: 'to_do',
    columnId: 5
  },
  {
    title: 'stop/start button',
    description: 'add stop/start button for each ticket',
    points: 5,
    order: 1,

    status: 'in_progress',
    columnId: 6
  },
  {
    title: 'update userticket',
    description:
      'when a user hits the pause button the previously created userticket is updated with the exact timestamp as the end time',
    points: 3,
    order: 1,

    status: 'in_review',
    columnId: 7
  },
  {
    title: 'create userticket',
    description:
      'when a user hits the start button a userticket is created with the exact timestamp as the start time',
    points: 3,
    order: 1,

    status: 'done',
    columnId: 8
  },
  {
    title: '404 component',
    description:
      'create 404 component to render when user goes to unidentified URLs ',
    points: 3,
    order: 2,

    status: 'to_do',
    columnId: 5
  },
  {
    title: 'More seed file data',
    description: 'add more data to seed file',
    points: 5,
    order: 2,

    status: 'in_progress',
    columnId: 6
  },
  {
    title: 'timer isolation',
    description: 'ensure that user can only start one timer at a time',
    points: 3,
    order: 2,

    status: 'in_review',
    columnId: 7
  },
  {
    title: 'nav bar',
    description: 'style navbar',
    points: 3,
    order: 2,
    status: 'done',
    columnId: 8
  }
];

const hersheyBackEndObjects = [
  {
    title: 'mobile styles',
    description: 'project board component styling',
    points: 3,
    order: 0,

    status: 'to_do',
    columnId: 9
  },
  {
    title: 'drag and drop different columns',
    description: 'implement drag and drop tickets between columns',
    points: 5,
    order: 0,

    status: 'in_progress',
    columnId: 10
  },
  {
    title: 'drag and drop same columns',
    description: 'implement drag and drop between the same column',
    points: 3,
    order: 0,

    status: 'in_review',
    columnId: 11
  },
  {
    title: 'drag and drop persistence',
    description: 'drag and drop must persist upon refresh',
    points: 3,
    order: 0,

    status: 'done',
    columnId: 12
  },
  {
    title: 'column stylings',
    description: 'tickets must fit inside the columns',
    points: 3,
    order: 1,

    status: 'to_do',
    columnId: 9
  },
  {
    title: 'style ticket component',
    description: 'add mobile styles to ticket component',
    points: 5,
    order: 1,

    status: 'in_progress',
    columnId: 10
  },
  {
    title: 'edit an existing ticket',
    description:
      'add ability to edit an existing ticket (description, points, etc.',
    points: 3,
    order: 1,

    status: 'in_review',
    columnId: 11
  },
  {
    title: 'drag and drop height issue',
    description: 'maximize height for droppable container',
    points: 3,
    order: 1,

    status: 'done',
    columnId: 12
  },
  {
    title: 'redirect after user added',
    description: 'redirect back to project board after a user is added',
    points: 3,
    order: 2,

    status: 'to_do',
    columnId: 9
  },
  {
    title: 'add user to project',
    description: 'create thunk for adding a user to a project',
    points: 5,
    order: 2,

    status: 'in_progress',
    columnId: 10
  },
  {
    title: 'drag and drop data',
    description: 'integrate database data with  drag and drop',
    points: 3,
    order: 2,

    status: 'in_review',
    columnId: 11
  },
  {
    title: 'user validation',
    description:
      'make sure the user making changes is assigned to the project they are accessing/editing',
    points: 3,
    order: 2,

    status: 'done',
    columnId: 12
  }
];

const spotifyObjects = [
  {
    title: 'API',
    description: 'create routes',
    points: 3,
    order: 0,
    status: 'to_do',
    columnId: 13
  },
  {
    title: 'REACT component',
    description: 'create component',
    points: 5,
    order: 0,
    status: 'in_progress',
    columnId: 14
  },
  {
    title: 'seed file',
    description: 'create seed file',
    points: 3,
    order: 0,
    status: 'in_review',
    columnId: 15
  },
  {
    title: 'bootstrap',
    description: 'install bootstrap',
    points: 3,
    order: 0,
    status: 'done',
    columnId: 16
  },
  {
    title: 'timer when running fixes',
    description: 'if timer is running, do not allow ticket to be re-assigned',
    points: 3,
    order: 1,
    status: 'to_do',
    columnId: 13
  },
  {
    title: 'stop/start button',
    description: 'add stop/start button for each ticket',
    points: 5,
    order: 1,

    status: 'in_progress',
    columnId: 14
  },
  {
    title: 'update userticket',
    description:
      'when a user hits the pause button the previously created userticket is updated with the exact timestamp as the end time',
    points: 3,
    order: 1,

    status: 'in_review',
    columnId: 15
  },
  {
    title: 'create userticket',
    description:
      'when a user hits the start button a userticket is created with the exact timestamp as the start time',
    points: 3,
    order: 1,

    status: 'done',
    columnId: 16
  },
  {
    title: 'redirect after user added',
    description: 'redirect back to project board after a user is added',
    points: 3,
    order: 2,

    status: 'to_do',
    columnId: 13
  },
  {
    title: 'add user to project',
    description: 'create thunk for adding a user to a project',
    points: 5,
    order: 2,

    status: 'in_progress',
    columnId: 14
  },
  {
    title: 'drag and drop data',
    description: 'integrate database data with  drag and drop',
    points: 3,
    order: 2,

    status: 'in_review',
    columnId: 15
  },
  {
    title: 'user validation',
    description:
      'make sure the user making changes is assigned to the project they are accessing/editing',
    points: 3,
    order: 2,

    status: 'done',
    columnId: 16
  }
];

const huluObjects = [
  {
    title: 'API',
    description: 'create routes',
    points: 3,
    order: 0,
    status: 'to_do',
    columnId: 17
  },
  {
    title: 'REACT component',
    description: 'create component',
    points: 5,
    order: 0,
    status: 'in_progress',
    columnId: 18
  },
  {
    title: 'seed file',
    description: 'create seed file',
    points: 3,
    order: 0,
    status: 'in_review',
    columnId: 19
  },
  {
    title: 'bootstrap',
    description: 'install bootstrap',
    points: 3,
    order: 0,
    status: 'done',
    columnId: 20
  },
  {
    title: 'timer when running fixes',
    description: 'if timer is running, do not allow ticket to be re-assigned',
    points: 3,
    order: 1,
    status: 'to_do',
    columnId: 17
  },
  {
    title: 'stop/start button',
    description: 'add stop/start button for each ticket',
    points: 5,
    order: 1,

    status: 'in_progress',
    columnId: 18
  },
  {
    title: 'update userticket',
    description:
      'when a user hits the pause button the previously created userticket is updated with the exact timestamp as the end time',
    points: 3,
    order: 1,

    status: 'in_review',
    columnId: 19
  },
  {
    title: 'create userticket',
    description:
      'when a user hits the start button a userticket is created with the exact timestamp as the start time',
    points: 3,
    order: 1,

    status: 'done',
    columnId: 20
  },
  {
    title: '404 component',
    description:
      'create 404 component to render when user goes to unidentified URLs ',
    points: 3,
    order: 2,

    status: 'to_do',
    columnId: 17
  },
  {
    title: 'More seed file data',
    description: 'add more data to seed file',
    points: 5,
    order: 2,

    status: 'in_progress',
    columnId: 18
  },
  {
    title: 'timer isolation',
    description: 'ensure that user can only start one timer at a time',
    points: 3,
    order: 2,

    status: 'in_review',
    columnId: 19
  },
  {
    title: 'nav bar',
    description: 'style navbar',
    points: 3,
    order: 2,
    status: 'done',
    columnId: 20
  }
];

const projectObjects = [
  {
    name: 'Netflix',
    totalTime: 20
  },
  {
    name: 'Hersheys Frontend',
    totalTime: 30
  },
  {
    name: 'Hersheys Backend',
    totalTime: 60
  },
  {
    name: 'Spotify',
    totalTime: 30
  },
  {
    name: 'Hulu',
    totalTime: 60
  }
];

module.exports = {
  netflixObjects,
  hersheyFrontEndObjects,
  hersheyBackEndObjects,
  spotifyObjects,
  huluObjects,
  projectObjects
};
