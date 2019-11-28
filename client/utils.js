export function handleDragProps(source, destination, draggableId, props) {
  const start = props.llColumns[source.droppableId];
  const finish = props.llColumns[destination.droppableId];

  if (start === finish) {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      id: source.droppableId,
      name: start.name,
      taskIds: newTaskIds
    };
    const newState = {
      ...props,
      columns: {
        ...props.llColumns,
        [newColumn.id]: newColumn
      }
    };

    return newState;
  }

  const startTaskIds = Array.from(start.taskIds);

  startTaskIds.splice(source.index, 1);
  const newStart = {
    id: source.droppableId,
    name: start.name,
    taskIds: startTaskIds
  };

  const finishTaskIds = Array.from(finish.taskIds);
  finishTaskIds.splice(destination.index, 0, draggableId);
  const newFinish = {
    id: destination.droppableId,
    name: finish.name,
    taskIds: finishTaskIds
  };

  const newState = {
    ...props,
    columns: {
      ...props.llColumns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish
    }
  };

  return newState;
}

export function createTicketsObject(tickets) {
  const obj = {};
  tickets.forEach(ticket => {
    obj[ticket.id.toString()] = ticket;
  });
  return obj;
}

export function generateNewColumnsLL(payload) {
  let columns = {};
  console.log('HEREEEEEE');
  for (let key in payload) {
    console.log('PAYLOAD:', payload[key]);
    columns[key] = {
      id: key,
      name: payload[key].name,
      taskIds: payload[key].linkedList.map(x => x.id),
      projectId: payload[key].projectId
    };
  }
  return columns;
}

export function d3DataObject(array) {
  return array.map(object => {
    console.log('entire object', object);
    return {
      project: object['project.name'],
      points: Number(object.points),
      id: object.id
    };
  });
}

export const millisConverted = milli => {
  const seconds = Number(milli / 1000);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

export function d3PieChartData(array) {
  return array.map(object => {
    return {
      points: Number(object.points),
      user: object['user.email'],
      id: object.id
    };
  });
}
