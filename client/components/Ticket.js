import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  removeTicketThunk,
  updateTicketThunk,
  addUserToTicketThunk,
  removeUserFromTicketThunk
} from '../actions/ticket';
import Timer from './Timer';
import {
  Card,
  CardText,
  CardBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { updateTicket } from '../actions/ticket';

import socket from '../socket';

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.ticket.title,
      description: this.props.ticket.description,
      changed: false,
      open: false,
      dropdownOpen: false,
      btnDropright: false,
      userDropdownOpen: false,
      userEmail: 'Select User',

      newUser: this.props.ticket.userId,
      disabled: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.userToggle = this.userToggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.select = this.select.bind(this);
    this.deactivateList = this.deactivateList.bind(this);
    this.activateList = this.activateList.bind(this);
  }

  componentDidMount() {
    if (this.props.ticket.user) {
      this.setState({ userEmail: this.props.ticket.user.email });
    }
    socket.on('modify', data => {
      if (this.props.ticket.id === data.id) {
        // console.log(data);
        this.setState({
          userEmail: data.userEmail,
          newUser: data.userId
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.data.id !== this.props.data.id &&
      this.props.ticket.id === this.props.data.id
    ) {
      this.setState({
        title: this.props.data.title,
        description: this.props.data.description
      });
    }
  }

  select(event) {
    this.setState({ userEmail: event.target.innerText });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
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

  async handleSubmit(event) {
    event.preventDefault();
    this.props.update(this.props.ticket.id, this.props.ticket.projectId, {
      title: this.state.title,
      description: this.state.description
    });
    this.handleClose();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  deactivateList = () => {
    this.setState({ disabled: 'disabled' });
  };

  activateList = () => {
    this.setState({ disabled: '' });
  };

  render() {
    const { provided, innerRef, ticket } = this.props;
    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={innerRef}
      >
        <Card style={styles.cardContainer}>
          <CardBody style={styles.cardContainer}>
            <div className="ticketTitle-button-wrapper">
              {ticket.title}
              <ButtonDropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
              >
                <DropdownToggle
                  outline
                  color="secondary"
                  size="sm"
                  className="custom-lineheight"
                >
                  <i className="fa fa-ellipsis-h" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.handleClickOpen}>
                    Modify
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this ticket?'
                        )
                      )
                        this.props.remove(ticket);
                    }}
                  >
                    Remove
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
            <hr />
            <CardText>
              <b>Description: </b>
              {ticket.description}
            </CardText>
            <CardText>
              <b>Points: </b>
              {ticket.points}
            </CardText>
            <div className="user-timer-wrapper">
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Update Ticket</DialogTitle>
                <DialogContent>
                  <form onSubmit={this.handleSubmit}>
                    <label className="formLabel" htmlFor="title">
                      Title:{' '}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={this.state.title}
                      onChange={this.handleChange}
                    />
                    <br />
                    <label className="formLabel" htmlFor="description">
                      Description:{' '}
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange}
                    />
                    <br />
                    <button
                      id="submit"
                      type="submit"
                      disabled={!this.state.title || !this.state.description}
                    >
                      Submit
                    </button>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
              <div className="assign-user">
                Assigned To:
                <ButtonDropdown
                  isOpen={this.state.userDropdownOpen}
                  toggle={this.userToggle}
                >
                  <DropdownToggle outline caret size="sm">
                    {this.state.userEmail}
                  </DropdownToggle>
                  <DropdownMenu persist>
                    <DropdownItem header>Select User</DropdownItem>
                    <DropdownItem divider />
                    {this.props.allUsers.map(user => {
                      return (
                        <DropdownItem
                          className={this.state.disabled}
                          key={user.id}
                          onClick={() => {
                            this.props.addUserToTix(ticket.id, user.id);
                            this.setState({ newUser: user.id });
                            this.select(event);
                          }}
                        >
                          {user.email}
                        </DropdownItem>
                      );
                    })}
                    <DropdownItem
                      className={this.state.disabled}
                      onClick={() => {
                        this.props.removeUserfromTix(
                          ticket.id,
                          ticket.projectId
                        );
                        this.setState({
                          userEmail: 'Select User',
                          newUser: {}
                        });
                      }}
                    >
                      {' '}
                      Unassign
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
              <Timer
                newUser={this.state.newUser}
                ticket={ticket}
                currentUser={this.props.user.id}
                deactivateList={this.deactivateList}
                activateList={this.activateList}
                currentProject={this.props.user.projectId}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    data: state.ticket.ticket,
    project: state.project.project,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    remove: ticket => {
      dispatch(removeTicketThunk(ticket));
    },
    update: (id, projectId, ticket) => {
      dispatch(updateTicketThunk(id, projectId, ticket));
    },
    addUserToTix: (id, userId) => {
      dispatch(addUserToTicketThunk(id, userId));
    },
    removeUserfromTix: (id, projectId) => {
      dispatch(removeUserFromTicketThunk(id, projectId));
    }
  };
};
const styles = {
  cardContainer: {
    margin: '3px 0',
    padding: 3
  },
  title: {
    margin: 0
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);
