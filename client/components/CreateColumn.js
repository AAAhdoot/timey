import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createColumnThunk } from '../actions/ticket';

class CreateColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
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
        name: this.state.name
      },
      this.state.projectId
    );
    this.setState({ name: '' });
  }

  render() {
    return (
      <div className="create-form">
        <div>
          <form id="abc" onSubmit={this.handleSubmit}>
            <label className="formLabel" htmlFor="name">
              Name:{' '}
            </label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <br />
            <button type="submit" disabled={!this.state.name}>
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

const mapDispatchToProps = function(dispatch) {
  return {
    create: (column, id) => {
      dispatch(createColumnThunk(column, id));
    }
  };
};

export default connect(null, mapDispatchToProps)(CreateColumn);
