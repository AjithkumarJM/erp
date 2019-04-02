import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Field, reduxForm, getFormValues, change, formValueSelector } from 'redux-form';

import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import moment from 'moment';
import DatePicker from 'react-datepicker';
import cookie from 'react-cookies';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import Bulkupload from './forms/LeaveBulkupload'
import { bulkUpload, approveReject, cancelLeavePrompt, getPendingHistory, getUserDetails, holidayList, leaveBalance, getAllLeaveHistory, leaveList, getTypesOfLeaves, empLeaveHistory, applyLeave } from '../../actions';
import ApproveReject from './../leaveManagement/approveReject.js'
import LeaveHistory from './../leaveManagement/LeaveHistory'
import ReporteesLeaveList from './../leaveManagement/ReporteesLeaveList'

class LeaveManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leavetypes: [],
            leaveTypeId: '',
            // usage: '',
            empleavehistory: [],
            data: cookie.load('session'),
            loader: {
                visible: false,
            },
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            activeTab: '1',
            alertOptions: {
                offset: 14,
                position: 'bottom right',
                theme: 'dark',
                time: 5000,
                transition: 'scale'
            },
        }
        this.generateInputField = this.generateInputField.bind(this)
        this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
        this.generateTabs = this.generateTabs.bind(this);

        this.leavetypes();
        this.holidaylist();

        this.props.empLeaveHistory(this.state.data.employee_id)

        this.props.leaveBalance(this.state.data.employee_id, (data) => {
            this.setState({ leavebalance: data.data.data })
        })
    }

    functioncall() {
        const { employee_id } = this.state.data;

        this.props.getPendingHistory(employee_id)
        this.props.getAllLeaveHistory()
        this.props.empLeaveHistory(employee_id)
        this.props.leaveBalance(employee_id, (data) => {
            this.setState({ leavebalance: data.data.data })
        })
        this.props.leaveList(employee_id)
    }

    isWeekday(date) {
        const day = date.day()
        return day !== 0 && day !== 6
    }

    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    leavetypes() {
        this.props.getTypesOfLeaves(null, (data) => {
            if (this.state.data.gender == 'Female') {
                this.setState({ leavetypes: data.data.data });
            }
            else {
                for (let i = 0; i < data.data.data.length; i++) {
                    if (data.data.data[i].leavetype_id != 3) {
                        this.state.leavetypes.push(data.data.data[i]);
                    }
                }
            }
        })
    }

    holidaylist(values) {
        this.props.holidayList(values, (data) => {
            data.data.data.map((data, index) => {
                data['day'] = moment(data.holiday_date).format('dddd')
            })
            this.setState({
                holidaylist: data.data.data,
                holidayDate: data.data.data.holiday_date
            });

        })
    }

    renderDates(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }

    generateInputField(field) {
        const { holidaylist } = this.state
        const { meta: { touched, error } } = field;
        const className = `form-group row ${touched && error ? 'is-invalid' : ''}`

        const holidayDate = holidaylist ? holidaylist.map((data) => { return data.holiday_date }) : null;

        if (field.type == 'leave') {
            let optionList = _.map(field.list, data => {
                return <option key={data.$id} value={data[field.id]}>{data[field.displayLeavetype]}</option>;
            })
            return (
                <div className={className}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <select className="form-control form-control-sm" {...field.input}>
                            <option value="">Select</option>
                            {optionList}
                        </select>
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        }

        if (field.type == 'date') {
            return (
                <div className={className}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <DatePicker
                            className="form-control form-control-sm" {...field.input}
                            dateFormat='YYYY/MM/DD'
                            placeholderText='YYYY/MM/DD'
                            withPortal
                            excludeDates={holidayDate}
                            minDate={moment().subtract(30, "days")}
                            filterDate={this.isWeekday}
                            showMonthDropdown
                            showYearDropdown
                            tabIndex={1}
                            dropdownMode="select"
                            selected={field.input.value ? moment(field.input.value, 'YYYY/MM/DD') : null}
                            disabled={field.usage} />
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={className}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <textarea
                            className="form-control form-control-sm"
                            className="form-control"
                            disabled={field.usage}
                            {...field.input}
                        />
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        }
    }


    holidayListtable() {
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
            <BootstrapTable data={this.state.holidaylist} maxHeight='200' options={options} version='4' trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">Holiday Name</TableHeaderColumn>
                <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDates} dataAlign="center">Date</TableHeaderColumn>
                <TableHeaderColumn dataField='day' dataAlign="center">Day</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    leavebalancetable() {
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
            <BootstrapTable data={this.state.leavebalance} version='4' options={options} trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='type_name' dataAlign="center">Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataFormat={this.renderDates} dataAlign="center">Balance</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    applyLeave(values) {

        if (values.from_date._isValid) {
            values.from_date = moment(values.from_date._d).format('YYYY/MM/DD')
        }

        if (values.to_date._isValid) {
            values.to_date = moment(values.to_date._d).format('YYYY/MM/DD')
        }

        this.setState({ loader: { visible: true } })
        values.employee_id = this.props.userDetails.id;
        this.props.applyLeave(values, (data) => {
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
            }
        });
    }

    handlechangeFromDate(e, newValue, previousValue) {
        if (this.props.formState) {
            if (this.props.formState.leavetype_id == '3') {
                if (newValue._isValid == true) {
                    let d = moment(newValue._d, 'YYYY/MM/DD').format('YYYY/MM/DD')
                    this.props.dispatch(change('leaveManagementForm', 'to_date', moment(d, "YYYY/MM/DD").add(182, 'days')))
                }
            }
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
            this.functioncall.bind(this);
        }
    }

    renderList() {

        if (this.props.userDetails.role_id === 8 || this.props.userDetails.role_id === 9 || this.props.userDetails.role_id === 3) {
            return (
                <ul className="nav nav-tabs nav-justified " role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#pending" role="tab" onClick={this.functioncall.bind(this)}>Apply Leave</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={this.functioncall.bind(this)} data-toggle="tab" href="#leaveList" role="tab" >My Leave History</a>
                    </li>
                    <li className="nav-item" >
                        <a className="nav-link " onClick={this.functioncall.bind(this)} data-toggle="tab" href="#empleave" role="tab">Reportees Leave History</a>
                    </li>
                    <li className="nav-item" >
                        <a className="nav-link " onClick={this.functioncall.bind(this)} data-toggle="tab" href="#pendingApproval" role="tab">Pending Approvals</a>
                    </li>
                    {(() => {
                        if (this.props.userDetails.role_id === 3) {
                            return (
                                <li className="nav-item">
                                    <a className="nav-link " data-toggle="tab" href="#bulkupload" role="tab">Bulk Upload</a>
                                </li>
                            )
                        }
                    })()}
                </ul>
            )
        } else {
            return (
                <ul className="nav nav-tabs nav-justified " role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#pending" role="tab" onClick={this.functioncall.bind(this)}>Apply Leave</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#leaveList" role="tab" onClick={this.functioncall.bind(this)}>My Leave History</a>
                    </li>
                </ul>
            )
        }
    }

    generateTabs() {
        const { userDetails, handleSubmit, pristine, reset, submitting, } = this.props;
        const { leavetypes, activeTab } = this.state;

        const applyLeaveDiv = <div className='row'>
            <div className='col-6'>
                <form >
                    <div className='col-12'>
                        <Field
                            placeholder="Leave type"
                            type='leave'
                            displayLeavetype='type_name'
                            id='leavetype_id'
                            name='leavetype_id'
                            label='Leave Type '
                            list={leavetypes}
                            component={this.generateInputField}
                        />
                    </div>
                    <div className='col-12'>
                        <Field
                            placeholder='From Date'
                            type='date'
                            name='from_date'
                            onChange={this.handlechangeFromDate}
                            usage={pristine}
                            label='From Date '
                            component={this.generateInputField}
                        />
                    </div>
                    <div className='col-12'>
                        <Field
                            placeholder='To Date'
                            type='date'
                            name='to_date'
                            usage={this.state.usage || pristine}
                            label='To Date'
                            component={this.generateInputField} />
                    </div>

                    <div className='col-12'>
                        <Field
                            placeholder='Reason for your leave'
                            type='textarea'
                            name='Leave_Reason'
                            usage={this.state.usage || pristine}
                            label='Reason'
                            component={this.generateInputField} />
                    </div>

                    <div className='col-md-12'>
                        <div className='float-right'>
                            <button type='submit' className=" btn btn-sm btn-ems-primary mr-1" onClick={handleSubmit(this.applyLeave.bind(this))} disabled={pristine || submitting}>Apply</button>
                            <button type='reset' className="btn btn-sm btn-ems-clear" onClick={reset} disabled={pristine || submitting}>Clear</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='col-6'>
                {this.leavebalancetable()}
                <br></br>
                {this.holidayListtable()}
            </div>
        </div>

        // role 3 == hr, 8 ,9 = Manager and TL
        const tabHeader = userDetails.role_id === 8 || userDetails.role_id === 9 || userDetails.role_id === 3 ?
            [
                { name: 'Apply Leave', tabContent: applyLeaveDiv },
                { name: 'My Leave History', tabContent: <LeaveHistory /> },
                { name: 'Reportees Leave History', tabContent: <ApproveReject /> },
                { name: 'Pending Approval', tabContent: <ReporteesLeaveList /> },
                userDetails.role_id === 3 ? { name: 'Bulk Upload', tabContent: <Bulkupload /> } : null
            ]
            :
            [
                { name: 'Apply Leave', tabContent: applyLeaveDiv },
                { name: 'My Leave History', tabContent: <LeaveHistory /> },
            ]

        const navtabHeaderGenerator = tabHeader.map((tabs, index) => {
            return (
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === index + 1 })}
                        onClick={() => { this.toggle(index + 1); }}
                    >
                        {tabs.name}
                    </NavLink>
                </NavItem>
            )
        })

        const navTabContentGenerator = tabHeader.map((tabs, index) => {
            return (
                < TabContent activeTab={activeTab} >
                    <TabPane tabId={index + 1}>
                        {tabs.tabContent}
                    </TabPane>
                </TabContent >
            )
        })

        return (
            <div>
                <Nav tabs>
                    {navtabHeaderGenerator}
                </Nav >
                {navTabContentGenerator}
            </div>
        )
    }

    render() {
        const { formState } = this.props;
        const { alertOptions, spinner, loader, leavetypes } = this.state;

        if (formState) {
            formState.leavetype_id === 3 ? this.state.usage = true : this.state.usage = false
        }

        return (
            < div >
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                <Loader show={loader.visible} message={spinner} />
                {this.generateTabs()}
            </div>
        )
    }
}

