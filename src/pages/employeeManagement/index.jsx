import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import { Route, Switch, Redirect } from "react-router-dom";
import { NavTab } from 'react-router-tabs';

import CreateEmployee from './createEmployee';
import EmployeeTracker from './employeeTracker';
import UpdateEmployee from './updateEmployee';
import ActiveEmployees from './activeEmployees';
import InActiveEmployees from './inActiveEmployees';
import EmployeeDetails from './employeeDetails';
import { userInfo } from '../../const';

export default class EmployeeTrackerHome extends Component {

    componentDidMount = () => this.handleNavigation()

    componentDidUpdate = () => this.handleNavigation()

    handleNavigation = () => {
        const { location: { pathname }, history } = this.props;
        const { role_id } = userInfo;

        pathname === '/employee_tracker/' || pathname === '/employee_tracker' ?
            role_id === 3 ? history.push('/employee_tracker/active_employees') : history.push('/employee_tracker/reporting_employees')
            : null
    }

    renderNavLinks = () => {
        const { role_id } = userInfo;
        const { location: { pathname } } = this.props;

        return (
            <div>
                {
                    role_id === 3 && (pathname === '/employee_tracker/active_employees' || pathname === '/employee_tracker/inActive_employees') ?
                        <span>
                            <Col md={12} className="page-header">
                                <h2>Employee Tracker</h2>
                            </Col>

                            <NavTab to="/employee_tracker/active_employees" >Active Employees</NavTab>
                            <NavTab to="/employee_tracker/inActive_employees">In Active Employees</NavTab>
                            <Link to='/employee_tracker/create_employee' className='btn btn-ems-ternary btn-sm float-right m-2'>Add Employee <i className="ml-2 fa fa-plus-circle"></i></Link>
                        </span> : null
                }
            </div>
        )
    }

    render() {
        return (
            <div>

                {this.renderNavLinks()}

                <Switch>
                    <Route path='/employee_tracker/create_employee' render={(props) => <CreateEmployee {...props} />} />
                    <Route path='/employee_tracker/update_employee/:employeeId' render={(props) => <UpdateEmployee {...props} />} />
                    <Route path='/employee_tracker/info/:employeeId' render={(props) => <EmployeeDetails {...props} />} />
                    <Route path='/employee_tracker/active_employees' render={(props) => <ActiveEmployees {...props} />} />
                    <Route path='/employee_tracker/inActive_employees' render={(props) => <InActiveEmployees {...props} />} />
                    <Route path='/employee_tracker/reporting_employees' render={(props) => <EmployeeTracker {...props} />} />

                    <Redirect to='/employee_tracker' />
                </Switch>
            </div>
        );
    }
}