import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

import { userInfo, spinner, alertOptions, tableOptions, femaleLeaveType, maleLeaveType, leaveFormat } from '../../const';
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
                return <button className='btn btn-ems-ternary btn-sm' onClick={() => this.setState({ rowData: row, modal: !this.state.modal })} >Cancel Leave</button>
            }
        }
    }

    formatDate = date => moment((date.split('T'))[0]).format('ddd, MMM Do YY');

    renderLeaveHistory = () => {
        const { data } = this.props.leaveHistory.response;
        const { gender } = userInfo;

        return (
            <BootstrapTable data={data}
                maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination>
                <TableHeaderColumn isKey dataField='type_name' dataAlign="center" filterFormatted formatExtraData={gender === 'Female' ? femaleLeaveType : maleLeaveType} filter={{ type: 'SelectFilter', options: gender === 'Female' ? femaleLeaveType : maleLeaveType, defaultValue: 2 }}>LEAVE TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='from_date' dataFormat={this.formatDate} dataAlign="center" dataSort>FROM DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='to_date' dataFormat={this.formatDate} dataAlign="center" dataSort>TO DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center" dataSort>DURATION (days)</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='leave_status' filterFormatted formatExtraData={leaveFormat} filter={{ type: 'SelectFilter', options: leaveFormat, defaultValue: 2 }} dataFormat={this.statusFormat}>STATUS</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.renderCancelAction} dataAlign="center">ACTION</TableHeaderColumn>
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
                        <h4 className="text-center font-weight-thin">
                            Are you sure, you want to cancel the leave ?
                            </h4>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-sm btn-ems-primary" onClick={this.onSubmitCancelLeave} >Yes</button>
                        <button type="button" className="btn btn-sm btn-ems-clear" onClick={this.toggle}>No</button>
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