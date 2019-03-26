import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import cookie from 'react-cookies';
import Loader from 'react-loader-advanced';

import { spinner } from '../../const'
import FormField from '../../const/form-field';
import { validator } from '../../const/form-field/validator';
import API_CALL from '../../services';

import './login.scss';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginError: false,
            loader: false
        };
    }

    loginOnsubmit = values => {

        values.grant_type = 'password';
        this.setState({ loader: true, loginError: false })

        // using API_CALL callback because no further use of this login request.
        API_CALL('post', 'login', values, null, response => {
            console.log(response)
            const { data, code } = response.data;
            if (code === 'EMS_001') {
                this.setState({ loader: false, loginError: false })
                cookie.save('session', data, { path: '/' });
                window.location.reload();
            } else this.setState({ loginError: true, loader: false })
        })
        //  error => error ? this.setState({ loginError: true, loader: false }) : null);
    }

    renderLoginError = () => {
        const { loginError } = this.state;

        if (loginError) return <p className="alert alert-danger"> Invalid Email ID or Password <i className="m-1 fa fa-times-circle float-right" onClick={() => this.setState({ loginError: false })} /> </p >
    }

    render() {
        const { handleSubmit } = this.props;
        const { loader } = this.state;
        const { required, email } = validator;

        return (
            <section className="login">
                <Loader show={loader} message={spinner} />
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
                                    <form onSubmit={handleSubmit(this.loginOnsubmit)}>
                                        <FormField
                                            placeholder="Email ID"
                                            name="user_name"
                                            type="text"
                                            validate={[email, required]}
                                            login={true}
                                        />
                                        <FormField
                                            placeholder="Password"
                                            name="password"
                                            type="password"
                                            validate={[required]}
                                            login={true}
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

export default reduxForm({
    form: 'logInForm'
})(connect(null, {})(Login));