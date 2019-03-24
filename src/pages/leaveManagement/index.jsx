import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { NavTab } from 'react-router-tabs';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import ApplyLeave from './leaveManagement';
import LeaveHistory from './leaveHistory';
import ReporteesLeaveHistory from './reporteesLeaveHistory';
import ApproveReject from './approveReject';
import { userInfo } from '../../const';
import LeaveBulkUpload from './leaveBulkupload';


export default class LeaveManagementHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
    }

    toggle = () => this.setState({ modal: !this.state.modal })

    componentDidMount() {
        const { location: { pathname }, history } = this.props;;

        pathname === '/leave_management/' || pathname === '/leave_management' ? history.push('/leave_management/apply_leave') : null
    }

    render() {
        const { role_id, employee_id } = userInfo;
        const { modal } = this.state;
        const { className } = this.props;

        return (
            <div>
                <div className="col-12 page-header mb-3">
                    <h2>Leave Management</h2>
                </div>
                <NavTab to="/leave_management/apply_leave">Apply Leave</NavTab>
                <NavTab to={`/leave_management/leave_history/${employee_id}`}>My Leave History</NavTab>
                {role_id === 3 || role_id === 8 || role_id === 9 ?
                    <span>
                        <NavTab to="/leave_management/reportees_leaveHistory" >Reportees Leave History</NavTab>
                        <NavTab to="/leave_management/approve_reject">Approve - Reject</NavTab>
                    </span>
                    : null
                }
                {role_id === 3 ? < button className='btn btn-ems-ternary btn-sm float-right' onClick={this.toggle}>Bulk Upload <i className="ml-2 fa fa-upload"></i></button> : null}

                <Switch>
                    <Route exact path='/leave_management/apply_leave' render={props => <ApplyLeave {...props} />} />
                    <Route path='/leave_management/leave_history/:employeeId' render={props => <LeaveHistory {...props} />} />
                    <Route path='/leave_management/reportees_leaveHistory' render={props => <ReporteesLeaveHistory {...props} />} />
                    <Route path='/leave_management/approve_reject' render={props => <ApproveReject {...props} />} />
                    <Redirect to='/leave_management/' />
                </Switch>

                <Modal isOpen={modal} toggle={this.toggle} className={className}>
                    <ModalHeader toggle={this.toggle}>Leave Bulk Upload</ModalHeader>
                    <ModalBody className='mb-3'>
                        <LeaveBulkUpload />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}