import React from 'react';
import classnames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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
import { removeColumnThunk, updateColumnThunk } from '../actions/ticket';
import { connect } from 'react-redux';

class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      open: false,
      name: ''
    };
    this.toggle = this.toggle.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('PROPS: ', this.props);
    this.props.update(
      Number(this.props.id),
      this.props.columns[this.props.id].projectId,
      {
        name: this.state.name
      }
    );
    this.handleClose();
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.data.id !== this.props.data.id &&
      Number(this.props.id) === this.props.data.id
    ) {
      this.setState({
        name: this.props.data.name
      });
    }
  }

  render() {
    const { columns, tickets, id, activetab, allUsers, toggleTab } = this.props;

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
          // width: '846px'
        }}
      >
        <div className="ticketTitle-button-wrapper">
          {columns[id].name}
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle
              outline
              color="secondary"
              size="sm"
              className="custom-lineheight"
            >
              <i className="fa fa-ellipsis-h" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem divider />
              <DropdownItem onClick={this.handleClickOpen}>Modify</DropdownItem>
              <DropdownItem
                disabled={columns[id].taskIds.length ? true : false}
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete this column?'
                    )
                  )
                    this.props.remove(columns[id]);
                }}
              >
                Remove
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Update Column</DialogTitle>
            <DialogContent>
              <form onSubmit={this.handleSubmit}>
                <label className="formLabel" htmlFor="title">
                  Title:{' '}
                </label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                <br />
                <button id="submit" type="submit" disabled={!this.state.name}>
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
        </div>
        {/* <hr /> */}
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
  }
}

const mapStateToProps = state => {
  return {
    data: state.ticket.column,
    project: state.project.project
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    remove: column => {
      dispatch(removeColumnThunk(column));
    },
    update: (id, projectId, column) => {
      dispatch(updateColumnThunk(id, projectId, column));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Column);
