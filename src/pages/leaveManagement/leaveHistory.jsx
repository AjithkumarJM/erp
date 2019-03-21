import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

import { userInfo, spinner, alertOptions } from '../../const';
import { getLeaveHistory, postCancelLeave } from '../../services/leaveManagement';

class LeaveHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false, modal: false
        };
    }

    componentWillMount = () => {
        const { getLeaveHistory } = this.props;
        const { employeeId } = this.props.match.params;

        getLeaveHistory(employeeId);
    }

    componentWillReceiveProps = ({ leaveHistory }) => this.setState({ leaveHistory: leaveHistory.response.data })

    toggle = () => this.setState({ modal: !this.state.modal })

    statusFormat = (cell, row) => {
        const { leave_status } = row;

        if (leave_status === 'Rejected') return <div className='badge p-2 rounded bg-rejected secondary-text'>{leave_status}</div>
        else if (leave_status === 'Cancelled') return <div className='badge p-2 rounded bg-cancelled secondary-text'>{leave_status}</div>
        else if (leave_status === 'Pending') return <div className='badge p-2 rounded bg-pending secondary-text'>{leave_status}</div>
        else if (leave_status === 'Approved') return <div className='badge p-2 rounded bg-approved secondary-text'>{leave_status}</div>
    }

    renderCancelAction = (cell, row) => {
        const { leave_status, from_date } = row;
        if (leave_status == 'Pending' || leave_status == 'Approved') {
            if (this.formatDate(from_date) > moment().format('YYYY/MM/DD')) {
                return <button className='btn ems-btn-ternary btn-sm' onClick={() => this.setState({ rowData: row, modal: !this.state.modal })} data-toggle="modal" data-target="#emp_cancel">Cancel Leave</button>
            }
        }
    }

    formatDate = date => moment((date.split('T'))[0]).format('YYYY/MM/DD');

    renderLeaveHistory = () => {
        const { leaveHistory } = this.state;
        const { gender } = userInfo;

        const typeOfLeaveML = {
            'CL': 'CL',
            'EL': 'EL',
            'ML': 'ML',
            'LOP': 'LOP',
            'WFH': 'WFH'
        }
        const typeOfLeave = {
            'CL': 'CL',
            'EL': 'EL',
            'LOP': 'LOP',
            'WFH': 'WFH'
        }
        const LeaveType = {
            'Approved': 'Approved',
            'Rejected': 'Rejected',
            'Pending': 'Pending',
            'Cancelled': 'Cancelled'
        };

        const options = {
            sortName: this.state.sortName,
            sortOrder: this.state.sortOrder,
            onSortChange: this.onSortChange,
            sizePerPage: 10,  // which size per page you want to locate as default
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }],
            paginationSize: 3,  // the pagination bar size.
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        };

        return (
            <BootstrapTable data={leaveHistory}
                maxHeight='500' version='4' options={options} ignoreSinglePage pagination>
                <TableHeaderColumn isKey dataField='type_name' dataAlign="center" filterFormatted
                    formatExtraData={gender === 'Female' ? typeOfLeaveML : typeOfLeave} filter={{ type: 'SelectFilter', options: gender === 'Female' ? typeOfLeaveML : typeOfLeave, defaultValue: 2 }}>Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.formatDate} dataAlign="center" dataSort>From Date</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataFormat={this.formatDate} dataAlign="center" dataSort>To Date</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>Duration (days)</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='leave_status'
                    filterFormatted
                    formatExtraData={LeaveType} filter={{ type: 'SelectFilter', options: LeaveType, defaultValue: 2 }} dataFormat={this.statusFormat}>Status</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.renderCancelAction} dataAlign="center">Action</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    notify = (message, type) => this.msg.show(message, { type });

    onSubmitCancelLeave = () => {
        const { rowData: { leave_id } } = this.state;
        const { postCancelLeave } = this.props;

        let values = {}
        this.setState({ loader: true })
        values.leave_id = leave_id;
        values.is_approved = 4;
        postCancelLeave(values, (data) => {
            const { code, message } = data.data;

            if (code === 'EMS_001') {
                this.setState({ loader: false })
                this.notify(message, 'success');
            } else {
                this.setState({ loader: false })
                this.notify(message, 'error');
            }
        })
    }

    render() {
        const { loader, modal } = this.state;
        const { leaveHistory: { requesting }, className } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        return (
            <div className='p-2 pt-3'>
                <Loader show={loader} message={spinner} />
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />

                {this.renderLeaveHistory()}

                <Modal isOpen={modal} toggle={this.toggle} className={className}>
                    <ModalBody>
                        <h4 className="text-center">
                            Are you sure, you want to cancel the leave ?
                            </h4>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-sm btn-ems-primary" onClick={this.onSubmitCancelLeave} data-dismiss="modal">Yes</button>
                        <button type="button" className="btn btn-sm btn-ems-secondary" onClick={() => this.toggle}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = ({ leaveHistory }) => {
    return { leaveHistory };
}

export default connect(mapStateToProps, { getLeaveHistory, postCancelLeave })(LeaveHistory);