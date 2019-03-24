import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { getReporteesLeaveListById, getAllLeaveHistory } from '../../services/leaveManagement';
import { userInfo, tableOptions, spinner, allLeaveType, leaveFormat } from '../../const';

class ReporteesLeaveHistory extends Component {

    componentWillMount() {
        const { getReporteesLeaveListById, getAllLeaveHistory } = this.props;
        const { employee_id, role_id } = userInfo;

        if (role_id !== 3) getReporteesLeaveListById(employee_id);
        else getAllLeaveHistory();
    }

    statusFormat = (cell, row) => {
        const { leave_status } = row;

        if (leave_status === 'Rejected') return <div className='badge p-2 rounded bg-rejected secondary-text'>{leave_status}</div>
        else if (leave_status === 'Cancelled') return <div className='badge p-2 rounded bg-cancelled secondary-text'>{leave_status}</div>
        else if (leave_status === 'Pending') return <div className='badge p-2 rounded bg-pending secondary-text'>{leave_status}</div>
        else if (leave_status === 'Approved') return <div className='badge p-2 rounded bg-approved secondary-text'>{leave_status}</div>
    }

    formatDate = date => moment((date.split('T'))[0]).format('ddd, MMM Do YY');

    generateName = (row, cell) => cell.first_name + " " + cell.last_name;

    reporteesLeaveList = () => {
        const { role_id } = userInfo;
        const { allLeaveHistory, reporteesLeaveHistory } = this.props;

        const { data } = role_id === 3 ? allLeaveHistory.response : reporteesLeaveHistory.response;

        let hidden;
        role_id == 3 ? hidden = false : hidden = true;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" filterFormatted formatExtraData={allLeaveType} filter={{ type: 'SelectFilter', options: allLeaveType, defaultValue: 2 }}>LEAVE TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.formatDate} dataAlign="center" dataSort>FROM DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataAlign="center" dataSort dataFormat={this.formatDate}>TO DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>DURATION (days)</TableHeaderColumn>
                <TableHeaderColumn hidden={hidden} dataField='reporting_to' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>REPORTING TO</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='leave_status' filterFormatted dataFormat={this.statusFormat} formatExtraData={leaveFormat} filter={{ type: 'SelectFilter', options: leaveFormat, defaultValue: 2 }} columnClassName={this.statusFromat}>STATUS</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { role_id } = userInfo;
        const { requesting } = role_id === 3 ? this.props.allLeaveHistory : this.props.reporteesLeaveHistory

        if (requesting) return <Loader show={true} message={spinner} />
        else return <div className='p-2 pt-3'>{this.reporteesLeaveList()}</div>
    }
}

const mapStateToProps = ({ allLeaveHistory, reporteesLeaveHistory }) => {
    return { allLeaveHistory, reporteesLeaveHistory };
}

export default connect(mapStateToProps, { getReporteesLeaveListById, getAllLeaveHistory })(ReporteesLeaveHistory);