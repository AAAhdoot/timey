import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTicketThunk } from '../actions/ticket';
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      points: '',
      projectId: this.props.match.params.id
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.props.create(
      {
        title: this.state.title,
        description: this.state.description,
        points: this.state.points
      },
      this.state.projectId
    );
    this.setState({ title: '', description: '', points: '' });
  }

  render() {
    return (
      <div className='create-form' >
      <div>
       <form  id='abc' onSubmit={this.handleSubmit}>
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
            <label className="formLabel" htmlFor="points">
              Points:
            </label>
            <input
              type="number"
              name="points"
              min="1"
              value={this.state.points}
              onChange={this.handleChange}
            />
            <br />
            <button
              type="submit"
              disabled={
                !this.state.title ||
                !this.state.description ||
                !this.state.points
              }
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { data: state.ticket };
};

const mapDispatchToProps = function(dispatch) {
  return {
    create: (ticket, id) => {
      dispatch(createTicketThunk(ticket, id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTicket);
