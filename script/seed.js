/* eslint-disable max-statements */
'use strict';

const db = require('../server/db');
const { User, Project, Ticket, UserTicket } = require('../server/db/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create({ email: 'cody@email.com', password: '123' }),
    User.create({ email: 'murphy@email.com', password: '123' }),
    User.create({ email: 'test@email.com', password: '123' }),
    User.create({ email: 'betzalel@email.com', password: '123' }),
    User.create({ email: 'ariel@email.com', password: '123' }),
    User.create({ email: 'christina@email.com', password: '123' }),
    User.create({ email: 'katrina@email.com', password: '123' })
  ]);

  const netflixTickets = await Promise.all([
    Ticket.create({
      title: 'API',
      description: 'create routes',
      points: 3,
      order: 0,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'REACT component',
      description: 'create component',
      points: 5,
      order: 0,
      status: 'in_progress'
    }),
    Ticket.create({
      title: 'seed file',
      description: 'create seed file',
      points: 3,
      order: 0,
      status: 'in_review'
    }),
    Ticket.create({
      title: 'bootstrap',
      description: 'install bootstrap',
      points: 3,
      order: 0,
      status: 'done'
    }),
    Ticket.create({
      title: 'Logo',
      description: 'create logo',
      points: 3,
      order: 1,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'edit project title',
      description: 'ability to edit a project title',
      points: 5,
      order: 1,
      status: 'in_progress'
    }),
    Ticket.create({
      title: 'edit project total time',
      description: 'ability to edit the total time of a project ',
      points: 3,
      order: 1,
      status: 'in_review'
    }),
    Ticket.create({
      title: 'front end route error handling',
      description: 'send to 404 component if not found',
      points: 3,
      order: 1,
      status: 'done'
    }),
    Ticket.create({
      title: '404 component',
      description:
        'create 404 component to render when user goes to unidentified URLs ',
      points: 3,
      order: 2,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'More seed file data',
      description: 'add more data to seed file',
      points: 5,
      order: 2,
      status: 'in_progress'
    }),
    Ticket.create({
      title: 'timer isolation',
      description: 'ensure that user can only start one timer at a time',
      points: 3,
      order: 2,
      status: 'in_review'
    }),
    Ticket.create({
      title: 'start timer hidden',
      description: 'hide start timer from unassigned user',
      points: 3,
      order: 2,
      status: 'done'
    })
  ]);

  const hersheyFrontEndTickets = await Promise.all([
    Ticket.create({
      title: 'API',
      description: 'create routes',
      points: 3,
      order: 0,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'REACT component',
      description: 'create component',
      points: 5,
      order: 0,
      status: 'in_progress'
    }),
    Ticket.create({
      title: 'seed file',
      description: 'create seed file',
      points: 3,
      order: 0,
      status: 'in_review'
    }),
    Ticket.create({
      title: 'bootstrap',
      description: 'install bootstrap',
      points: 3,
      order: 0,
      status: 'done'
    }),
    Ticket.create({
      title: 'timer when running fixes',
      description: 'if timer is running, do not allow ticket to be re-assigned',
      points: 3,
      order: 1,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'stop/start button',
      description: 'add stop/start button for each ticket',
      points: 5,
      order: 1,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'update userticket',
      description:
        'when a user hits the pause button the previously created userticket is updated with the exact timestamp as the end time',
      points: 3,
      order: 1,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'create userticket',
      description:
        'when a user hits the start button a userticket is created with the exact timestamp as the start time',
      points: 3,
      order: 1,

      status: 'done'
    }),
    Ticket.create({
      title: '404 component',
      description:
        'create 404 component to render when user goes to unidentified URLs ',
      points: 3,
      order: 2,

      status: 'to_do'
    }),
    Ticket.create({
      title: 'More seed file data',
      description: 'add more data to seed file',
      points: 5,
      order: 2,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'timer isolation',
      description: 'ensure that user can only start one timer at a time',
      points: 3,
      order: 2,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'nav bar',
      description: 'style navbar',
      points: 3,
      order: 2,
      status: 'done'
    })
  ]);

  const hersheyBackEndTickets = await Promise.all([
    Ticket.create({
      title: 'mobile styles',
      description: 'project board component styling',
      points: 3,
      order: 0,

      status: 'to_do'
    }),
    Ticket.create({
      title: 'drag and drop different columns',
      description: 'implement drag and drop tickets between columns',
      points: 5,
      order: 0,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'drag and drop same columns',
      description: 'implement drag and drop between the same column',
      points: 3,
      order: 0,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'drag and drop persistence',
      description: 'drag and drop must persist upon refresh',
      points: 3,
      order: 0,

      status: 'done'
    }),
    Ticket.create({
      title: 'column stylings',
      description: 'tickets must fit inside the columns',
      points: 3,
      order: 1,

      status: 'to_do'
    }),
    Ticket.create({
      title: 'style ticket component',
      description: 'add mobile styles to ticket component',
      points: 5,
      order: 1,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'edit an existing ticket',
      description:
        'add ability to edit an existing ticket (description, points, etc.)',
      points: 3,
      order: 1,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'drag and drop height issue',
      description: 'maximize height for droppable container',
      points: 3,
      order: 1,

      status: 'done'
    }),
    Ticket.create({
      title: 'redirect after user added',
      description: 'redirect back to project board after a user is added',
      points: 3,
      order: 2,

      status: 'to_do'
    }),
    Ticket.create({
      title: 'add user to project',
      description: 'create thunk for adding a user to a project',
      points: 5,
      order: 2,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'drag and drop data',
      description: 'integrate database data with  drag and drop',
      points: 3,
      order: 2,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'user validation',
      description:
        'make sure the user making changes is assigned to the project they are accessing/editing',
      points: 3,
      order: 2,

      status: 'done'
    })
  ]);

  const spotifyTickets = await Promise.all([
    Ticket.create({
      title: 'API',
      description: 'create routes',
      points: 3,
      order: 0,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'REACT component',
      description: 'create component',
      points: 5,
      order: 0,
      status: 'in_progress'
    }),
    Ticket.create({
      title: 'seed file',
      description: 'create seed file',
      points: 3,
      order: 0,
      status: 'in_review'
    }),
    Ticket.create({
      title: 'bootstrap',
      description: 'install bootstrap',
      points: 3,
      order: 0,
      status: 'done'
    }),
    Ticket.create({
      title: 'timer when running fixes',
      description: 'if timer is running, do not allow ticket to be re-assigned',
      points: 3,
      order: 1,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'stop/start button',
      description: 'add stop/start button for each ticket',
      points: 5,
      order: 1,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'update userticket',
      description:
        'when a user hits the pause button the previously created userticket is updated with the exact timestamp as the end time',
      points: 3,
      order: 1,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'create userticket',
      description:
        'when a user hits the start button a userticket is created with the exact timestamp as the start time',
      points: 3,
      order: 1,

      status: 'done'
    }),
    Ticket.create({
      title: 'redirect after user added',
      description: 'redirect back to project board after a user is added',
      points: 3,
      order: 2,

      status: 'to_do'
    }),
    Ticket.create({
      title: 'add user to project',
      description: 'create thunk for adding a user to a project',
      points: 5,
      order: 2,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'drag and drop data',
      description: 'integrate database data with  drag and drop',
      points: 3,
      order: 2,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'user validation',
      description:
        'make sure the user making changes is assigned to the project they are accessing/editing',
      points: 3,
      order: 2,

      status: 'done'
    })
  ]);

  const huluTickets = await Promise.all([
    Ticket.create({
      title: 'API',
      description: 'create routes',
      points: 3,
      order: 0,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'REACT component',
      description: 'create component',
      points: 5,
      order: 0,
      status: 'in_progress'
    }),
    Ticket.create({
      title: 'seed file',
      description: 'create seed file',
      points: 3,
      order: 0,
      status: 'in_review'
    }),
    Ticket.create({
      title: 'bootstrap',
      description: 'install bootstrap',
      points: 3,
      order: 0,
      status: 'done'
    }),
    Ticket.create({
      title: 'timer when running fixes',
      description: 'if timer is running, do not allow ticket to be re-assigned',
      points: 3,
      order: 1,
      status: 'to_do'
    }),
    Ticket.create({
      title: 'stop/start button',
      description: 'add stop/start button for each ticket',
      points: 5,
      order: 1,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'update userticket',
      description:
        'when a user hits the pause button the previously created userticket is updated with the exact timestamp as the end time',
      points: 3,
      order: 1,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'create userticket',
      description:
        'when a user hits the start button a userticket is created with the exact timestamp as the start time',
      points: 3,
      order: 1,

      status: 'done'
    }),
    Ticket.create({
      title: '404 component',
      description:
        'create 404 component to render when user goes to unidentified URLs ',
      points: 3,
      order: 2,

      status: 'to_do'
    }),
    Ticket.create({
      title: 'More seed file data',
      description: 'add more data to seed file',
      points: 5,
      order: 2,

      status: 'in_progress'
    }),
    Ticket.create({
      title: 'timer isolation',
      description: 'ensure that user can only start one timer at a time',
      points: 3,
      order: 2,

      status: 'in_review'
    }),
    Ticket.create({
      title: 'nav bar',
      description: 'style navbar',
      points: 3,
      order: 2,
      status: 'done'
    })
  ]);

  const projects = await Promise.all([
    Project.create({
      name: 'Netflix',
      totalTime: 20
    }),
    Project.create({
      name: 'Hersheys Frontend',
      totalTime: 30
    }),
    Project.create({
      name: 'Hersheys Backend',
      totalTime: 60
    }),
    Project.create({
      name: 'Spotify',
      totalTime: 30
    }),
    Project.create({
      name: 'Hulu',
      totalTime: 60
    })
  ]);

  projects[0].setUsers([users[0], users[1], users[2]]);
  projects[1].setUsers([users[3], users[1], users[4]]);
  projects[2].setUsers([users[1], users[4]]);
  projects[3].setUsers([users[0], users[2], users[4]]);
  projects[4].setUsers([users[3]], users[2]);

  for (let i = 0; i < netflixTickets.length; i++) {
    await netflixTickets[i].setProject(projects[0]);
  }

  for (let i = 0; i < hersheyFrontEndTickets.length; i++) {
    await hersheyFrontEndTickets[i].setProject(projects[1]);
  }

  for (let i = 0; i < hersheyBackEndTickets.length; i++) {
    await hersheyBackEndTickets[i].setProject(projects[2]);
  }

  for (let i = 0; i < spotifyTickets.length; i++) {
    await spotifyTickets[i].setProject(projects[3]);
  }

  for (let i = 0; i < huluTickets.length; i++) {
    await huluTickets[i].setProject(projects[4]);
  }

  const allTickets = netflixTickets
    .concat(hersheyFrontEndTickets)
    .concat(hersheyBackEndTickets)
    .concat(spotifyTickets)
    .concat(huluTickets);

  // console.log(randomDate(new Date(2012, 0, 1), new Date()));
  const uTix = [];

  for (let i = 0; i < allTickets.length; i++) {
    for (let j = 0; j < users.length; j++) {
      let start = randomDate(new Date(2019, 0, 1), new Date());
      let end = randomDate(new Date(start), new Date());
      let userTicket = await UserTicket.create({
        start: new Date(start),
        end: new Date(end)
      });
      await userTicket.setTicket(allTickets[i]);
      await userTicket.setUser(users[j]);
    }
  }

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

function randomDate(start, end) {
  const random = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return random;
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
