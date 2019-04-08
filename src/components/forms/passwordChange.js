import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'

import { spinner, alertOptions, userInfo } from '../../const';
import API_CALL from '../../services';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            loader: false
        }
    }

    renderField = field => {
        const { meta: { touched, error }, usage, input, placeholder } = field;
        const childClassName = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`

        return (
            < div className='form-group row'>
                <label className=" col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                <div className='col-sm-7'>
                    <input
                        disabled={usage}
                        className={childClassName}
                        type="password"
                        placeholder={placeholder}
                        {...input}
                    />
                    <div className="text-help">
                        {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                    </div>
                </div >
            </div>
        );
    }

    renderLoginError = () => {
        const { loginError, message } = this.state;

        if (loginError) {
            return (
                <div>
                    <div className="alert alert-danger text-center" role="alert">
                        {message}
                        <i className="fa fa-times-circle-o float-right" onClick={() => { this.setState({ loginError: false }); }}></i>
                    </div>
                </div>
            );
        }
    }

    notify = (message, type) => this.msg.show(message, { type });

    onPasswordSubmit = values => {
        const { id } = userInfo;
        const { reset } = this.props;

        this.setState({ loader: true })
        values.employee_id = id;
        API_CALL('post', 'changepassword', values, data => {
            const { code, message } = data.data;
            if (code == 'EMS_001') {
                this.setState({ loader: false, loginError: false });
                reset();
                this.notify(message, 'success');
            } else this.setState({ loginError: true, message: message, loader: false });
        }, error => error ? this.setState({ loginError: true }) : null);
    }

    render() {
        const { handleSubmit, pristine, submitting, reset } = this.props;
        const { loader, modal } = this.state;

        return (
            <div>
                <Loader show={loader} message={spinner} />
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                <form className="row">
                    <div className="col-md-12">
                        <Field
                            label='Current Password'
                            type="password"
                            name="oldpassword"
                            placeholder="Enter Current Password"
                            component={this.renderField}
                        />
                    </div>

                    <div className='col-md-12'>
                        <Field
                            label='New Password'
                            type="password"
                            name="new_password"
                            placeholder="Enter New Password"
                            component={this.renderField}
                        />
                    </div>

                    <div className='col-md-12'>
                        <Field
                            label='Confirm Password'
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            component={this.renderField}
                        />
                    </div>
                </form >
                {this.renderLoginError()}
                <div className='float-right'>
                    <button type='submit' disabled={pristine || submitting} onClick={handleSubmit(this.onPasswordSubmit.bind(this))} className="btn mr-1 btn-sm btn-ems-primary" data-dismiss={modal}>Submit</button>
                    <button type="button" disabled={pristine || submitting} className="btn btn-sm btn-ems-clear" onClick={() => {
                        reset();
                        this.setState({ loginError: false });
                    }} >Clear</button></div>
            </div>
        )
    }
}

function validate(values) {
    const errors = {};

    if (!values.oldpassword) {
        errors.oldpassword = "Enter Current Password"
    }

    if (!values.new_password) {
        errors.new_password = "Enter New Password"
    }

    if (!values.confirm_password) {
        errors.confirm_password = "Enter Confirm Password"
    }

    if (values.new_password !== values.confirm_password) {
        errors.confirm_password = "Confirm Password does not match"
    } else { }

    if (values.new_password) {
        if (values.new_password.length < 8) {
            errors.new_password = "Minimum it should have 8 characters"
        }
    }
    if (values.confirm_password) {
        if (values.confirm_password.length < 8) {
            errors.confirm_password = "Minimum it should have 8 characters"
        }
    }
    return errors;
}

export default reduxForm({
    validate,
    form: 'ChangePwdForm',
})(connect(null, {})(ChangePassword));