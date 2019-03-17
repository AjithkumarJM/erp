import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from "react-router-dom";

import CreateEmployee from './createEmployee';
import EmployeeTracker from './employeeTracker';
import UpdateEmployee from './updateEmployee';

class EmployeeTrackerHome extends Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route path='/employee_tracker/create_employee' render={(props) => <CreateEmployee {...props} />} />
                    <Route path='/employee_tracker/update_employee/:employeeId' render={(props) => <UpdateEmployee {...props} />} />
                    <Route path='/employee_tracker' render={(props) => <EmployeeTracker {...props} />} />
                    <Redirect to='/employee_tracker' />
                </Switch>
            </div>
        );
    }
}

export default connect(null, { })(EmployeeTrackerHome)