function validate(values) {
    const errors = {};

    if (!values.leavetype_id) {
        errors.leavetype_id = "Select Leave type"
    }

    if (!values.Leave_Reason) {
        errors.Leave_Reason = "Enter your reason"
    }

    if (!values.to_date) {
        errors.to_date = "Select To Date"
    }

    if (!values.from_date) {
        errors.from_date = "Select From Date"
    }

    if (values.Leave_Reason) {
        if (values.Leave_Reason.length >= 150) {
            errors.Leave_Reason = "You are exceeding the limit";
        } else if (/^[a-z A-Z]+$/.test(values.Leave_Reason)) {
        } else { errors.Leave_Reason = "Enter valid Reason"; }
    }

    return errors;
}

LeaveManagement = connect(
    state => ({
        values: getFormValues('leaveManagementForm')(state),
    })
)(LeaveManagement)

const selector = formValueSelector('selectingFormValues')
LeaveManagement = connect(
    state => {
        const to_date = selector(state, 'to_date')
        return {
            to_date
        }
    }
)(LeaveManagement)

function mapStateToProps(state) {
    const formState = getFormValues('leaveManagementForm')(state)
    return {
        formState,
        userDetails: state.userInformation,
        LeaveHistory: state.getPendingHistory,
        empLeaveHistory: state.employeeHistory
    };
}

export default reduxForm({
    validate,
    form: 'leaveManagementForm',
})(connect(mapStateToProps, {
    getUserDetails, holidayList,
    leaveBalance,
    approveReject,
    getTypesOfLeaves, applyLeave, empLeaveHistory, leaveList, bulkUpload, getPendingHistory, cancelLeavePrompt, getAllLeaveHistory
})(LeaveManagement));