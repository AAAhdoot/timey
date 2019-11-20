import React from 'react';
import classnames from 'classnames';

import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Ticket from './Ticket';
import { Link } from 'react-router-dom';
import DroppableContainer from './DroppableContainer';
import CreateTicket from './CreateTicket';
import { connect } from 'react-redux';

const Column = ({ columns, tickets, id, activetab, allUsers, toggleTab }) => {
  const div = {
    minHeight: '50px'
  };

  return (
    <Col
      className={classnames({
        active: activetab === id
      })}
      onClick={() => {
        toggleTab(id);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0
      }}
    >
      <span
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {columns[id].name}
      </span>
      <Droppable droppableId={id} style={div}>
        {provided => (
          <Col className={activetab === columns[id].name ? 'show' : 'hide'}>
            <DroppableContainer
              provided={provided}
              innerRef={provided.innerRef}
            >
              {columns[id].taskIds.map((ticketId, index) => {
                const ticket = tickets[ticketId];
                return (
                  <Draggable
                    draggableId={ticket.id}
                    index={index}
                    key={ticket.id}
                  >
                    {provided => (
                      <Ticket
                        provided={provided}
                        innerRef={provided.innerRef}
                        ticket={ticket}
                        allUsers={allUsers}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              <div style={div} />
            </DroppableContainer>
          </Col>
        )}
      </Droppable>
    </Col>
  );
};

export default Column;
