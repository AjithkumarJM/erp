import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createPost, designation, systemRole, reportingTo, placeholderApi } from '../../actions';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';
import { Link } from 'react-router-dom';

class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _notify: null,
            designation: [],
            systemrole: [],
            reportingto: [],
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
        this.dropDownApis();
    }

    dropDownApis(values) {

        this.props.designation(values, (data) => {
            this.setState({ designation: data.data.data });
        })
        this.props.reportingTo(values, (data) => {
            this.setState({ reportingto: data.data.data });
        })
        this.props.systemRole((data) => {
            this.setState({ systemrole: data.data.data });
        })
    }

    renderField(field) {
        const { meta: { touched, error } } = field;
        const parentClassName = `form-group row`
        const childClassName = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`

        if (field.type === 'dropDown') {
            let optionList = _.map(field.list, data => {
                return <option key={data.$id} value={data[field.id]}>{data[field.displayName]}</option>;
            })
            return (
                <div className={parentClassName}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <select className={childClassName} {...field.input}>
                            <option value="">Select</option>
                            {optionList}
                        </select>
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        } else if (field.type === 'gender') {
            return (
                <div className={parentClassName}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <select className={childClassName} {...field.input} disabled={field.usage}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        } else if (field.type === 'empType') {
            return (
                <div className={parentClassName}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <select className={childClassName} {...field.input} disabled={field.usage}>
                            <option value="">Select</option>
                            <option value="FTE">Full Time Employee</option>
                            <option value="C2C">Contract Employee</option>
                        </select>
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        } else if (field.type === 'dob') {
            return (
                <div className={parentClassName}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <DatePicker
                            className={childClassName} {...field.input}
                            dateFormat='YYYY/MM/DD'
                            placeholderText='YYYY/MM/DD'
                            withPortal
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
        } return (
            < div className={parentClassName} >
                <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                <div className='col-sm-7'>
                    <input
                        value={field.value}
                        disabled={field.disable}
                        className={childClassName}
                        type="text"
                        placeholder={field.placeholder}
                        {...field.input} />
                    <div className="text-help">
                        {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                    </div>
                </div >
            </div>
        );
    }

    submitForm(values) {
        if (values.date_of_birth._isValid) {
            values.date_of_birth = moment(values.date_of_birth._d).format('YYYY/MM/DD')
        }
        if (values.date_of_joining._isValid) {
            values.date_of_joining = moment(values.date_of_joining._d).format('YYYY/MM/DD')
        }
        Object.keys(values).map(function (key, index) {
            let trim = values[key]
            key = key.trim()
        });

        this.setState({ loader: { visible: true } })
        this.props.createPost(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false } })
                this.props.reset();
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 3000
                })
                setTimeout(() => {
                    // <Link to='\employee_tracker' />
                    // this.props.history.push('./employee_tracker')
                    window.location.href = '/employee_tracker';
                }, 3000);
            } else {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'error',
                    theme: 'dark',
                    time: 5000
                })
            }
        })
    }

    normalizePhone(value) {
        if (!value) {
            return value
        }

        const onlyNums = value.replace(/[^\d]/g, '')
        if (onlyNums.length <= 3) {
            return onlyNums
        }
        if (onlyNums.length <= 7) {
            return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
        }
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(
            6,
            10
        )}`
    }

    goback() {
        this.props.reset();
        this.props.callback();
    }

    renderOnchange(e) {
        const val = e.target.value;
        this.props.placeholderApi(val, (data) => {
            this.props.change('id', data.data.data)
        })
    }

    render() {
        const { handleSubmit, reset, pristine, submitting } = this.props;
        const { loader, spinner, alertOptions, designation, systemrole, reportingto } = this.state;

        return (
            <div>
                <Loader show={loader.visible} message={spinner} />
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                <div className='row'>
                    <div className="col-12 page-header">
                        <h2>Add Employee</h2>
                        <Link to='/employee_tracker' className='btn btn-sm float-right modalBtn'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
                    </div>
                </div>
                <div>
                    <form className="row">
                        <div className='col-md-6'>
                            <Field
                                label={<div><span className='text-danger'>*</span> First Name</div>}
                                name="first_name"
                                component={this.renderField}
                                placeholder="Enter the First Name"
                            />
                            <Field
                                label={<div><span className='text-danger'>*</span> Last Name</div>}
                                name="last_name"
                                component={this.renderField}
                                placeholder="Enter the Last Name"
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Employee Type</div>}
                                type="empType"
                                name="emp_type"
                                component={this.renderField}
                                onChange={this.renderOnchange.bind(this)}
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Employee ID</div>}
                                name="id"
                                component={this.renderField}
                                disable={true}
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Gender</div>}
                                type="gender"
                                name="gender"
                                component={this.renderField}
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Date Of Birth</div>}
                                type='dob'
                                name="date_of_birth"
                                component={this.renderField}
                                placeholder="YYYY/MM/DD"
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Date Of Joining</div>}
                                type='dob'
                                name="date_of_joining"
                                component={this.renderField}
                                placeholder="YYYY/MM/DD"
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Email</div>}
                                name="email"
                                component={this.renderField}
                                placeholder="Eg: someone@cloudix.io"
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Experience</div>}
                                name="year_of_experience"
                                component={this.renderField}
                                placeholder="Eg : 0.00"
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> Designation</div>}
                                type="dropDown" //api
                                id='id'
                                parse={this.parse}
                                displayName='name'
                                name="designation_id"
                                list={designation}
                                component={this.renderField}
                            />

                            <Field
                                label={<div><span className='text-danger'>*</span> System Role</div>}
                                type='dropDown' //api
                                name='role_id'
                                id='id'
                                displayName='role_name'
                                list={systemrole}
                                component={this.renderField}
                            />

                        </div>
                        <div className='col-md-6'>
                            <Field
                                label={<div><span className='text-danger'>*</span> Reporting To</div>}
                                type="dropDown" //api
                                name='reporting_to'
                                id='emp_id'
                                displayName='emp_name'
                                list={reportingto}
                                component={this.renderField}
                            />
                            <Field
                                label={<div><span className='text-danger'>*</span> Contact #</div>}
                                name="contact_no"
                                component={this.renderField}
                                placeholder="xxx-xxx-xxxx"
                                normalize={this.normalizePhone}
                            />
                            <Field
                                label="Blood Group"
                                placeholder="Eg :  A+"
                                name="blood_group"
                                component={this.renderField}
                            />

                            <Field
                                label="Bank Account #"
                                name="bank_account_no"
                                component={this.renderField}
                                placeholder="Enter Bank Account #"
                            />

                            <Field
                                label="PAN ID"
                                name="pan_no"
                                component={this.renderField}
                                placeholder="Enter PAN ID"
                            />

                            <Field
                                label="PF ID"
                                name="pF_no"
                                component={this.renderField}
                                placeholder="Enter PF ID"
                            />

                            <Field
                                label="CTC"
                                name="ctc"
                                component={this.renderField}
                                placeholder='Enter CTC'
                            />

                            <Field
                                label="Medical Insurance ID"
                                name="medical_insurance_no"
                                component={this.renderField}
                                placeholder="Enter Medical Insurance ID"
                            />

                            <Field
                                label="Emer. Contact #"
                                name="emergency_contact_no"
                                component={this.renderField}
                                placeholder="xxx-xxx-xxxx"
                                normalize={this.normalizePhone}
                            />
                            <Field
                                label="Emer. Contact Person Name"
                                name="emergency_contact_person"
                                component={this.renderField}
                                placeholder="Enter Con. Person name"
                            />
                        </div>
                        {/* <div className='col-12'><p><span className='text-danger'>*</span> Mandatory fields </p></div> */}
                    </form >
                    <div className="row justify-content-md-center">
                        <div >
                            <button type='submit' onClick={handleSubmit(this.submitForm.bind(this))} className="btn-spacing btn btn-sm btn-ems-primary" disabled={pristine || submitting}>Add</button>
                        </div>
                        <div >
                            <button type='reset' onClick={reset} disabled={pristine || submitting} className="btn btn-sm btn-ems-clear">Clear</button>
                        </div>
                    </div >
                </div >
            </div >
        );
    }
}

