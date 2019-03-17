import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookies';
import Loader from 'react-loader-advanced';

import { login } from '../../actions';
import './login.scss';


class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginError: false,
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            loaderVisible: false
        };
    }

    generateInput = field => {
        const { meta: { touched, error } } = field;
        const className = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`

        return (
            <div>
                <div className="form-group">
                    <input
                        className={className}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...field.input}
                    />
                    <div >
                        {touched && error ? <div className='text-danger'>{error} <i className='fa fa-exclamation-circle' /></div> : ''}
                    </div>
                </div>
            </div>
        )
    }

    loginOnSubmit = values => {
        const { login, loginCredentials } = this.props;

        this.setState({ loaderVisible: true })
        login(values, (response) => {
            if (response.data.code === 'EMS_001') {
                this.setState({ loaderVisible: false, loginError: false })
                cookie.save('session', response.data.data, { path: '/' });
                // cookie.save('session', true, {path: '/'});                
                window.location.reload();
            } else this.setState({ loginError: true, loaderVisible: false })
        }, error => error ? this.setState({ loginError: true, loaderVisible: false }) : null);
    }

    renderLoginError() {
        const { loginError } = this.state;

        if (loginError) {
            return (
                <p className="alert alert-danger">
                    Invalid Email ID or Password
                <i className="m-1 fa fa-times-circle float-right"
                        onClick={() => this.setState({ loginError: false })} />
                </p >
            )
        }
    }

    render() {
        const { handleSubmit } = this.props;
        const { loaderVisible, spinner } = this.state;

        return (
            <section className="login">
                <Loader show={loaderVisible} message={spinner} />
                <div className='container-fluid'>
                    <div className="row image-wrap"></div>
                    <div className="row">
                        <div className="col-12 col-md-6 text-center">
                            <img className="login-logo" src="src/assets/images/cloudix&jaishu.png" />
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="col-12 col-md-6 offset-md-3">
                                <div className="card-block">
                                    <h2>Login here...</h2>
                                    <div>
                                        {this.renderLoginError()}
                                    </div>
                                    <form onSubmit={handleSubmit(this.loginOnSubmit.bind(this))}>
                                        <Field
                                            placeholder="Email ID"
                                            name="user_name"
                                            type="text"
                                            component={this.generateInput}
                                        />
                                        <Field
                                            placeholder="Password"
                                            name="password"
                                            type="password"
                                            component={this.generateInput}
                                        />
                                        <Link to='/forgot_password' className='customLink align-middle'>forgot password?</Link>
                                        <button type="submit" className="btn btn-sm btn-ems-primary float-right">Log In</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        );
    }
}

function validate(values) {
    const errors = {};
    if (values.user_name) {
        if (/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test(values.user_name)) {
        } else errors.user_name = "Enter valid Email ID";
    }

    if (!values.user_name) errors.user_name = "Enter Email ID";

    if (!values.password) errors.password = "Enter Password";

    return errors;
}

export default reduxForm({
    validate,
    form: 'logInForm'
})(connect(null, { login })(Login));