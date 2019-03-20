import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Row, Col } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import CircularProgressbar from 'react-circular-progressbar';
import { reduxForm, change, formValueSelector } from 'redux-form';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';import moment from 'moment';
import _ from 'lodash';

import { getLeaveTypes, getLeaveBalance, alertOptions, postApplyLeave, getUpcomingHolidayList } from '../../services/leaveManagement';
import { userInfo, spinner } from '../../const';
import FormField from '../../const/form-field';
import { validator } from '../../const/form-field/validator';
import Bulkupload from './leaveBulkupload'

class LeaveManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false
        }
    }

    componentWillMount = () => {
        const { getLeaveTypes, getLeaveBalance, getUpcomingHolidayList } = this.props;
        const { employee_id } = userInfo;

        getLeaveTypes();
        getLeaveBalance(employee_id);
        getUpcomingHolidayList()
    }

    componentWillReceiveProps = ({ leaveTypes, leaveBalance, upcomingHolidayList }) => {
        const { gender } = userInfo;
        let filteredLeaveType = _.filter(leaveTypes.response.data, type => type.leavetype_id !== 3);

        this.setState({
            upcomingHolidayList: upcomingHolidayList.response.data,
            leaveTypes: gender !== 'Female' ? filteredLeaveType : leaveTypes.response.data,
            leaveBalance: leaveBalance.response.data,
        })
    }

    renderDates = date => moment(date).format('YYYY/MM/DD')

    holidayListtable = () => {
        const { upcomingHolidayList } = this.state;

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
            <BootstrapTable data={upcomingHolidayList} maxHeight='200' options={options} version='4' trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">Holiday Name</TableHeaderColumn>
                <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDates} dataAlign="center">Date</TableHeaderColumn>
                <TableHeaderColumn dataField='day' dataAlign="center">Day</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    renderLeaveBalance = () => {
        const { leaveBalance } = this.state;

        let balance = _.map(leaveBalance, balance => {
            console.log(balance)
            return <CircularProgressbar percentage={percentage} text={`${percentage}%`} />
        })
        // const options = {
        //     sizePerPage: 10,  // which size per page you want to locate as default
        //     sizePerPageList: [{
        //         text: '10', value: 10
        //     }, {
        //         text: '25', value: 25
        //     }, {
        //         text: '50', value: 50
        //     }, {
        //         text: '100', value: 100
        //     }],
        //     paginationSize: 3,  // the pagination bar size.
        //     paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        // };

        // return (
        //     <BootstrapTable data={leaveBalance} version='4' options={options} trClassName={this.rowClassNameFormat}>
        //         <TableHeaderColumn isKey dataField='type_name' dataAlign="center">Leave Type</TableHeaderColumn>
        //         <TableHeaderColumn dataField='no_of_days' dataFormat={this.renderDates} dataAlign="center">Balance</TableHeaderColumn>
        //     </BootstrapTable>
        // )
        return balance;
    }

    notify = (message, type) => this.msg.show(message, { type });

    applyLeave = values => {
        const { postApplyLeave, reset } = this.props;
        const { from_date, to_date } = values;
        const { employee_id } = userInfo;

        values.employee_id = employee_id;

        if (from_date._isValid) values.from_date = moment(from_date._d).format('YYYY/MM/DD');
        if (to_date._isValid) values.to_date = moment(to_date._d).format('YYYY/MM/DD');

        this.setState({ loader: true })
        postApplyLeave(values, data => {
            const { code, message } = data.data;
            if (code === 'EMS_001') {
                this.setState({ loader: false })
                this.notify(message, 'success')
                reset();
            } else {
                this.setState({ loader: false })
                this.notify(message, 'success')
            }
        });
    }

    handlechangeFromDate = (e, newValue, previousValue) => {
        const { dispatch, formValues } = this.props;
        let date = moment(newValue._d).format('YYYY/MM/DD');

        if (formValues == 3) dispatch(change('leaveManagementForm', 'to_date', moment(date, "YYYY/MM/DD").add(182, 'days')))
    }

    render() {
        const { handleSubmit, pristine, reset, submitting, leaveTypes: { requesting } } = this.props;
        const { loader, leaveTypes, upcomingHolidayList } = this.state;
        const { required } = validator;

        if (requesting === true) return <Loader show={true} message={spinner} />
        else {
            return (
                < div >
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <Loader show={loader} message={spinner} />
                    <Row className='p-2 pt-3'>
                        <Col md={6} sm={12}>
                            <FormGroup>
                                <FormField
                                    placeholder="Leave type"
                                    name="leavetype_id"
                                    type="select"
                                    list={leaveTypes}
                                    keyword="leavetype_id"
                                    option="type_name"
                                    validate={[required]}
                                />

                                <FormField
                                    label="From Date"
                                    name="from_date"
                                    placeholder="YYYY/MM/DD"
                                    inApplyLeave={true}
                                    excludeDatesList={upcomingHolidayList}
                                    onChange={this.handlechangeFromDate}
                                    disable={pristine}
                                    type="date"
                                    validate={[required]}
                                />

                                <FormField
                                    label="To Date"
                                    name="to_date"
                                    placeholder="YYYY/MM/DD"
                                    inApplyLeave={true}
                                    excludeDatesList={upcomingHolidayList}
                                    onChange={this.handlechangeFromDate}
                                    disable={pristine}
                                    type="date"
                                    validate={[required]}
                                />

                                <FormField
                                    placeholder='Reason for your leave'
                                    type='textarea'
                                    name='Leave_Reason'
                                    disable={pristine}
                                    label='Reason'
                                    validate={[required]}
                                />
                            </FormGroup>

                            <div className='col-md-12'>
                                <div className='float-right'>
                                    <button type='submit' className=" btn btn-sm btn-ems-primary btn-spacing" onClick={handleSubmit(this.applyLeave.bind(this))} disabled={pristine || submitting}>Apply</button>
                                    <button type='reset' className="btn btn-sm btn-ems-clear" onClick={reset} disabled={pristine || submitting}>Clear</button>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} sm={12}>

                            {this.renderLeaveBalance()}
                            <br></br>
                            {this.holidayListtable()}
                        </Col>
                    </Row >
                </div >
            );
        }
    }
}

const selector = formValueSelector('leaveManagementForm')

const mapStateToProps = state => {
    let { leaveBalance, leaveTypes, upcomingHolidayList } = state;

    let formValues = selector(state, 'leavetype_id')
    return { leaveBalance, leaveTypes, formValues, upcomingHolidayList }
}

LeaveManagement = reduxForm({
    form: 'leaveManagementForm'  // a unique identifier for this form
})(LeaveManagement)

export default connect(mapStateToProps, {
    getLeaveTypes,
    getLeaveBalance,
    postApplyLeave,
    getUpcomingHolidayList,
})(LeaveManagement);