import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col } from 'reactstrap';

import { getEmployeeById } from '../../services/employeeTracker';
import { getLeaveBalance } from '../../services/leaveManagement';
import { spinner } from '../../const';
import { userInfo } from '../../const'
import LeaveBalance from '../../const/leaveBalance/index';

class ClientDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { employeeById: {} }
    }

    componentDidMount = () => {
        const { getEmployeeById, getLeaveBalance } = this.props;
        const { employeeId } = this.props.match.params;

        getEmployeeById(employeeId);
        getLeaveBalance(employeeId);
    }

    componentWillReceiveProps = ({ employeeById, leaveBalance }) => {
        let filteredLeaveBalance = _.filter(leaveBalance.response.data, type => type.leavetype_id !== 3)

        if (employeeById.response.data) {
            this.setState({
                employeeById: employeeById.response.data,
                leaveBalance: employeeById.response.data.gender === 'Male' ? filteredLeaveBalance : leaveBalance.response.data
            })
        }
    }

    render() {
        const { employeeById: { requesting } } = this.props;
        const { employeeById, leaveBalance } = this.state;

        if (requesting === true) return <Loader show={true} message={spinner} />
        else if (employeeById) {
            let { role_id } = userInfo;
            let { first_name, last_name, role_name, gender, id
                , date_of_birth, date_of_joining, ctc, designation, reportingto_name, year_of_experience,
                contact_no, email, blood_group, pan_no, pF_no, emergency_contact_no,
                emergency_contact_person, bank_account_no, medical_insurance_no } = employeeById;

            return (
                <div className='p-2'>
                    <div className="shadow p-3 mb-3 bg-white rounded">
                        <Row>
                            <Col md={3} className='align-self-center'>
                                <div className='text-center'>
                                    <img src={`/src/assets/images/${gender === 'Male' ? 'userMaleLogo' : 'userFemaleLogo'}.png`} height='130' width='130' />
                                    <h5 className='text-muted font-weight-bold mt-2'>{first_name} {last_name} <span className='h6'>
                                        ({id})
                                                    </span></h5>
                                    <p className='text-muted'>{role_name}</p>

                                </div>
                            </Col>

                            <div className='col-md-9 align-self-center'>
                                <Row>
                                    <Col md={3}>
                                        <small className='text-muted'><i className='fa fa-briefcase' /> DESIGNATION</small>
                                        <p className='text-custom-info font-weight-bold'> {designation}</p>
                                    </Col>

                                    <Col md={3}>
                                        <small className='text-muted'><i className='fa fa-undo-alt' /> REPORTING TO</small>
                                        <p className='text-custom-info font-weight-bold'> {reportingto_name}</p>
                                    </Col>

                                    <Col md={3}>
                                        <small className='text-muted'><i className='fa fa-calendar-alt' /> DATE OF JOINING</small>
                                        <p className='text-custom-info font-weight-bold'> {moment(date_of_joining).format('YYYY/MM/DD')}</p>
                                    </Col>

                                    <Col md={3}>
                                        <small className='text-muted'><i className='fa fa-money-bill-alt' /> EXPERIENCE</small>
                                        <p className='text-custom-info font-weight-bold'> {year_of_experience}</p>
                                    </Col>

                                    {(() => {
                                        if (contact_no) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-phone' /> CONTACT #</small>
                                                    <p className='text-custom-info font-weight-bold'> {contact_no}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (email) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-envelope' /> EMAIL</small>
                                                    <p className='text-custom-info font-weight-bold'> {email}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (date_of_birth) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-birthday-cake' /> DATE OF BIRTH</small>
                                                    <p className='text-custom-info font-weight-bold'> {moment(date_of_birth).format('YYYY/MM/DD')}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (blood_group) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-tint' /> BLOOD GROUP</small>
                                                    <p className='text-custom-info font-weight-bold'> {blood_group}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (bank_account_no && role_id === 3) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-university' /> BANK ACCOUNT #</small>
                                                    <p className='text-custom-info font-weight-bold'> {bank_account_no}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (pan_no && role_id === 3) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-id-card' /> PAN #</small>
                                                    <p className='text-custom-info font-weight-bold'> {pan_no}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (pF_no && role_id === 3) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-clipboard-list' /> PF #</small>
                                                    <p className='text-custom-info font-weight-bold'> {pF_no}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (ctc && role_id === 3) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-money-bill-alt' /> CTC</small>
                                                    <p className='text-custom-info font-weight-bold'> {ctc}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (medical_insurance_no) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-hospital' /> MEDICAL INSURANCE</small>
                                                    <p className='text-custom-info font-weight-bold'>  {medical_insurance_no}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (emergency_contact_no) {
                                            return (
                                                <Col md={3}>
                                                    <small className='text-muted'><i className='fa fa-phone-square' /> EMERGENCY CONTACT #</small>
                                                    <p className='text-custom-info font-weight-bold'>  {emergency_contact_no}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    {(() => {
                                        if (emergency_contact_person) {
                                            return (
                                                <div className='col-4'>
                                                    <small className='text-muted'><i className='fa fa-user' /> EMERGENCY CONTACT PERSON</small>
                                                    <p className='text-custom-info font-weight-bold'> {emergency_contact_person}</p>
                                                </div>
                                            )
                                        }
                                    })()}

                                </Row>
                            </div>
                        </Row>
                    </div>
                    <Row>
                        <Col md={5} className='shadow p-3 mb-3 bg-white rounded ml-3'><LeaveBalance leaveBalance={leaveBalance} color='rgb(84, 145, 135)' /></Col>
                    </Row>
                </div>
            );
        }
    }
}

const mapStateToProps = ({ employeeById, leaveBalance }) => {

    return { employeeById, leaveBalance }
}

export default connect(
    mapStateToProps, { getEmployeeById, getLeaveBalance }
)(ClientDetails);