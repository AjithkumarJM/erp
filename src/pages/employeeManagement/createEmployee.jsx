import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';
import { Link } from 'react-router-dom';
import { Form, FormGroup } from "reactstrap";

import { getDesignationList, getReportingToList, getSystemRole, getPrevEmployeeId, createEmployee } from '../../services/employeeTracker'
import { spinner, alertOptions, genderList } from '../../const';
import FormField from '../../const/form-field';
import { validator } from '../../const/form-field/validator';

class CreateEmployee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false
        };
    }

    componentDidMount = () => {
        const { getDesignationList, getReportingToList, getSystemRole, getPrevEmployeeId } = this.props;

        getDesignationList();
        getReportingToList();
        getSystemRole();
        getPrevEmployeeId();
    }

    notify = (message, type) => this.msg.show(message, { type });

    submitForm = values => {

        const { createEmployee, reset, history } = this.props;
        const { date_of_birth, date_of_joining } = values;

        if (date_of_birth._isValid) return values.date_of_birth = moment(date_of_birth._d).format('YYYY/MM/DD')
        if (date_of_joining._isValid) return values.date_of_joining = moment(date_of_joining._d).format('YYYY/MM/DD')

        Object.keys(values).map(k => values[k] = values[k].toString().trim());

        this.setState({ loader: true })
        createEmployee(values, data => {
            const { code, message } = data.data;
            if (code === 'EMS_001') {
                this.setState({ loader: false })
                reset();
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
        const {
            handleSubmit, reset, pristine, submitting, previousEmpId,
            designationList, systemRoles, reportingToList, systemRoles: { response }
        } = this.props;
        const { loader } = this.state;
        let { required, email, mobile_number } = validator;

        if (previousEmpId.requesting === true) return <Loader show={true} message={spinner} />
        else if (response && response.data) {
            return (
                <div className='p-2'>
                    <Loader show={loader} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <div className='row'>
                        <div className="col-12 page-header">
                            <h2>Add Employee</h2>
                            <Link to='/employee_tracker' className='btn btn-sm btn-ems-navigate float-right'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
                        </div>
                    </div>
                    <div>
                        <Form className='row'>
                            <div className='col-md-6'>
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
                                        list={designationList.response.data}
                                        keyword="id"
                                        option="name"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="System Role"
                                        name="role_id"
                                        fieldRequire={true}
                                        type="select"
                                        list={systemRoles.response.data}
                                        keyword="id"
                                        option="role_name"
                                        validate={[required]}
                                    />

                                </FormGroup>

                            </div>
                            <div className='col-md-6'>
                                <FormGroup>
                                    <FormField
                                        label="Reporting To"
                                        name="reporting_to"
                                        fieldRequire={true}
                                        type="select"
                                        validate={[required]}
                                        list={reportingToList.response.data}
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
                            </div>
                        </Form >
                        <div className="row justify-content-md-center">
                            <button type='submit' onClick={handleSubmit(this.submitForm)} className="btn-spacing btn btn-sm btn-ems-primary" disabled={pristine || submitting}>Add</button>
                            <button type='reset' onClick={reset} disabled={pristine || submitting} className="btn btn-sm btn-ems-clear">Clear</button>
                        </div >
                    </div >
                </div >
            );
        } else return <Loader show={true} message={spinner} />
    }
}

const mapTostateProps = ({ systemRoles, reportingToList, designationList, previousEmpId }) => {
    let initialValues = { id: previousEmpId.response.data }

    return { systemRoles, reportingToList, designationList, initialValues, previousEmpId }
}

CreateEmployee = reduxForm({
    form: 'CreateEmployeeForm',
    enableReinitialize: true
})(CreateEmployee)

export default connect(mapTostateProps, {
    createEmployee, getDesignationList,
    getPrevEmployeeId, getReportingToList, getSystemRole
})(CreateEmployee)