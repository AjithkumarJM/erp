import React, { Component } from 'react';
import { holidaylist } from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';

class HolidayList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.holidaylist();
    }

    holidaylist() {
        this.props.holidaylist(null, (data) => {
            data.data.data.map((data, index) => {
                data['day'] = moment(data.holiday_date).format('dddd')
            })
            this.setState({ holidaylist: data.data.data });
        })
    }

    renderDoj(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }
    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    holidayListtable() {
        const options = {
            sortName: this.state.sortName,
            sortOrder: this.state.sortOrder,
            onSortChange: this.onSortChange,
            sizePerPage: 10,  // which size per page you want to locate as default            
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }],
            paginationSize: 3,  // the pagination bar size.            
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function     
        };

        return (
            <BootstrapTable data={this.state.holidaylist} version='4' options={options} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">Holiday Name</TableHeaderColumn>
                <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDoj} dataAlign="center" dataSort>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='day' dataAlign="center">Day</TableHeaderColumn>
            </BootstrapTable>
        )
    }
    render() {
        let d = new Date();
        let year = d.getFullYear();
        return (
            <div className='row'>
                <div className="col-12 page-header">
                    <h2>Holiday List ({year})</h2>
                </div>
                <div className='col-md-12 '>
                    {this.holidayListtable()}
                </div>
            </div>
        )

    }
}
function mapState(state) {
    return { userDetails: state.userInformation };
}

export default (connect(mapState, { holidaylist })(HolidayList));