function validate(values) {
    const errors = {};

    if (!values.emp_type) {
        errors.emp_type = "Select Employee Type"
    }

    if (!values.first_name) {
        errors.first_name = "Enter First Name"
    }

    if (!values.last_name) {
        errors.last_name = "Enter Last Name"
    }

    if (!values.date_of_birth) {
        errors.date_of_birth = "Enter Date of Birth"
    }

    if (!values.date_of_joining) {
        errors.date_of_joining = "Enter Date of Joining"
    }

    if (!values.gender) {
        errors.gender = "Select Gender"
    }

    if (!values.designation_id) {
        errors.designation_id = "Select Designation"
    }

    if (!values.role_id) {
        errors.role_id = "Select System Role"
    }

    if (!values.reporting_to) {
        errors.reporting_to = "Select Reporting To"
    }
    if (!values.contact_no) {
        errors.contact_no = "Enter Contact #"
    }

    // if (!values.id) {
    //     errors.id = "Enter Employee "
    // }

    if (!values.year_of_experience) {
        errors.year_of_experience = "Enter Years of Experience"
    }

    if (values.id) {
        if (/^[0-9]+$/.test(values.id)) {
        } else {
            errors.id = "Enter valid Employee ID"
        }
    }

    if (values.year_of_experience) {
        if (values.year_of_experience.length > 5) {
            errors.year_of_experience = "Enter valid Years of Experience";
        } else if (/^[0-9 .]+$/.test(values.year_of_experience)) {
        } else { errors.year_of_experience = "Enter valid Years of Experience"; }
    }

    if (values.blood_group) {
        if (/^(A|A1|B1|B|AB|O)[+-]$/.test(values.blood_group)) {
        } else {
            errors.blood_group = "Enter valid Blood Group";
        }
    }

    if (values.first_name) {
        if (values.first_name.length >= 30) {
            errors.first_name = "Enter valid First Name";
        } else if (/^[a-z A-Z]+$/.test(values.first_name)) {
        } else { errors.first_name = "Enter valid First Name"; }
    }


    if (values.emergency_contact_person) {
        if (values.emergency_contact_person.length >= 30) {
            errors.emergency_contact_person = "Enter Valid Name";
        } else if (/^[a-z A-Z]+$/.test(values.emergency_contact_person)) {
        } else {
            errors.emergency_contact_person = "Enter Valid Name";
        }
    }

    if (values.last_name) {
        if (values.last_name.length >= 30) {
            errors.last_name = "Enter valid Last Name";
        } else if (/^[a-z A-Z]+$/.test(values.last_name)) {
        } else {
            errors.last_name = "Enter valid Last Name";
        }
    }

    if (values.pF_no) {
        if (values.pF_no.length >= 25) {
            errors.pF_no = "Enter valid PF ID";
        } else if (/^[a-z A-Z 0-9 _.-]*$/.test(values.pF_no)) {
        } else {
            errors.pF_no = "Enter valid PF ID";
        }
    }

    if (!values.email) {
        errors.email = "Enter Email ID"
    }

    if (values.email) {
        if (/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test(values.email)) {
        } else {
            errors.email = "Enter valid Email ID";
        }
        if (values.email.length >= 30) {
            errors.email = "you've crossed the maximum limit of characters";
        }
    }

    if (values.ctc) {
        if (/^[0-9]+$/.test(values.ctc)) {
        } else { errors.ctc = "Enter valid CTC"; }
        // if (/^[0-9]*$/.test(values.ctc.length == 1)) {
        // } else { errors.ctc = "Enter valid CTC"; }
    }

    if (values.bank_account_no) {
        if (/^[0-9]+$/.test(values.bank_account_no)) {
        } else {
            errors.bank_account_no = "Enter valid Bank Account #";
        }
        if (values.bank_account_no.length >= 13) {
            errors.bank_account_no = "Enter valid Bank Account #";
        }
    }

    if (values.pan_no) {
        if (/^[0-9 a-z A-Z]+$/.test(values.pan_no)) {
        } else {
            errors.pan_no = "Enter valid PAN ID";
        }
        if (values.pan_no.length >= 11) {
            errors.pan_no = "Enter valid PAN ID";
        }
    }

    if (values.medical_insurance_no) {
        if (values.medical_insurance_no.length >= 25) {
            errors.medical_insurance_no = "Enter Valid Medical Insurance ID";
        }
        if (/^[0-9 a-z A-Z]+$/.test(values.medical_insurance_no)) {
        } else {
            errors.medical_insurance_no = "Enter valid Medical Insurance ID";
        }
    }
    return errors;
}

export default reduxForm({
    validate,
    enableReinitialize: true,
    form: 'PostsNewForm'
})(
    connect(null, { createPost, designation, systemRole, reportingTo, placeholderApi })(Employee)
);