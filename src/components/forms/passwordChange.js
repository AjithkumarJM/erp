import React, { Component } from 'react';
import { changePassword } from '../../actions';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            loader: {
                visible: false,
            },
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
        }
    }

    renderField(field) {
        const { meta: { touched, error } } = field;
        const childClassName = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`

        return (
            < div className='form-group row' >
                <label className=" col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                <div className='col-sm-7'>
                    <input
                        disabled={field.usage}
                        className={childClassName}
                        type="password"
                        placeholder={field.placeholder}
                        {...field.input}
                    />
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
                <div className='alert-wrap'>
                    <div className="alert alert-danger text-center" role="alert">
                        {this.state.message}
                        <i className="fa fa-times-circle-o float-right" onClick={() => { this.setState({ loginError: false }); }}></i>
                    </div>
                </div>
            );
        }
    }

    passwordSubmit(values) {
        this.setState({ loader: { visible: true } })
        values.employee_id = this.props.userDetails.id;
        this.props.changePassword(values, values.employee_id, (data) => {
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false }, loginError: false });
                setTimeout(() => {
                    this.props.reset();                    
                    this.msg.show(data.data.message, {
                        type: 'success',
                        theme: 'dark',
                        time: 3000
                    })
                }, 100)
            } else {
                this.setState({
                    loginError: true,
                    message: data.data.message,
                    loader: { visible: false }
                });
            }
        }, (error) => {
            if (error) {
                this.setState({ loginError: true });
            }
        });
    }

    render() {
        const { handleSubmit, pristine, submitting } = this.props;
        const { loader, spinner } = this.state;

        return (
            <div>
                <Loader show={loader.visible} message={spinner} />
                <AlertContainer ref={a => this.msg = a} />
                <form className="row">
                    <div className="col-md-12">
                        <Field
                            label='Current Password'
                            type="password"
                            name="oldpassword"
                            component={this.renderField}
                            placeholder="Enter Current Password"
                        />
                    </div>

                    <div className='col-md-12'>
                        <Field
                            label='New Password'
                            type="password"
                            name="new_password"
                            component={this.renderField}
                            placeholder="Enter New Password"
                        />
                    </div>

                    <div className='col-md-12'>
                        <Field
                            label='Confirm Password'
                            type="password"
                            name="confirm_password"
                            component={this.renderField}
                            placeholder="Confirm Password"
                        />
                    </div>
                </form >
                {this.renderLoginError()}
                <div className='float-right'>
                    <button type='submit' disabled={pristine || submitting} onClick={handleSubmit(this.passwordSubmit.bind(this))} className="btn btn-spacing btn-sm btn-ems-primary" data-dismiss={this.state.modal}>Submit</button>
                    <button type="button" disabled={pristine || submitting} className="btn btn-sm btn-ems-clear" onClick={() => {
                        this.props.reset();
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

function mapStateToProps(state) {
    return {
        userDetails: state.userData
    };
}

export default reduxForm({
    validate,
    form: 'ChangePwdForm',
})(connect(mapStateToProps, {
    changePassword
})(ChangePassword));