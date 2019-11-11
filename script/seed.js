/* eslint-disable complexity */
/* eslint-disable max-statements */
'use strict';

const {
  netflixObjects,
  hersheyFrontEndObjects,
  hersheyBackEndObjects,
  spotifyObjects,
  huluObjects,
  projectObjects
} = require('./seedData');

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

  let projects = [];

  for (let i = 0; i < projectObjects.length; i++) {
    let project = await Project.create(projectObjects[i]);
    await project.setUsers(users);
    projects.push(project);
  }

  const convertObjectsToInstances = async (objects, project) => {
    let tickets = [];
    for (let i = 0; i < objects.length; i++) {
      const ticket = await Ticket.create(objects[i]);
      await ticket.setProject(project);
      tickets.push(ticket);
      if (tickets[i - 4]) {
        await tickets[i - 4].update({ next: ticket.id });
      }
    }
    return tickets;
  };

  const netflixTickets = await convertObjectsToInstances(
    netflixObjects,
    projects[0]
  );
  const hersheyFrontEndTickets = await convertObjectsToInstances(
    hersheyFrontEndObjects,
    projects[1]
  );
  const hersheyBackEndTickets = await convertObjectsToInstances(
    hersheyBackEndObjects,
    projects[2]
  );
  const spotifyTickets = await convertObjectsToInstances(
    spotifyObjects,
    projects[3]
  );
  const huluTickets = await convertObjectsToInstances(huluObjects, projects[4]);

  const netflixColumns = await projects[0].getColumns();
  const hersheyFrontEndColumns = await projects[1].getColumns();
  const hersheyBackEndColumns = await projects[2].getColumns();
  const spotifyColumns = await projects[3].getColumns();
  const huluColumns = await projects[4].getColumns();

  const addRootsToColumns = async (columns, tickets) => {
    for (let i = 0; i < columns.length; i++) {
      await columns[i].update({ ticketRoot: tickets[i].id });
    }
  };

  await addRootsToColumns(netflixColumns, netflixTickets);
  await addRootsToColumns(hersheyFrontEndColumns, hersheyFrontEndTickets);
  await addRootsToColumns(hersheyBackEndColumns, hersheyBackEndTickets);
  await addRootsToColumns(spotifyColumns, spotifyTickets);
  await addRootsToColumns(huluColumns, huluTickets);

  const allTickets = netflixTickets
    .concat(hersheyFrontEndTickets)
    .concat(hersheyBackEndTickets)
    .concat(spotifyTickets)
    .concat(huluTickets);

  // console.log(randomDate(new Date(2012, 0, 1), new Date()));

  for (let i = 0; i < allTickets.length; i++) {
    for (let j = 0; j < users.length; j++) {
      let start = randomDate(new Date(2019, 0, 1), new Date());

      let end = randomDate(
        new Date(start),
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
      );
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
