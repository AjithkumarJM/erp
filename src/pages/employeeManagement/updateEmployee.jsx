import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { Form, FormGroup, Row, Col } from "reactstrap";
import _ from 'lodash';
import moment from 'moment';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';

import { getDesignationList, getReportingToList, getSystemRole, getEmployeeById, updateEmployee } from '../../services/employeeTracker'
import { spinner, alertOptions, genderList } from '../../const';
import FormField from '../../const/form-field';
import { validator } from '../../const/form-field/validator';

class UpdateEmployee extends Component {

    constructor(props) {
        super(props);
        this.state = { loader: false, genderList };
    }

    componentDidMount = () => {
        const { getDesignationList, getReportingToList, getSystemRole, getEmployeeById } = this.props;
        const { employeeId } = this.props.match.params;

        getEmployeeById(employeeId);
        getDesignationList();
        getReportingToList();
        getSystemRole();
    }

    componentWillReceiveProps = ({ systemRoles, reportingToList, designationList }) => {

        if (designationList.response) {
            this.setState({
                // systemRoles: systemRoles.response.data,
                reportingToList: reportingToList.response.data,
                designationList: designationList.response.data,
            })
        }
    }

    notify = (message, type) => this.msg.show(message, { type });

    submitForm = values => {

        const { updateEmployee, history } = this.props;
        const { date_of_birth, date_of_joining } = values;

        if (date_of_birth._isValid) return values.date_of_birth = moment(date_of_birth._d).format('YYYY/MM/DD')
        if (date_of_joining._isValid) return values.date_of_joining = moment(date_of_joining._d).format('YYYY/MM/DD')

        Object.keys(values).map(key => key = key.trim());

        this.setState({ loader: true })
        updateEmployee(values, data => {
            const { code, message } = data.data;
            if (code == 'EMS_001') {
                this.setState({ loader: false })
                this.notify(message, 'success')
                setTimeout(() => history.push('/employee_tracker'), 3000);
            } else {
                this.setState({ loader: false })
                this.notify(message, 'error')
            }
        })
    }

    normalizePhone = value => {
        if (!value) return value;
        const onlyNums = value.replace(/[^\d]/g, '')
        if (onlyNums.length <= 3) return onlyNums
        if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`

        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`
    }

    render() {
        const { handleSubmit, reset, pristine, submitting, employeeById } = this.props;
        const { loader, designationList, systemroles, reportingToList } = this.state;
        let { required, email, mobile_number } = validator;

        if (employeeById.requesting === true) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='p-2'>
                    <Loader show={loader} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <Row>
                        <Col md={12} className="page-header">
                            <h2>Update Employee</h2>
                            <Link to='/employee_tracker' className='btn btn-sm float-right modalBtn'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
                        </Col>
                    </Row>

                    <Form>
                        <Row>
                            <Col sm={12} md={6}>
                                <FormGroup>
                                    <FormField
                                        label="First Name"
                                        name="first_name"
                                        fieldRequire={true}
                                        type="text"
                                        placeholder="Enter the First Name"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="last Name"
                                        name="last_name"
                                        fieldRequire={true}
                                        type="text"
                                        placeholder="Enter the Last Name"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="Employee ID"
                                        name="id"
                                        fieldRequire={true}
                                        type="text"
                                        placeholder="Enter Employee ID"
                                        validate={[required]}
                                        disable={true}
                                    />

                                    <FormField
                                        label="Gender"
                                        name="gender"
                                        fieldRequire={true}
                                        type="select"
                                        list={genderList}
                                        keyword="value"
                                        option="name"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="Date Of Birth"
                                        name="date_of_birth"
                                        placeholder="YYYY/MM/DD"
                                        fieldRequire={true}
                                        type="date"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="Date Of Joining"
                                        name="date_of_joining"
                                        placeholder="YYYY/MM/DD"
                                        fieldRequire={true}
                                        type="date"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="email"
                                        name="email"
                                        placeholder="Eg: someone@cloudix.io"
                                        fieldRequire={true}
                                        type="text"
                                        validate={[email]}
                                    />

                                    <FormField
                                        label="Experience"
                                        name="year_of_experience"
                                        placeholder="Eg : 0.00"
                                        fieldRequire={true}
                                        type="text"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="Designation"
                                        name="designation_id"
                                        fieldRequire={true}
                                        type="select"
                                        list={designationList}
                                        keyword="id"
                                        option="name"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="System Role"
                                        name="role_id"
                                        fieldRequire={true}
                                        type="select"
                                        list={systemroles}
                                        keyword="id"
                                        option="role_name"
                                        validate={[required]}
                                    />

                                </FormGroup>

                            </Col>
                            <Col sm={12} md={6}>

                                <FormGroup>
                                    <FormField
                                        label="Reporting To"
                                        name="reporting_to"
                                        fieldRequire={true}
                                        type="select"
                                        validate={[required]}
                                        list={reportingToList}
                                        keyword='emp_id'
                                        option='emp_name'
                                    />

                                    <FormField
                                        label="Contact #"
                                        name="contact_no"
                                        fieldRequire={true}
                                        type="text"
                                        validate={[mobile_number]}
                                        placeholder='xxx-xxx-xxxx'
                                        normalize={this.normalizePhone}
                                    />

                                    <FormField
                                        label="Blood Group"
                                        name="blood_group"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='Eg: A+'
                                    />

                                    <FormField
                                        label="Bank Account #"
                                        name="bank_account_no"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='Enter Bank Account #'
                                    />

                                    <FormField
                                        label="PAN ID"
                                        name="pan_no"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='Enter PAN ID'
                                    />

                                    <FormField
                                        label="PF ID"
                                        name="pF_no"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='Enter PF ID'
                                    />

                                    <FormField
                                        label="CTC"
                                        name="ctc"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='Enter CTC'
                                    />

                                    <FormField
                                        label="Medical Insurance ID"
                                        name="medical_insurance_no"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='Enter Medical Insurance ID'
                                    />
                                    <FormField
                                        label="Emer. Contact #"
                                        name="emergency_contact_no"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder='xxx-xxx-xxxx'
                                        normalize={this.normalizePhone}
                                    />
                                    <FormField
                                        label="Emer. Contact Person Name"
                                        name="emergency_contact_person"
                                        fieldRequire={false}
                                        type="text"
                                        placeholder="Enter Con. Person name"
                                    />
                                </FormGroup>
                            </Col>
                        </Row >
                        <div className="row justify-content-md-center">
                            <button type='submit' onClick={handleSubmit(this.submitForm.bind(this))} className="mr-2 btn btn-sm btn-ems-primary" disabled={pristine || submitting}>Update</button>
                            <button type='reset' onClick={reset} disabled={pristine || submitting} className="btn btn-sm btn-ems-clear">Clear</button>
                        </div >

                    </Form >

                </div >
            );
        }
    }
}

const mapTostateProps = ({ systemRoles, reportingToList, designationList, employeeById }) => {
    let initialValues = employeeById.response.data;

    if (initialValues) {
        let { date_of_birth, date_of_joining } = initialValues;

        initialValues.date_of_birth = moment(date_of_birth).format('YYYY/MM/DD');
        initialValues.date_of_joining = moment(date_of_joining).format('YYYY/MM/DD');
    }

    return { systemRoles, reportingToList, designationList, initialValues, employeeById }
}

UpdateEmployee = reduxForm({
    enableReinitialize: true,
    form: 'UpdateEmployeeForm',
})(UpdateEmployee)

export default connect(mapTostateProps, { getEmployeeById, updateEmployee, getDesignationList, getReportingToList, getSystemRole })(UpdateEmployee)