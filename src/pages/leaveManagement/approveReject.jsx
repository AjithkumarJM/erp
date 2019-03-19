import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert';
import moment from 'moment';

import { approveReject, getPendingHistory, empLeaveHistory, leaveBalance, leaveList, getTypesOfLeaves, applyLeave } from '../../actions';
import { getUserDetails } from '../../services/userDetails';

class ApproveReject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empleavehistory: [],
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
            },
            data: cookie.load('session'),
        }
        this.props.getPendingHistory(this.state.data.employee_id)
    }

    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ pending: nextProps.pendingHistory })
    }

    fullName(row, cell) {
        return cell.first_name + " " + cell.last_name
    }

    actionFormat(cell, row) {
        return <button className="btn ems-btn-ternary" onClick={() => { this.getDetails(row) }} data-toggle="modal" data-target="#approve">Approve / Reject</button>
    }

    getDetails(row) {
        this.setState({
            leaveid: row.leave_id,
            currentLeaveDetail: [row]
        })
    }

    leaveDetails() {
        const options = {
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
            <BootstrapTable data={this.state.currentLeaveDetail} maxHeight='500' options={options} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.fullName}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" >Employee ID</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" dataSort>Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.renderDates} dataAlign="center" dataSort>From Date</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataAlign="center" dataSort dataFormat={this.renderDates}>To Date</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>Duration (days)</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    pendingapprovalTable() {
        const LeaveType = {
            'CL': 'CL',
            'EL': 'EL',
            'ML': 'ML',
            'LOP': 'LOP',
            'WFH': 'WFH'
        };

        const options = {
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
            <BootstrapTable data={this.state.pending} options={options} maxHeight='500' version='4' ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.fullName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee ID</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" filterFormatted
                    formatExtraData={LeaveType} filter={{ type: 'SelectFilter', options: LeaveType, defaultValue: 2 }} > Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.renderDates} dataAlign="center" dataSort>From Date</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataAlign="center" dataSort dataFormat={this.renderDates}>To Date</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>Duration (days)</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='leave_status' dataAlign="center" dataSort>Status</TableHeaderColumn> */}
                <TableHeaderColumn dataAlign="center" dataFormat={this.actionFormat.bind(this)}>Action</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    functioncall() {
        this.props.getPendingHistory(this.state.data.employee_id)

        this.props.empLeaveHistory(this.state.data.employee_id, (data) => {
            this.setState({ empleavehistory: data.data.data })
        })

        this.props.leaveBalance(this.state.data.employee_id, (data) => {
            this.setState({ leavebalance: data.data.data })
        })

        this.props.leaveList(this.state.data.employee_id, (data) => {
            this.setState({ leavelist: data.data.data })
        })
    }

    approve(values) {
        this.setState({ loader: { visible: true } })
        values.leave_id = this.state.leaveid;
        values.is_approved = 2;
        this.props.approveReject(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 5000
                })
                setTimeout(() => {
                    this.props.reset();
                }, 1000)
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

    reject(values) {
        this.setState({ loader: { visible: true } })
        values.leave_id = this.state.leaveid;
        values.is_approved = 3;
        this.props.approveReject(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 5000
                })
                this.props.reset();
                this.functioncall();
            } else {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'error',
                    theme: 'dark',
                    time: 5000
                })
                this.props.reset();
                this.functioncall();
            }
        })
    }

    // splitting date from time
    renderDates(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }

    render() {
        const { handleSubmit, reset } = this.props;

        return (
            <div>
                <div>
                    {this.pendingapprovalTable()}
                    <Loader show={this.state.loader.visible} message={this.state.spinner} />
                    <AlertContainer ref={a => this.msg = a} {...this.state.alertOptions} />
                </div>
                < div className="modal fade" id="approve" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="col-12 page-header">
                                    <h2>Approve / Reject<span><button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={reset}>
                                        <span aria-hidden="true">&times;</span>
                                    </button></span></h2>

                                </div>
                            </div>
                            <div className='col-12'>
                                {this.leaveDetails()}
                            </div>
                            <br></br>
                            <form >
                                <div className='col-2'>
                                    <label className=' font-weight-bold'>Notes</label>
                                </div>
                                <div className='col-12'>
                                    <Field className='col-12' name="remarks" component="textarea" />
                                </div>
                                <div className='row appr-wrap justify-content-md-center'>
                                    <div >
                                        <button type="submit" onClick={handleSubmit(this.approve.bind(this))} className='btn btn-spacing btn-sm btn-ems-primary' data-dismiss="modal">Approve</button>
                                    </div>
                                    <div >
                                        <button type="submit" onClick={handleSubmit(this.reject.bind(this))} className=' btn btn-ems-secondary btn-sm' data-dismiss="modal">Reject</button>
                                    </div>
                                </div>
                                <br></br>
                            </form>
                            <br></br>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

function validate(values) {
    const errors = {};

    if (!values.oldpassword) {
        errors.oldpassword = <span className="badge badge-danger errorAlignment">enter old password</span>
    }

    if (!values.new_password) {
        errors.new_password = <span className="badge badge-danger errorAlignment">enter new password</span>
    }

    if (!values.confirm_password) {
        errors.confirm_password = <span className="badge badge-danger errorAlignment">confirm new  password</span>
    }

    if (values.new_password !== values.confirm_password) {
        errors.confirm_password = <span className="badge badge-danger errorAlignment">confirm password does not match</span>
    } else { }

    if (values.new_password) {
        if (values.new_password.length < 8) {
            errors.new_password = <span className="badge badge-danger errorAlignment">minimum it should have 8 characters</span>
        }
    }
    if (values.confirm_password) {
        if (values.confirm_password.length < 8) {
            errors.confirm_password = <span className="badge badge-danger errorAlignment">minimum it should have 8 characters</span>
        }
    }

    return errors;
}

function mapStateToProps(state) {
    return {
        userDetails: state.userInformation,
        pendingHistory: state.getPendingHistory
    };
}

export default withRouter(reduxForm({
    validate,
    form: 'approveRejectForm',
})(connect(mapStateToProps, {
    getUserDetails,
    leaveBalance,
    empLeaveHistory,
    approveReject,
    getTypesOfLeaves, applyLeave, leaveList, getPendingHistory
})(ApproveReject)));

