/* eslint-disable complexity */
import React from 'react';
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
      activeTab: 'to_do'
    };
    this.toggle = this.toggle.bind(this);
    this.userToggle = this.userToggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    const projectId = this.props.match.params.id;
    console.log('projectId inside component did mount', projectId);
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

    const newProps = handleDragProps(
      source,
      destination,
      draggableId,
      this.props
    );

    this.props.reorderProps(newProps.columns); //frontend
    this.props.reorder(result); //backend

    socket.emit('reorder', this.props.match.params.id, newProps.columns);
  };
  render() {
    if (!this.props.columns['to_do'] || !this.props.allTickets) {
      return '';
    }

    return (
      <div>
        <Container className="project-board">
          <Row>
            <Col sm={12} xs={12}  md={6}>
              <ButtonDropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
              >
                <DropdownToggle caret size="sm"   color="info" className="abcd" >
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
                <Button color="info" size="sm"  className="abcd">
                  Users On Project
                </Button>
              </Link>
              <Link to={`/timesheet`}>
                <Button color="info" size="sm"  className="abcd">
                  Timesheets
                </Button>
              </Link>
            </Col>
        
            <Col xs={12}   sm={12} md={6}   className="right-nav">
              <Link to={`/projects/${this.props.project.id}/newticket`}>
                <Button outline color="info" size="sm"     className="abcde" >
                  New Ticket
                </Button>
              </Link>
              <Link to={`/projects/${this.props.project.id}/adduser`}>
                <Button outline color="info" size="sm"    className="abcde">
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
              <Col
                className={classnames({
                  active: this.state.activeTab === 'to_do'
                })}
                onClick={() => {
                  this.toggleTab('to_do');
                }}
              >
                To Do{' '}
                <span>
                  {' '}
                  ({this.props.columns['to_do'] &&
                    this.props.columns['to_do'].taskIds.length})
                </span>
              </Col>
              <Col
                className={classnames({
                  active: this.state.activeTab === 'in_progress'
                })}
                onClick={() => {
                  this.toggleTab('in_progress');
                }}
              >
                In Progress
                <span>
                  {' '}
                  ({this.props.columns['in_progress'] &&
                    this.props.columns['in_progress'].taskIds.length})
                </span>
              </Col>
              <Col
                className={classnames({
                  active: this.state.activeTab === 'in_review'
                })}
                onClick={() => {
                  this.toggleTab('in_review');
                }}
              >
                In Review{' '}
                <span>
                  {' '}
                  ({(this.props.columns['in_review'] &&
                    this.props.columns['in_review'].taskIds.length) ||
                    0})
                </span>
              </Col>
              <Col
                className={classnames({
                  active: this.state.activeTab === 'done'
                })}
                onClick={() => {
                  this.toggleTab('done');
                }}
              >
                Done{' '}
                <span>
                  {' '}
                  ({(this.props.columns['done'] &&
                    this.props.columns['done'].taskIds.length) ||
                    0})
                </span>
              </Col>
            </Row>

            <Row className="board-container" activetab={this.state.activeTab}>
              <Column
                columns={this.props.columns}
                id="to_do"
                tickets={this.props.allTicketsObject}
                tabId="1"
                activetab={this.state.activeTab}
                allUsers={this.props.allUsers}
              />

              <Column
                columns={this.props.columns}
                id="in_progress"
                tickets={this.props.allTicketsObject}
                tabId="2"
                activetab={this.state.activeTab}
                allUsers={this.props.allUsers}
              />

              <Column
                columns={this.props.columns}
                id="in_review"
                tickets={this.props.allTicketsObject}
                tabId="3"
                activetab={this.state.activeTab}
                allUsers={this.props.allUsers}
              />

              <Column
                columns={this.props.columns}
                id="done"
                tickets={this.props.allTicketsObject}
                tabId="4"
                activetab={this.state.activeTab}
                allUsers={this.props.allUsers}
              />
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
    to_do: state.ticket.to_do,
    in_progress: state.ticket.in_progress,
    in_review: state.ticket.in_review,
    done: state.ticket.done,
    allTickets: state.ticket.allTickets,
    allUsers: state.project.users,
    ticket: state.ticket.ticket,
    allTicketsObject: state.ticket.allTicketsObject,
    columns: state.ticket.columns
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
    reorder: result => {
      dispatch(updateColumnsThunk(result, projectId));
    },
    reorderProps: columns => {
      dispatch(reorderTickets(columns));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBoard);
