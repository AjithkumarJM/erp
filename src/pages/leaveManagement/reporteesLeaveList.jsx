import React, { Component } from 'react';
import { leaveList, getAllLeaveHistory } from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import cookie from 'react-cookies';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class ReporteesLeaveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: cookie.load('session'),
            hidden: ""
        };
        this.props.leaveList(this.state.data.employee_id),
            this.props.getAllLeaveHistory()
    }

    componentWillReceiveProps(nextProps) {
        nextProps.userInformation.role_id != 3 ? this.setState({ leavelist: nextProps.reporteesHistory }) : this.setState({ leavelist: nextProps.allLeaveHistory })
    }

    statusFromat(fieldValue, row, rowIdx, colIdx) {
        if (fieldValue == 'Rejected') {
            return 'bg-rejected'
        } else if (fieldValue == 'Cancelled') {
            return 'bg-cancelled'
        } else if (fieldValue == 'Pending') {
            return 'bg-pending'
        } else if (fieldValue == 'Approved') {
            return 'bg-approved'
        }
    }

    rowClassNameFormat(row, rowIdx) {
        // row is whole row object
        // rowIdx is index of row
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    renderDates(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }

    fullName(row, cell) {
        return cell.first_name + " " + cell.last_name
    }

    reporteesLeaveList() {
        this.state.data.role_id == 3 ? this.state.hidden = false : this.state.hidden = true
        const LeaveFormat = {
            'CL': 'CL',
            'EL': 'EL',
            'ML': 'ML',
            'WFH': 'WFH',
            'LOP': 'LOP'
        };

        const LeaveType = {
            'Approved': 'Approved',
            'Rejected': 'Rejected',
            'Pending': 'Pending',
            'Cancelled': 'Cancelled'
        };

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
            <BootstrapTable data={this.state.leavelist} maxHeight='500' version='4' options={options} trClassName={this.rowClassNameFormat} ignoreSinglePage pagination>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.fullName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee ID</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" filterFormatted
                    formatExtraData={LeaveFormat} filter={{ type: 'SelectFilter', options: LeaveFormat, defaultValue: 2 }}>Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.renderDates} dataAlign="center" dataSort>From Date</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataAlign="center" dataSort dataFormat={this.renderDates}>To Date</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>Duration (days)</TableHeaderColumn>
                <TableHeaderColumn hidden={this.state.hidden} dataField='reporting_to' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Reporting To</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='leave_status' filterFormatted dataFormat={this.enumFormatter}
                    formatExtraData={LeaveType} filter={{ type: 'SelectFilter', options: LeaveType, defaultValue: 2 }} columnClassName={this.statusFromat}>Status</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        return (
            this.reporteesLeaveList()
        )
    }
}

function mapStateToProps({ userInformation, reporteesHistory, entireLeaveHistory }) {
    return {
        userInformation, reporteesHistory, entireLeaveHistory
    };
}

export default connect(mapStateToProps, { leaveList, getAllLeaveHistory })(ReporteesLeaveList);