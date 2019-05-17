import React from 'react';
import Axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { CSVLink } from 'react-csv';
import { millisConverted } from '../utils';
import { Button } from 'reactstrap';

// import { DateRangePicker } from 'react-dates';
// import 'react-dates/lib/css/_datepicker.css';
// import 'react-dates/initialize';
// import DRP from './DRP';

import Picker from './Picker';
import 'react-datepicker/dist/react-datepicker.css';

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
      startDate: null,
      endDate: null,
      focusedInput: null
    };
  }

  async componentDidMount() {
    const { data } = await Axios.get(`/api/users/timesheet`);
    let tableproperties = { ...this.state.tableproperties };
    tableproperties.allData = data;
    await this.setState({ tableproperties });
    this.addFilterPlaceholder();
    this.calcTotal();
  }

  handleStartChange = start => {
    this.setState({ startDate: start });
  };

  handleEndChange = end => {
    this.setState({ endDate: end });
  };

  calcTotal = () => {
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
    this.setState({ totalTime });
  };

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
          if (
            filter.value.startDate === null ||
            filter.value.endDate === null
          ) {
            return true;
          }

          return moment(row[filter.id]).isBetween(
            filter.value.startDate,
            filter.value.endDate,
            'days',
            '[]'
          );
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
        Footer: this.state.totalTime ? `Total: ${this.state.totalTime}` : null,
        filterable: false
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

  addFilterPlaceholder = () => {
    const filters = document.querySelectorAll('div.rt-th > input');
    for (let filter of filters) {
      filter.placeholder = 'Search..';
    }
  };

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
          <Button
            color="primary"
            onClick={this.download}
            className="m-2"
            style={{ width: '100%' }}
          >
            Download
          </Button>
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
            defaultPageSize={5}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            filtered={this.state.filtered}
            onFilteredChange={filtered => {
              this.setState({ filtered }, this.calcTotal.bind(this));
            }}
            className="-striped -highlight"
            showFilters="true"
            defaultSorting={[
              {
                id: 'id',
                desc: false
              }
            ]}
            getTheadFilterThProps={this.getTheadFilterThProps}
          />
        </div>
      </div>
    );
  }
}

export default TimeSheet;
