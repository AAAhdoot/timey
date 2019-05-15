import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createProjectThunk } from '../actions/project';
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

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      totalTime: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({title: nextProps.selectedStudent.firstName, lastName:nextProps.selectedStudent.lastName
  //   , email:nextProps.selectedStudent.email})
  //  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await this.props.create({
      name: this.state.name,
      totalTime: this.state.totalTime
    });
    this.setState({ name: '', totalTime: '' });
  }

  render() {
    return (
      <div className='create-form' >
       <div>
        <form  id='abc' onSubmit={this.handleSubmit}>
          <label className="formLabel" htmlFor="name">
            Project Name:{' '}
          </label>
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <br />
          <label className="formLabel" htmlFor="totalTime">
            Total Points:{' '}
          </label>
          <input
            type="number"
            name="totalTime"
            min="1"
            value={this.state.totalTime}
            onChange={this.handleChange}
          />
          <br />
          <br />
          <button
            type="submit"
            disabled={!this.state.name || !this.state.totalTime}
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
  return {
    data: state.ticket.projects
    // currentProject: state.ticket.currentProject
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    create: project => {
      dispatch(createProjectThunk(project));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
