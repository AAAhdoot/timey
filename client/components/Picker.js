import React, { Component } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null
    };
  }

  componentDidMount() {
    if (this.props.startDate) {
      this.setState({
        startDate: this.props.startDate
      });
    }
    if (this.props.endDate) {
      this.setState({
        endDate: this.props.endDate
      });
    }
  }

  handleChange = date => {
    this.setState(
      {
        startDate: date
      },
      this.props.cellInfo.onChange({
        startDate: date,
        endDate: this.state.endDate
      })
    );
    this.props.handleStartChange(date);
  };

  handleEndChange = date => {
    this.setState(
      {
        endDate: date
      },
      this.props.cellInfo.onChange({
        startDate: this.state.startDate,
        endDate: date
      })
    );
    this.props.handleEndChange(date);
  };
  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          placeholderText="Start Date..."
        />
        <DatePicker
          selected={this.state.endDate}
          onChange={this.handleEndChange}
          placeholderText="End Date..."
        />
      </div>
    );
  }
}
