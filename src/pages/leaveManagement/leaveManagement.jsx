import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { reduxForm, change, formValueSelector } from 'redux-form';
import AlertContainer from 'react-alert'
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getLeaveTypes, getLeaveBalance, alertOptions, postApplyLeave, getUpcomingHolidayList } from '../../services/leaveManagement';
import { userInfo, spinner, tableOptions } from '../../const';
import { validator } from '../../const/form-field/validator';
import FormField from '../../const/form-field';
import LeaveBalance from '../../const/leaveBalance';

import './style.scss';

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

    renderDates = date => `${moment(date).format('ddd, MMM Do YY')}`

    holidayListtable = () => {
        const { data } = this.props.upcomingHolidayList.response;

        return (
            <BootstrapTable data={data} maxHeight='500' options={tableOptions} version='4' >
                <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">HOLIDAY NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDates} dataAlign="center">DATE</TableHeaderColumn>
            </BootstrapTable>
        )
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
                this.notify(message, 'error')
            }
        });
    }

    handlechangeFromDate = (e, newValue, previousValue) => {
        const { dispatch, formValues } = this.props;
        let date = moment(newValue._d).format('YYYY/MM/DD');

        if (formValues == 3) dispatch(change('leaveManagementForm', 'to_date', moment(date, "YYYY/MM/DD").add(182, 'days')))
    }

    render() {
        const { handleSubmit, pristine, reset, submitting, leaveBalance,
            upcomingHolidayList: { requesting, response }, leaveTypes } = this.props;
        const { loader } = this.state;
        const { required } = validator;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                < div >
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <Loader show={loader} message={spinner} />
                    <Row className='p-2 pt-3'>
                        <Col md={6} sm={12}>
                            <div className='p-3 bg-white shadow'>
                                <div className='badge p-3 tex-white w-100 font-weight-normal manageLeavestyling'>Manage Leaves</div>
                                <div className='mt-3'>
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
                                        excludeDatesList={response.data}
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
                                        excludeDatesList={response.data}
                                        onChange={this.handlechangeFromDate}
                                        disable={pristine}
                                        type="date"
                                        validate={[required]}
                                    />

                                    <FormField
                                        placeholder='Reason for leave'
                                        type='textarea'
                                        name='Leave_Reason'
                                        disable={pristine}
                                        label='Reason'
                                        validate={[required]}
                                    />

                                    <div className='float-right'>
                                        <button type='submit' className=" btn btn-sm btn-ems-primary mr-1" onClick={handleSubmit(this.applyLeave.bind(this))} disabled={pristine || submitting}>Apply</button>
                                        <button type='reset' className="btn btn-sm btn-ems-clear" onClick={reset} disabled={pristine || submitting}>Clear</button>
                                    </div>
                                    <br />
                                    <div className='mt-3 pt-3' style={{ borderTop: '1px solid rgba(228, 231, 234, 0.56)' }}>
                                        <LeaveBalance leaveBalance={leaveBalance} color='#3e98c7' />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
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
    const { gender } = userInfo;
    let filteredLeaveType = _.filter(leaveTypes.response.data, type => type.leavetype_id !== 3);
    let filteredLeavebalance = _.filter(leaveBalance.response.data, type => type.leavetype_id !== 3);

    // to set date automatically in TO DATE FIELD when selecting ML.
    let formValues = selector(state, 'leavetype_id')
    return {
        leaveBalance: gender === 'Male' ? filteredLeavebalance : leaveBalance.response.data,
        leaveTypes: gender === 'Male' ? filteredLeaveType : leaveTypes.response.data,
        formValues,
        upcomingHolidayList
    }
}

LeaveManagement = reduxForm({ form: 'leaveManagementForm' })(LeaveManagement);

export default connect(mapStateToProps, {
    getLeaveTypes,
    getLeaveBalance,
    postApplyLeave,
    getUpcomingHolidayList,
})(LeaveManagement);