import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forgotPassword, tokenValidation, resetPasswordRequest } from '../../actions'
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Loader from 'react-loader-advanced';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: {
                visible: false,
            },
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            loginError: false,
            toggleForgotPassword: false,
            alertOptions: {
                offset: 14,
                position: 'bottom right',
                theme: 'dark',
                time: 5000,
                transition: 'scale'
            },
            resetToggle: false,
            toggle: false
        };
    }

    submit(values) {
        this.setState({ loader: { visible: true } })
        this.props.forgotPassword(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.props.reset();
                this.setState({ loader: { visible: false }, toggleForgotPassword: true, disabled: true })
            } else {
                this.setState({ loader: { visible: false }, loginError: true, disabled: false })
            }
        })
    }

    renderField(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group row ${touched && error ? 'is-invalid' : ''}`
        if (field.type == 'password') {
            return (
                < div className={className} >
                    <div className='col-sm-12'>
                        <input
                            disabled={field.usage}
                            className="form-control form-control-sm"
                            type="password"
                            placeholder={field.placeholder}
                            {...field.input} />
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div >
                </div>
            )
        }
        return (
            < div className={className} >
                <div className='col-sm-12'>
                    <input
                        disabled={field.usage}
                        className="form-control form-control-sm"
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

    renderLoginError() {
        if (this.state.loginError) {
            return (
                <p className="alert alert-danger">
                    Invalid Email ID
                    <i className="login-validate-msg-wrap fa fa-times-circle-o float-right" onClick={() => { this.setState({ loginError: false }); }}></i>
                </p>
            )
        }
    }

    resetPassword(values) {
        let token = this.props.location.search.split("?token=")
        values.token = token[1]
        this.setState({ loader: { visible: true } })
        this.props.resetPasswordRequest(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.props.reset();
                this.setState({ loader: { visible: false }, resetToggle: false })
            } else {
                this.setState({ loader: { visible: false }, disabled: false })
            }
        })
    }

    renderMsg() {
        const { handleSubmit, pristine, submitting } = this.props;
        const { disabled, toggleForgotPassword, resetToggle, toggle } = this.state;

        if (!this.props.location.search) {
            return (
                <div className="card-block">
                    <h4>Forgot Your Password?</h4>
                    <div>
                        {this.renderLoginError()}
                    </div>
                    <form onSubmit={handleSubmit(this.submit.bind(this))} className='customHeight'>
                        <Field
                            placeholder="Enter your email"
                            name="employee_email"
                            type="user_name"
                            usage={disabled}
                            component={this.renderField}
                        />
                        <button type="submit" className="btn btn-sm btn-ems-primary float-right" disabled={pristine || submitting}>Submit</button>
                    </form>
                    <div className={toggleForgotPassword != true ? 'hide' : 'display'}>
                        <p className="alert alert-success">Please check your email and find the link to reset your password</p></div>
                </div>
            )
        } else {
            let token = this.props.location.search.split("?token=")
            let validateToken = { token: token[1] }
            window.onload = () => {
                this.props.tokenValidation(validateToken, (data) => {
                    data.data.code == 'EMS_001' ? this.setState({ toggle: true, resetToggle: true }) : this.setState({ toggle: false, resetToggle: true })
                })
            }
            if (resetToggle == true) {
                if (toggle == true) {
                    return (
                        <div className="card-block">
                            <h5>Reset your password here...</h5>
                            <div>
                                {this.renderLoginError()}
                            </div>
                            <form onSubmit={handleSubmit(this.resetPassword.bind(this))}>
                                <Field
                                    placeholder="New Password"
                                    name="new_password"
                                    type="password"
                                    usage={disabled}
                                    component={this.renderField}
                                />
                                <Field
                                    placeholder="Confirm Password"
                                    name="confirm_password"
                                    type="password"
                                    usage={disabled}
                                    component={this.renderField}
                                />
                                <button type="submit" className="btn btn-sm btn-ems-primary float-right" disabled={pristine || submitting}>Reset</button>
                            </form>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <p className="alert alert-danger">Token expired please try again.</p>
                            <Link to='/forgot_password' className="btn btn-sm btn-ems-primary float-right">Try again</Link>
                        </div>
                    )
                }
            } else {
                return (
                    <div>
                        <p className="alert alert-success">Your password has been reset successfully click<span>
                            <Link to='/' className='resetCustomLink'> here</Link> to login
                        </span></p>

                    </div>
                )
            }
        }
    }

    render() {
        const { loader, spinner } = this.state;
        return (
            <section className="login">
                <Loader show={loader.visible} message={spinner} />
                <div className="container-fluid">
                    <div className="row image-wrap"></div>
                    <div className="row">
                        <div className="col-12 col-md-6 text-center">
                            <img className="login-logo" src="src/assets/images/cloudix&jaishu.png" />
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="col-12 col-md-6 offset-md-3">
                                {this.renderMsg()}
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}

function validate(values) {
    const errors = {};

    if (!values.employee_email) {
        errors.employee_email = "Enter Email ID"
    }

    if (values.employee_email) {
        if (/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test(values.employee_email)) {
        } else {
            errors.employee_email = "Enter valid Email ID;"
        }
        if (values.employee_email.length >= 30) {
            errors.employee_email = "you've crossed the maximum limit of characters"
        }
    }

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
    form: 'forgotPasswordForms',
})(connect(null, { forgotPassword, tokenValidation, resetPasswordRequest })(ForgotPassword));