import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { NavTab } from 'react-router-tabs';

import ApplyLeave from './leaveManagement';
import LeaveHistory from './leaveHistory';
import ReporteesLeaveHistory from './reporteesLeaveList';
import ApproveReject from './approveReject';
import { userInfo } from '../../const';


export default class LeaveManagementHome extends Component {

    componentDidMount() {
        const { location: { pathname }, history } = this.props;;

        pathname === '/leave_management/' || pathname === '/leave_management' ? history.push('/leave_management/apply_leave') : null
    }

    render() {
        const { role_id, employee_id } = userInfo;
        const styling = role_id === 3 || role_id === 8 || role_id === 9 ? { width: '25%' } : { width: '50%' }

        return (
            <div>
                <div className="col-12 page-header mb-3">
                    <h2>Leave Management</h2>
                </div>
                <NavTab to="/leave_management/apply_leave" style={styling}>Apply Leave</NavTab>
                <NavTab to={`/leave_management/leave_history/${employee_id}`} style={styling}>Leave History</NavTab>
                {role_id === 3 || role_id === 8 || role_id === 9 ?
                    <span>
                        <NavTab to="/leave_management/reportees_leaveHistory" style={styling} >Reportees Leave History</NavTab>
                        <NavTab to="/leave_management/approve_reject" style={styling}>Approve - Reject</NavTab>
                    </span>
                    : null
                }

                <Switch>
                    <Route exact path='/leave_management/apply_leave' render={props => <ApplyLeave {...props} />} />
                    <Route path='/leave_management/leave_history/:employeeId' render={props => <LeaveHistory {...props} />} />
                    <Route path='/leave_management/reportees_leaveHistory' render={props => <ReporteesLeaveHistory {...props} />} />
                    <Route path='/leave_management/approve_reject' render={props => <ApproveReject {...props} />} />
                    <Redirect to='/leave_management/' />
                </Switch>
            </div>
        );
    }
}