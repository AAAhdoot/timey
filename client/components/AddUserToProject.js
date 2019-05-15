import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addUserThunk } from '../actions/project';
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

class AddUserToProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      projectId: this.props.match.params.id
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
    this.props.attachUser(
      {
        email: this.state.email
      },
      this.state.projectId
    );
    this.setState({ email: '' });
  }

  render() {
    return (
      <div className='create-form' >
      <div>
       <form  id='abc'  onSubmit={this.handleSubmit}>
        <label className="formLabel" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <br />
        <button type="submit" disabled={!this.state.email}>
          Submit
        </button>
      </form>
      </div>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return { data: state.ticket };
// };

const mapDispatchToProps = function(dispatch, ownProps) {
  const projectId = ownProps.match.params.id;
  return {
    attachUser: email => {
      dispatch(addUserThunk(projectId, email));
    }
  };
};

export default connect(null, mapDispatchToProps)(AddUserToProject);
