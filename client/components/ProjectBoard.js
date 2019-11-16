/* eslint-disable complexity */
//
import React from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import socket from '../socket';

import {
  getProjectThunk,
  getProjectsThunk,
  getUsersThunk,
  addUserThunk,
  updateColumnsThunk
} from '../actions/project';
import { generateNewState, handleDragProps } from '../utils';
import { getTicketsThunk, reorderTickets } from '../actions/ticket';
import Column from './Column';

const div = {
  minHeight: '50px'
};

class ProjectBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      dropdownOpen: false,
      btnDropright: false,
      activeTab: 'To Do'
    };
    this.toggle = this.toggle.bind(this);
    this.userToggle = this.userToggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    const projectId = this.props.match.params.id;
    this.props.getProject(projectId);
    this.props.loadProjects();
    this.props.loadUsers();
    this.props.loadTickets(projectId);
    socket.emit('join', projectId);
    socket.on('new user', () => {
      this.props.loadUsers();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      socket.emit('leave', prevProps.match.params.id);
      socket.emit('join', this.props.match.params.id);
      this.props.getProject();
      this.props.loadTickets();
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  userToggle() {
    this.setState({
      userDropdownOpen: !this.state.userDropdownOpen
    });
  }
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!result.destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    this.props.reorder(
      result,
      this.props.allTicketsObject[
        this.props.llColumns[destination.droppableId].taskIds[destination.index]
      ]
    ); //backend

    const newProps = handleDragProps(
      source,
      destination,
      draggableId,
      this.props
    );

    this.props.reorderProps(newProps.columns); //frontend

    socket.emit('reorder', this.props.match.params.id, newProps.columns);
  };
  render() {
    if (
      !this.props.llColumns[Object.keys(this.props.llColumns)[0]] ||
      !this.props.allTickets
    ) {
      return '';
    }

    return (
      <div>
        <Container className="project-board">
          <Row>
            <Col sm={12} xs={12} md={6}>
              <ButtonDropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
              >
                <DropdownToggle caret size="sm" color="info" className="abcd">
                  {this.props.project.name}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Projects</DropdownItem>
                  <DropdownItem divider />
                  {this.props.projects.map(project => {
                    return (
                      <Link key={project.id} to={`/projects/${project.id}`}>
                        <DropdownItem>{project.name}</DropdownItem>
                      </Link>
                    );
                  })}
                </DropdownMenu>
              </ButtonDropdown>
              <Link to={`/projects/${this.props.project.id}/ticketdata`}>
                <Button color="info" size="sm" className="abcd">
                  Users On Project
                </Button>
              </Link>
              <Link to={`/timesheet`}>
                <Button color="info" size="sm" className="abcd">
                  Timesheets
                </Button>
              </Link>
            </Col>

            <Col xs={12} sm={12} md={6} className="right-nav">
              <Link to={`/projects/${this.props.project.id}/newticket`}>
                <Button outline color="info" size="sm" className="abcde">
                  New Ticket
                </Button>
              </Link>
              <Link to={`/projects/${this.props.project.id}/adduser`}>
                <Button outline color="info" size="sm" className="abcde">
                  Add User
                </Button>
              </Link>
            </Col>
          </Row>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Row>
              <Col className="projectName">{this.props.project.name}</Col>
            </Row>
            <Row className="board-header">
              {Object.entries(this.props.llColumns).map(([key, value]) => {
                return (
                  <Col
                    style={{ display: 'flex', justifyContent: 'center' }}
                    className={classnames({
                      active: this.state.activeTab === value.name
                    })}
                    onClick={() => {
                      this.toggleTab(value.name);
                    }}
                    key={key}
                  >
                    {value.name}
                    <span>({(value && value.taskIds.length) || 0})</span>
                  </Col>
                );
              })}
            </Row>

            <Row className="board-container" activetab={this.state.activeTab}>
              {Object.entries(this.props.llColumns).map(
                ([key, value], index) => {
                  return (
                    <Column
                      key={key}
                      columns={this.props.llColumns}
                      id={key}
                      tickets={this.props.allTicketsObject}
                      tabId={index + 1}
                      activetab={this.state.activeTab}
                      allUsers={this.props.allUsers}
                    />
                  );
                }
              )}
            </Row>
          </DragDropContext>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.project.project,
    projects: state.project.projects,
    allTickets: state.ticket.allTickets,
    allUsers: state.project.users,
    ticket: state.ticket.ticket,
    allTicketsObject: state.ticket.allTicketsObject,
    llColumns: state.ticket.llColumns
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const projectId = ownProps.match.params.id;
  return {
    getProject: () => {
      dispatch(getProjectThunk(projectId));
    },
    loadProjects: () => {
      dispatch(getProjectsThunk());
    },
    loadUsers: () => {
      dispatch(getUsersThunk(projectId));
    },
    addUser: userId => {
      dispatch(addUserThunk(projectId, userId));
    },
    loadTickets: () => {
      dispatch(getTicketsThunk(projectId));
    },
    reorder: (result, dest) => {
      dispatch(updateColumnsThunk(result, dest));
    },
    reorderProps: columns => {
      dispatch(reorderTickets(columns));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBoard);
