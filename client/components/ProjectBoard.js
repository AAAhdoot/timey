/* eslint-disable complexity */
//
import React from 'react';
import MediaQuery from 'react-responsive';
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
      projectDropdownOpen: false,
      columnDropdownOpen: false,
      graphDropdownOpen: false,
      optionDropdownOpen: false,
      btnDropright: false,
      activeTab: -1
    };
    this.projectToggle = this.projectToggle.bind(this);
    this.columnToggle = this.columnToggle.bind(this);
    this.graphToggle = this.graphToggle.bind(this);
    this.optionToggle = this.optionToggle.bind(this);
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

  projectToggle() {
    this.setState(prevState => ({
      projectDropdownOpen: !prevState.projectDropdownOpen
    }));
  }

  columnToggle() {
    this.setState(prevState => ({
      columnDropdownOpen: !prevState.columnDropdownOpen
    }));
  }

  graphToggle() {
    this.setState(prevState => ({
      graphDropdownOpen: !prevState.graphDropdownOpen
    }));
  }

  optionToggle() {
    this.setState(prevState => ({
      optionDropdownOpen: !prevState.optionDropdownOpen
    }));
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
    let activeKey = this.state.activeTab;
    if (activeKey === -1) {
      activeKey = Object.keys(this.props.llColumns)[0].id;
    }

    return (
      <div>
        <Container className="project-board">
          <MediaQuery minWidth={500}>
            {matches => {
              return matches ? (
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <ButtonDropdown
                      isOpen={this.state.projectDropdownOpen}
                      toggle={this.projectToggle}
                    >
                      <DropdownToggle
                        caret
                        size="sm"
                        color="info"
                        className="abcd"
                        name={'projectDropdownOpen'}
                      >
                        {this.props.project.name}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Projects</DropdownItem>
                        <DropdownItem divider />
                        {this.props.projects.map(project => {
                          return (
                            <Link
                              key={project.id}
                              to={`/projects/${project.id}`}
                            >
                              <DropdownItem>{project.name}</DropdownItem>
                            </Link>
                          );
                        })}
                      </DropdownMenu>
                    </ButtonDropdown>

                    <ButtonDropdown
                      isOpen={this.state.graphDropdownOpen}
                      toggle={this.graphToggle}
                    >
                      <DropdownToggle
                        caret
                        size="sm"
                        color="info"
                        className="abcd"
                        name={'graphDropdownOpen'}
                      >
                        Graphs & Timesheets
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Graphs & Timesheets</DropdownItem>
                        <DropdownItem divider />
                        <Link
                          to={`/projects/${this.props.project.id}/ticketdata`}
                        >
                          <DropdownItem>Users On Project</DropdownItem>
                        </Link>
                        <Link to={`/timesheet`}>
                          <DropdownItem>Timesheets</DropdownItem>
                        </Link>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>

                  <div className="right-nav">
                    <ButtonDropdown
                      isOpen={this.state.optionDropdownOpen}
                      toggle={this.optionToggle}
                    >
                      <DropdownToggle
                        caret
                        size="sm"
                        color="info"
                        className="abcd"
                        name={'optionDropdownOpen'}
                      >
                        Options
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem header>Options</DropdownItem>
                        <DropdownItem divider />
                        <Link
                          to={`/projects/${this.props.project.id}/newcolumn`}
                        >
                          <DropdownItem>New Column</DropdownItem>
                        </Link>
                        <Link
                          to={`/projects/${this.props.project.id}/newticket`}
                        >
                          <DropdownItem>New Ticket</DropdownItem>
                        </Link>
                        <Link to={`/projects/${this.props.project.id}/adduser`}>
                          <DropdownItem>Add User</DropdownItem>
                        </Link>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </Row>
              ) : (
                ''
              );
            }}
          </MediaQuery>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Row>
              <Col className="projectName">{this.props.project.name}</Col>
            </Row>
            <MediaQuery maxWidth={500}>
              {matches => {
                return matches ? (
                  <div>
                    <Row>
                      <div style={{ display: 'flex' }}>
                        <ButtonDropdown
                          isOpen={this.state.projectDropdownOpen}
                          toggle={this.projectToggle}
                        >
                          <DropdownToggle
                            caret
                            size="sm"
                            color="info"
                            className="abcd"
                            name={'projectDropdownOpen'}
                          >
                            {this.props.project.name}
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem header>Projects</DropdownItem>
                            <DropdownItem divider />
                            {this.props.projects.map(project => {
                              return (
                                <Link
                                  key={project.id}
                                  to={`/projects/${project.id}`}
                                >
                                  <DropdownItem>{project.name}</DropdownItem>
                                </Link>
                              );
                            })}
                          </DropdownMenu>
                        </ButtonDropdown>

                        <ButtonDropdown
                          isOpen={this.state.graphDropdownOpen}
                          toggle={this.graphToggle}
                        >
                          <DropdownToggle
                            caret
                            size="sm"
                            color="info"
                            className="abcd"
                            name={'graphDropdownOpen'}
                          >
                            Graphs & Timesheets
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>
                              Graphs & Timesheets
                            </DropdownItem>
                            <DropdownItem divider />
                            <Link
                              to={`/projects/${this.props.project.id}/ticketdata`}
                            >
                              <DropdownItem>Users On Project</DropdownItem>
                            </Link>
                            <Link to={`/timesheet`}>
                              <DropdownItem>Timesheets</DropdownItem>
                            </Link>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </div>

                      <div className="right-nav">
                        <ButtonDropdown
                          isOpen={this.state.optionDropdownOpen}
                          toggle={this.optionToggle}
                        >
                          <DropdownToggle
                            caret
                            size="sm"
                            color="info"
                            className="abcd"
                            name={'optionDropdownOpen'}
                          >
                            Options
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Options</DropdownItem>
                            <DropdownItem divider />
                            <Link
                              to={`/projects/${this.props.project.id}/newcolumn`}
                            >
                              <DropdownItem>New Column</DropdownItem>
                            </Link>
                            <Link
                              to={`/projects/${this.props.project.id}/newticket`}
                            >
                              <DropdownItem>New Ticket</DropdownItem>
                            </Link>
                            <Link
                              to={`/projects/${this.props.project.id}/adduser`}
                            >
                              <DropdownItem>Add User</DropdownItem>
                            </Link>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </div>
                    </Row>
                    <Row className="board-header" style={{ display: 'flex' }}>
                      <ButtonDropdown
                        isOpen={this.state.columnDropdownOpen}
                        toggle={this.columnToggle}
                      >
                        <DropdownToggle
                          caret
                          size="sm"
                          color="info"
                          className="abcd"
                          name={'columnDropdownOpen'}
                        >
                          {this.props.llColumns[activeKey]
                            ? this.props.llColumns[activeKey].name
                            : 'Select Column'}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Columns</DropdownItem>
                          <DropdownItem divider />
                          {Object.entries(this.props.llColumns).map(
                            ([key, value]) => {
                              return (
                                <Link
                                  key={key}
                                  onClick={() => this.toggleTab(key)}
                                >
                                  <DropdownItem>{value.name}</DropdownItem>
                                </Link>
                              );
                            }
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Row>

                    {this.props.llColumns[activeKey] && (
                      <Column
                        key={activeKey}
                        columns={this.props.llColumns}
                        id={activeKey}
                        tickets={this.props.allTicketsObject}
                        activetab={this.state.activeTab}
                        allUsers={this.props.allUsers}
                        toggleTab={this.toggleTab}
                      />
                    )}
                  </div>
                ) : (
                  <Row
                    className="board-container"
                    style={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      overflowX: 'auto'
                    }}
                  >
                    {Object.entries(this.props.llColumns).map(
                      ([key, value], index) => {
                        console.log(value);
                        return (
                          <Column
                            key={key}
                            columns={this.props.llColumns}
                            id={key}
                            tickets={this.props.allTicketsObject}
                            tabId={index + 1}
                            activetab={this.state.activeTab}
                            allUsers={this.props.allUsers}
                            toggleTab={this.toggleTab}
                          />
                        );
                      }
                    )}
                  </Row>
                );
              }}
            </MediaQuery>
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
