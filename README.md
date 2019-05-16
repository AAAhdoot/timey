### Summary:

A project management board with accountability. Allows users to create projects, add, remove, or edit tickets and track each ticket with a timer. All updates to the board are immediately applied to other users of that board. Users are also provided timesheets and graphs correlating to each project/ticket to indicate productivity.

###Technologies:

Node/Express, React/Redux, PostgreSQL, Sequelize, Socket.io, D3.js, reactstrap, Moment.js, OAuth

### Requirements

* PostgreSQL
* Node.js

### Before running the program locally

* Make sure you have databases named "timetracker" and "timetracker-test" in order for the code to be able to access the database
* One way to do so:

```
createdb timetracker

createdb timetracker-test
```

### Running the program

To run locally:

```
npm install

npm run start-dev
```

![alt text](https://github.com/green-echo/timetracker/blob/master/timey-screenshot.png)
