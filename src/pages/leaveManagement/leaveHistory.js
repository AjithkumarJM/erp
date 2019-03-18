import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'
import cookie from 'react-cookies';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { empLeaveHistory, cancelLeavePrompt, leaveBalance, leaveList } from '../../actions';

class LeaveHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: cookie.load('session'),
            loader: {
                visible: false,
            },
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            alertOptions: {
                offset: 14,
                position: 'bottom right',
                theme: 'dark',
                time: 5000,
                transition: 'scale'
            }
        };
        this.props.empLeaveHistory(this.state.data.employee_id)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            empleavehistory: nextProps.empHistory
        })
    }

    functioncall() {
        this.props.empLeaveHistory(this.state.data.employee_id)
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

    cancelLeave(cell, row) {
        if (row.leave_status == 'Pending' || row.leave_status == 'Approved') {
            if (this.formatDate(row.from_date) > moment().format('YYYY/MM/DD')) {
                return <button className='btn ems-btn-ternary btn-sm' onClick={() => { this.setState({ rowData: row }) }} data-toggle="modal" data-target="#emp_cancel">Cancel Leave</button>
            }
        }
    }

    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    formatDate(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }

    renderEmpLeaveHistory() {
        const typeOfLeaveML = {
            'CL': 'CL',
            'EL': 'EL',
            'ML': 'ML',
            'LOP': 'LOP',
            'WFH': 'WFH'
        }
        const typeOfLeave = {
            'CL': 'CL',
            'EL': 'EL',
            'LOP': 'LOP',
            'WFH': 'WFH'
        }
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
            <BootstrapTable data={this.state.empleavehistory} maxHeight='500' version='4' options={options} trClassName={this.rowClassNameFormat} ignoreSinglePage pagination>
                <TableHeaderColumn isKey dataField='type_name' dataAlign="center" filterFormatted
                    formatExtraData={this.state.data.gender == 'Female' ? typeOfLeaveML : typeOfLeave} filter={{ type: 'SelectFilter', options: this.state.data.gender == 'Female' ? typeOfLeaveML : typeOfLeave, defaultValue: 2 }}>Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.formatDate} dataAlign="center" dataSort>From Date</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataFormat={this.formatDate} dataAlign="center" dataSort>To Date</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>Duration (days)</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='leave_status' filterFormatted
                    formatExtraData={LeaveType} filter={{ type: 'SelectFilter', options: LeaveType, defaultValue: 2 }} columnClassName={this.statusFromat}>Status</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.cancelLeave.bind(this)} dataAlign="center">Action</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    cancelPrompt() {
        let values = {}
        this.setState({ loader: { visible: true } })
        values.leave_id = this.state.rowData.leave_id;
        values.is_approved = 4;
        this.props.cancelLeavePrompt(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 5000
                })
                this.functioncall();
            } else {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'error',
                    theme: 'dark',
                    time: 5000
                })
                this.functioncall();
            }
        })
    }

    render() {
        return (
            <div>
                <Loader show={this.state.loader.visible} message={this.state.spinner} />
                <AlertContainer ref={a => this.msg = a} {...this.state.alertOptions} />

                <div>
                    {this.renderEmpLeaveHistory()}
                </div>
                <div className="modal fade" id="emp_cancel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <h4 className="modal-body text-center">
                                Are you sure, you want to cancel the leave ?
                            </h4>
                            <div className="modal-footer  justify-content-md-center">
                                <button type="button" className="btn btn-sm btn-ems-primary" onClick={this.cancelPrompt.bind(this)} data-dismiss="modal">Yes</button>
                                <button type="button" className="btn btn-sm btn-ems-secondary" data-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userDetails: state.userInformation,
        empHistory: state.employeeHistory
    };
}

export default (connect(mapStateToProps, { empLeaveHistory, cancelLeavePrompt, leaveBalance, leaveList }))(LeaveHistory);