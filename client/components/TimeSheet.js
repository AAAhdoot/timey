import React from 'react';
// import 'react-dropdown/style.css';
import 'react-dates/initialize';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import { CSVLink } from 'react-csv';
import Axios from 'axios';
import { millisConverted } from '../utils';
import { Button } from 'reactstrap';

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import Picker from './Picker';

import 'react-datepicker/dist/react-datepicker.css';

var debounce = require('lodash.debounce');

import DRP from './DRP';

import moment from 'moment';

class TimeSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTime: '',
      tableproperties: {
        allData: []
      },
      dataToDownload: [],
      selectedDay: undefined,
      isEmpty: true,
      isDisabled: false,
      startDate: null,
      endDate: null,
      focusedInput: null
    };

    this.calcTotal = this.calcTotal.bind(this);
  }

  async componentDidMount() {
    const { data } = await Axios.get(`/api/users/timesheet`);

    let tableproperties = { ...this.state.tableproperties };
    tableproperties.allData = data;
    await this.setState({ tableproperties });

    this.calcTotal();
  }

  // handleChange = ({ startDate, endDate }) => {
  //   console.log('IN HANDLESTARTCHANGE');
  //   this.setState({
  //     startDate,
  //     endDate
  //   });
  // };

  handleStartChange = start => {
    this.setState({ startDate: start });
  };

  handleEndChange = end => {
    this.setState({ endDate: end });
  };

  calcTotal() {
    let totalTime;
    if (this.reactTable) {
      totalTime = millisConverted(
        this.reactTable
          .getResolvedState()
          .sortedData.reduce(
            (prev, curr) =>
              prev +
              new Date(curr.end).getTime() -
              new Date(curr.start).getTime(),
            0
          )
      );
    }
    if (!totalTime) debugger;
    console.log('CALCULATING', totalTime);
    this.setState({ totalTime });
  }

  columns = () => {
    return [
      {
        id: 'name',
        Header: 'Project',
        accessor: d => d.ticket.project.name
      },
      {
        id: 'ticket',
        Header: 'Ticket',
        accessor: d => d.ticket.title
      },
      {
        id: 'start',
        Header: 'Start',
        accessor: d => new Date(d.start).toString(),
        Cell: d => <span>{moment(d.original.start).format('llll')}</span>,
        // Filter: cellInfo => <DRP cellInfo={cellInfo} />,
        Filter: cellInfo => (
          // <DRP
          //   cellInfo={cellInfo}
          //   handleChange={this.handleChange}
          //   startDate={this.state.startDate}
          //   endDate={this.state.endDate}
          // />
          <Picker
            cellInfo={cellInfo}
            handleStartChange={this.handleStartChange}
            handleEndChange={this.handleEndChange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        ),
        filterMethod: (filter, row) => {
          console.log('FILTER', filter.value.startDate);
          console.log('FILTER', filter.value.endDate);

          // console.log('in filter method', filter);
          if (
            filter.value.startDate === null ||
            filter.value.endDate === null
          ) {
            // Incomplete or cleared date picker
            console.log('Incomplete or cleared date picker');
            return true;
          }

          // if (
          return moment(row[filter.id]).isBetween(
            filter.value.startDate,
            filter.value.endDate,
            'days',
            '[]'
          );
          // ) {
          //   // Found row matching filter
          //   // console.log('Found row matching filter');
          //   console.log('ROW', moment(row[filter.id]));
          //   return true;
          // }
        }
      },
      {
        id: 'end',
        Header: 'End',
        accessor: d => new Date(d.end),
        Cell: d => <span>{moment(d.original.end).format('llll')}</span>,
        filterable: false
      },
      {
        id: 'duration',
        Header: 'Duration',
        accessor: d => new Date(d.end).getTime() - new Date(d.start).getTime(),
        Cell: d =>
          millisConverted(
            new Date(d.original.end).getTime() -
              new Date(d.original.start).getTime()
          ),
        Footer: this.state.totalTime
      }
    ];
  };

  download = event => {
    const currentRecords = this.reactTable.getResolvedState().sortedData;
    const data_to_download = [];
    for (let index = 0; index < currentRecords.length; index++) {
      let record_to_download = {};
      for (let colIndex = 0; colIndex < this.columns().length; colIndex++) {
        record_to_download[this.columns()[colIndex].Header] =
          currentRecords[index][this.columns()[colIndex].id];
      }
      data_to_download.push(record_to_download);
    }
    this.setState({ dataToDownload: data_to_download }, () => {
      this.csvLink.link.click();
    });
  };

  // getTheadThProps = (state, rowInfo, column, instance) => ({
  //   onClick: () => {
  //     // Do whatever else you need to
  //     if (column.sortable !== false) {
  //       instance.sortColumn(column);
  //     }
  //   }
  // });

  getTheadFilterThProps = () => {
    return {
      style: {
        overflow: 'inherit',
        position: 'inherit'
      }
    };
  };

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.download}>Download</Button>
        </div>
        <div>
          <CSVLink
            data={this.state.dataToDownload}
            filename="data.csv"
            className="hidden"
            ref={r => (this.csvLink = r)}
            target="_blank"
          />
        </div>
        <div>
          <ReactTable
            ref={r => (this.reactTable = r)}
            data={this.state.tableproperties.allData}
            columns={this.columns()}
            defaultPageSize={8}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            filtered={this.state.filtered}
            onFilteredChange={filtered => {
              this.setState({ filtered }, this.calcTotal());
            }}
            className="-striped -highlight"
            showFilters="true"
            getTheadFilterThProps={this.getTheadFilterThProps}
          />
        </div>
      </div>
    );
  }
}

export default TimeSheet;
