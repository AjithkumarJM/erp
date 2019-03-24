import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert';
import moment from 'moment';

import { getPendingLeaveHistoryById } from '../../services/leaveManagement';
import { userInfo, spinner, alertOptions, tableOptions, allLeaveType } from '../../const';
import API_CALL from '../../services';

class ApproveReject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            modal: false
        }
    }

    componentWillMount = () => {
        const { getPendingLeaveHistoryById } = this.props;
        const { employee_id } = userInfo;

        getPendingLeaveHistoryById(employee_id);
    }

    formatDate = date => moment((date.split('T'))[0]).format('ddd, MMM Do YY');

    generateName = (row, cell) => cell.first_name + " " + cell.last_name;

    toggle = () => this.setState({ modal: !this.state.modal });

    getDetails = row => this.setState({ leaveid: row.leave_id, currentLeaveDetail: [row] })

    actionFormat = (cell, row) => <button className="btn btn-ems-ternary btn-sm" onClick={() => {
        this.getDetails(row)
        this.toggle()
    }}>Approve / Reject</button>

    leaveDetails = () => {
        return (
            <BootstrapTable data={this.state.currentLeaveDetail} maxHeight='500' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" >EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" dataSort>LEAVE TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.formatDate} dataAlign="center" dataSort>FROM DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataAlign="center" dataSort dataFormat={this.formatDate}>TO DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>DURATION (days)</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    pendingapprovalTable = () => {
        const { data } = this.props.pendingLeaveHistory.response;

        return (
            <BootstrapTable data={data} options={tableOptions} maxHeight='500' version='4' ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" filterFormatted
                    formatExtraData={allLeaveType} filter={{ type: 'SelectFilter', options: allLeaveType, defaultValue: 2 }} > LEAVE TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.formatDate} dataAlign="center" dataSort>FROM DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataAlign="center" dataSort dataFormat={this.formatDate}>TO DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>DURATION (days)</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataFormat={this.actionFormat}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    notify = (message, type) => this.msg.show(message, { type });

    onApproveReject = (values, type) => {
        const { leaveid } = this.state;
        const { reset } = this.props;

        this.setState({ loader: true })

        values.leave_id = Number(leaveid);
        values.is_approved = type === 'approve' ? 2 : 3;

        API_CALL('post', 'leave/status/update', values, null, data => {
            const { code, message } = data.data;

            if (code == 'EMS_001') {
                this.setState({ loader: false })
                this.notify(message, 'success');
                reset();
            } else {
                this.setState({ loader: false })
                this.notify(message, 'error');
                reset();
            }
        })
    }

    render() {
        const { handleSubmit, pendingLeaveHistory: { requesting }, className, submitting, pristine } = this.props;
        const { loader, modal } = this.state;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='p-2 pt-3'>
                    <div>
                        {this.pendingapprovalTable()}
                        <Loader show={loader} message={spinner} />
                        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    </div>

                    <Modal isOpen={modal} toggle={this.toggle} className={className} backdrop='static' size='lg'>
                        <ModalHeader toggle={this.toggle}>Approve / Reject</ModalHeader>
                        <ModalBody>
                            {this.leaveDetails()}
                            <form className='mt-2'>
                                <label className=' font-weight-bold'>Notes</label>
                                <Field className='col-12' name="remarks" component="textarea" />
                                <div className='text-center mt-1'>
                                    <button type="submit" disabled={pristine || submitting} onClick={() => handleSubmit(this.onApproveReject('approve'))} className='btn btn-spacing btn-sm btn-ems-primary'>Approve</button>
                                    <button type="submit" disabled={pristine || submitting} onClick={() => handleSubmit(this.onApproveReject('reject'))} className=' btn btn-ems-clear btn-sm'>Reject</button>
                                </div>
                            </form>
                        </ModalBody>
                    </Modal>
                </div >
            )
        }
    }
}

const mapStateToProps = ({ pendingLeaveHistory }) => {
    return { pendingLeaveHistory }
}

export default withRouter(reduxForm({
    form: 'approveRejectForm',
})(connect(mapStateToProps, { getPendingLeaveHistoryById })(ApproveReject)));

