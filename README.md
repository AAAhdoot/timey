### Important Note:
Forked from https://github.com/green-echo/timetracker, created by Ariel Ahdoot, Betzalel Perlow, Christina Armstrong, Katrina Rodkina

### Summary:

Timey is a project management board with accountability. It allows users to create projects, add, remove edit and assign tickets to users. Users can track the time it takes to complete a ticket with a timer that is provided on each ticket. All time is accurently tracked and stored into a sortable and searchable timesheet that is downloadable at any time. All updates to the project board are updated in real time for every user on that project through the use of sockets. Users are also provided a bar chart that displays every project they are assigned to with all the time they have allocated to each project. Additionally, we provide a pie chart to show every user that is assigned to a specific project, and how much time they have towards that project in comparison to other users.

### Deployed Site

[Timey](https://timey.herokuapp.com)

### Technologies:

Node/Express, React/Redux, PostgreSQL, Sequelize, Socket.io, D3.js, reactstrap, Moment.js, OAuth, react-beautiful-dnd, Heroku

### Requirements

* PostgreSQL
* Node.js

### Before running the program locally

* Make sure you have databases named "timey" and "timey-test" in order for the code to be able to access the database
* One way to do so:

```
createdb timey

createdb timey-test
```

### Running the program

To run locally:

```
npm install

npm run start-dev
```

![alt text](https://github.com/green-echo/timetracker/blob/master/timey-screenshot.png)
