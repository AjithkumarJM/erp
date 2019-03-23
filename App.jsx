import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch, HashRouter } from "react-router-dom";
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import "babel-polyfill";
import {
    AppHeader,
} from '@coreui/react';

import Login from './src/pages/Login/login';
import Loader from 'react-loader-advanced';
import ForgotPassword from './src/components/forms/forgotPassword'
import routes from './src/./routes';
import DefaultHeader from './src/components/headers/DefaultHeader';
import SideNav from './src/components/sideBar/sidenav';
import { spinner, userInfo } from './src/const';
import { getUserDetails } from './src/services/userDetails';

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
import 'assets/scss/reactTabs.scss';
import 'react-circular-progressbar/dist/styles.css';
import "react-tabs/style/react-tabs.css";

class App extends Component {

    componentWillMount = () => {

        const { getUserDetails } = this.props;

        if (userInfo) getUserDetails();
        else (cookie.remove('session'))
    }

    ForgotPasswordroute = () => {
        if (!userInfo) {
            return (
                <span>
                    <Route exact path="/" component={Login} />
                    <Route path="/forgot_password" component={ForgotPassword} />
                </span>
            )
        }
    }    

    render() {
        const { userInformation: { requesting, response } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        if (userInfo && response.data) {
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
                                            const { component, path, name, exact, onEnter } = route;

                                            return component ?
                                                <Route
                                                    key={idx} path={path}
                                                    exact={exact}
                                                    name={name}
                                                    render={props => <route.component {...props} />} /> : null;
                                        })}
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

const mapStateToProps = ({ userInformation }) => {
    return { userInformation }
}

export default connect(mapStateToProps, { getUserDetails })(App)