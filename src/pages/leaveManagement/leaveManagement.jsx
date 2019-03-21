import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Row, Col } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { reduxForm, change, formValueSelector } from 'redux-form';
import AlertContainer from 'react-alert'
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getLeaveTypes, getLeaveBalance, alertOptions, postApplyLeave, getUpcomingHolidayList } from '../../services/leaveManagement';
import { userInfo, spinner } from '../../const';
import { validator } from '../../const/form-field/validator';
import FormField from '../../const/form-field';
import LeaveBalance from '../../const/leaveBalance';

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
        let filteredLeavebalance = _.filter(leaveBalance.response.data, type => type.leavetype_id !== 3);

        this.setState({
            upcomingHolidayList: upcomingHolidayList.response.data,
            leaveTypes: gender !== 'Female' ? filteredLeaveType : leaveTypes.response.data,
            leaveBalance: gender !== 'Female' ? filteredLeavebalance : leaveBalance.response.data,
        })
    }

    renderDates = date => `${moment(date).format('dddd')}, ${moment(date).format('ll')}`

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
            <BootstrapTable data={upcomingHolidayList} options={options} version='4' trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">Holiday Name</TableHeaderColumn>
                <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDates} dataAlign="center">Date</TableHeaderColumn>
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
        const { handleSubmit, pristine, reset, submitting, leaveTypes: { requesting } } = this.props;
        const { loader, leaveTypes, upcomingHolidayList, leaveBalance } = this.state;
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
                                    placeholder='Reason for leave'
                                    type='textarea'
                                    name='Leave_Reason'
                                    disable={pristine}
                                    label='Reason'
                                    validate={[required]}
                                />
                            </FormGroup>

                            <div className='float-right'>
                                <button type='submit' className=" btn btn-sm btn-ems-primary btn-spacing" onClick={handleSubmit(this.applyLeave.bind(this))} disabled={pristine || submitting}>Apply</button>
                                <button type='reset' className="btn btn-sm btn-ems-clear" onClick={reset} disabled={pristine || submitting}>Clear</button>
                            </div>

                            <br />
                            <div className='mt-3 pt-3' style={{ borderTop: '1px solid rgba(228, 231, 234, 0.56)' }}>
                                <LeaveBalance leaveBalance={leaveBalance} color='#3e98c7' />
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

    // to set date automatically in TO DATE FIELD.
    let formValues = selector(state, 'leavetype_id')
    return { leaveBalance, leaveTypes, formValues, upcomingHolidayList }
}

LeaveManagement = reduxForm({
    form: 'leaveManagementForm'
})(LeaveManagement)

export default connect(mapStateToProps, {
    getLeaveTypes,
    getLeaveBalance,
    postApplyLeave,
    getUpcomingHolidayList,
})(LeaveManagement);