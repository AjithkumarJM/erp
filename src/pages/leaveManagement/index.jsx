import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect } from "react-router-dom";
import { RoutedTabs, NavTab } from 'react-router-tabs';

import ApplyLeave from './leaveManagement';
import LeaveHistory from './leaveHistory';
import ReporteesLeaveHistory from './reporteesLeaveList';
import ApproveReject from './approveReject';
import { userInfo } from '../../const';


class LeaveManagementHome extends Component {

    render() {
        const { role_id } = userInfo;

        return (
            <div>
                <div className="col-12 page-header mb-3">
                    <h2>Leave Management</h2>
                </div>
                <NavTab to="/leave_management/apply_leave">Apply Leave</NavTab>
                <NavTab to="/leave_management/leave_history">Leave History</NavTab>
                {role_id === 3 || role_id === 8 || role_id === 9 ?
                    <span>
                        <NavTab to="/leave_management/reportees_leaveHistory">Reportees Leave History</NavTab>
                        <NavTab to="/leave_management/approve_reject">Approve - Reject</NavTab>
                    </span>
                    : null
                }

                <Switch>
                    <Route exact path='/leave_management/apply_leave' render={props => <ApplyLeave {...props} />} />
                    <Route path='/leave_management/leave_history' render={props => <LeaveHistory {...props} />} />
                    <Route path='/leave_management/reportees_leaveHistory' render={props => <ReporteesLeaveHistory {...props} />} />
                    <Route path='/leave_management/approve_reject' render={props => <ApproveReject {...props} />} />
                    <Redirect to='//leave_management/apply_leave' />
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = ({ }) => {
    return {

    }
}

export default connect(
    mapStateToProps,
)(LeaveManagementHome);