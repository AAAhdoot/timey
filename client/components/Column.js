import React from 'react';
import classnames from 'classnames';
import {
  Col,
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
      columnName: this.props.columns[this.props.id].name,
      editing: false
    };
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnyClick = this.handleAnyClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleAnyClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleAnyClick);
  }

  handleAnyClick(event) {
    if (this.state.editing && event.target.name !== 'columnName') {
      this.setState({ editing: false });
    }
    if (this.state.columnName !== this.props.columns[this.props.id].name) {
      this.props.update(
        Number(this.props.id),
        this.props.columns[this.props.id].projectId,
        {
          name: this.state.columnName
        }
      );
    }
  }

  handleChange(event) {
    if (event.target.name === 'columnName' && event.target.value.length === 0) {
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleEdit = () => {
    this.setState({ editing: true });
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
          padding: 0,
          minWidth: '215px'
        }}
      >
        <div className="ticketTitle-button-wrapper">
          {this.state.editing ? (
            <input
              type="text"
              name="columnName"
              onChange={this.handleChange}
              value={this.state.columnName}
            ></input>
          ) : (
            <span style={{ minWidth: '173px' }} onDoubleClick={this.handleEdit}>
              {columns[id].name}
            </span>
          )}

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
