import React, { Component } from 'react';

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default class DRP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null
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

  falseFunc = () => false;

  render() {
    return (
      <DateRangePicker
        withPortal={true}
        startDateId="startDate"
        endDateId="endDate"
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        isOutsideRange={this.falseFunc}
        showClearDates={true}
        onDatesChange={({ startDate, endDate }) => {
          if (endDate) this.props.handleChange({ startDate, endDate });
          this.setState({ startDate, endDate }, () => {
            this.props.cellInfo.onChange({ startDate, endDate });
          });
        }}
        // onDatesChange={({ startDate, endDate }) => {
        //   this.setState({ startDate, endDate });
        //   if (endDate) {
        //     this.props.cellInfo.onChange({ startDate, endDate });
        //   }
        // }}
        focusedInput={this.state.focusedInput}
        onFocusChange={focusedInput => this.setState({ focusedInput })}
      />
    );
  }
}
