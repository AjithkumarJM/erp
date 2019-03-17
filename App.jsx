import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch, HashRouter } from "react-router-dom";
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import "babel-polyfill";
import {
    AppHeader,
} from '@coreui/react';

import { placeholderApi } from './src/./actions';
import Login from './src/pages/Login/login';
import Loader from 'react-loader-advanced';
import ForgotPassword from './src/components/forms/forgotPassword'
import routes from './src/./routes';
import DefaultHeader from './src/components/headers/DefaultHeader';
import SideNav from './src/components/sideBar/sidenav';

import 'jquery';
import 'bootstrap';
import 'assets/scss/bootstrap.scss';
import 'assets/scss/core_ui.scss';
import 'assets/scss/bootstraptable.scss';
import 'assets/common_styles/style.scss';
import 'assets/scss/styles.scss';
import 'assets/scss/react_datepicker.scss';
import 'assets/scss/react-timeline.scss';
import 'assets/scss/timeline_min.scss';



class App extends Component {

    componentWillMount = () => this.setState({ isSession: cookie.load('session') });

    componentDidMount = () => {
        const { placeholderApi } = this.props;

        placeholderApi(response => this.setState({ previousEmployeeId: { id: response.data.data } }))
    }

    ForgotPasswordroute() {
        if (!this.state.isSession) {
            return (
                <span>
                    <Route exact path="/" component={Login} />
                    <Route path="/forgot_password" component={ForgotPassword} />
                </span>
            )
        }
    }

    render() {
        const { isSession } = this.state;
        const spinner = <div className="lds-ripple"><div></div><div></div></div>

        if (isSession === 1) {
            <Loader show={true} message={spinner} />
        }

        if (isSession) {
            return (
                <BrowserRouter>
                    <div className="app">
                        <AppHeader fixed>
                            <DefaultHeader />
                        </AppHeader>
                        <div className="app-body">
                            <SideNav />
                            <main className="main">
                                <div className="p-2">
                                    <Switch>
                                        {routes.map((route, idx) => {
                                            return route.component ?
                                                (<Route
                                                    key={idx} path={route.path}
                                                    exact={route.exact}
                                                    name={route.name}
                                                    render={props => {
                                                        // to send the last added employee id props to Create Employee Form Component
                                                        if (route.name === 'create_employee') {
                                                            return (
                                                                <route.component initialValues={this.state.previousEmployeeId} {...props} />
                                                            )
                                                        }
                                                        return (<route.component {...props} />)
                                                    }} />) : (null);
                                        },
                                        )}
                                        <Redirect from="/" to="/dashboard" />
                                    </Switch>
                                </div>
                            </main>
                        </div>
                    </div>
                </BrowserRouter>
            );
        } else {
            return (
                <BrowserRouter>
                    <div>
                        {this.ForgotPasswordroute()}
                    </div>
                </BrowserRouter>

            );
        }
    }
}

export default connect(null, { placeholderApi })(App);
