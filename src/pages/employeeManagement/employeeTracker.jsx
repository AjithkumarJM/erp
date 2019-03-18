import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getUserList, empLeaveHistory, leaveBalance, hrEmpTracker, getEmpDetails, getEmployeeAsset } from '../../actions'
import { getEmployeesInfo } from '../../services/employeeTracker';
import { userInfo, spinner } from '../../const'

class EmployeeTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empDetails: {},
            childVisible: false,
            modal: false
        }
    }

    componentDidMount = () => {
        const { role_id } = userInfo;
        const { getEmployeesInfo } = this.props;

        if (role_id === 3) getEmployeesInfo();
    }

    componentWillReceiveProps = ({ allEmployeeInfo }) => this.setState({ allEmployeeInfo: allEmployeeInfo.response });

    formatDate = doj => typeof (doj == 'string') ? moment(doj).format('YYYY/MM/DD') : doj

    leavebalancetable() {
        const options = {
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
            <BootstrapTable data={this.state.leavebalance} options={options} striped hover sortIndicator tableStyle={{ cursor: "pointer" }}>
                <TableHeaderColumn isKey dataField="type_name" dataAlign="center">Leave Type</TableHeaderColumn>
                <TableHeaderColumn dataField='no_of_days' dataAlign="center">Balance</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    renderEmpAsset() {
        const options = {
            sizePerPage: 10,  // which size per page you want to locate as default            
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }],
            paginationSize: 3,  // the pagination bar size.                        
            paginationShowsTotal: this.renderPaginationShowsTotal,
            sizePerPageDropDown: this.renderSizePerPageDropDown,
            nextPage: 'Next',
            prePage: 'Previous',
            noDataText: 'No Results Found',
        };
        return (
            < BootstrapTable
                data={this.state.empAsset}
                maxHeight='500' version='4' options={options}
                ignoreSinglePage pagination
                hover={true} tableStyle={{ cursor: "pointer" }} trClassName={this.rowClassNameFormat} >
                <TableHeaderColumn isKey dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Serial #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Make</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center">Model</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center">Type</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataFormat={this.formatDate} dataAlign="center">Assigned On</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn ems-btn-ternary mr-1">Update</Link>

    generateName = (row, cell) => <Link to={`/employee_tracker/info/${cell.id}`}>{`${cell.first_name} ${cell.last_name}`}</Link>

    toggle = () => this.setState({ modal: !this.state.modal });

    renderTable = () => {
        const { allEmployeeInfo: { data } } = this.state;
        const { role_id } = userInfo;

        const options = {
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
            <BootstrapTable data={data} maxHeight='500' version='4' options={options} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataField='id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee ID</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_joining' dataAlign="center" dataSort dataFormat={this.formatDate}>DOJ</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_birth' dataAlign="center" dataSort dataFormat={this.formatDate}>DOB</TableHeaderColumn>
                <TableHeaderColumn dataField='designation' dataAlign="center" dataSort>Designation</TableHeaderColumn>
                <TableHeaderColumn dataField='reportingto_name' dataAlign="center" dataSort >Reporting To</TableHeaderColumn>
                <TableHeaderColumn dataField='role_name' dataAlign="center" dataSort >Role</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate} hidden={role_id == 3 ? false : true}>Actions</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    reRoute = () => this.props.getEmployeesInfo()

    leaveBalance = () => {
        const { leavebalance } = this.state;
        return _.map(leavebalance, data => <li className='li_class'><span className='li_class2'>{data.type_name} </span><a>{data.no_of_days} </a></li>);
    }

    render() {
        const { modal, allEmployeeInfo } = this.state;
        const { role_id } = userInfo;

        if (!allEmployeeInfo) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className="row">
                    <div className="col-12 page-header">
                        <h2>Employee Tracker</h2>
                        {
                            role_id === 3 ? < Link
                                to='/employee_tracker/create_employee'
                                className='btn float-right ems-btn-ternary'><i className="fa fa-plus"></i> Add Employee</Link> : null
                        }
                    </div>
                    <div className="col-md-12">
                        {this.renderTable()}
                        <Modal isOpen={modal} toggle={this.toggle} backdrop='static' size='lg' className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Employee Details</ModalHeader>
                            <ModalBody>
                                {(() => {
                                    if (role_id === 3) {
                                        return (
                                            <div className='row nameAlignment'>
                                                <div className='col-md-3'><h6 className='font-weight-bold'>Name  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.first_name} {this.state.empDetails.last_name}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Contact #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.contact_no}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Employee ID  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.id}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Blood Group  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.blood_group ? this.state.empDetails.blood_group : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Gender  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.gender}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Bank Account #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.bank_account_no ? this.state.empDetails.bank_account_no : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Date Of Birth  </h6></div>
                                                <div className='col-md-3'><p >:          {this.formatDate(this.state.empDetails.date_of_birth)}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>PAN ID  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.pan_no ? this.state.empDetails.pan_no : 'Not Entered'}  </p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Date Of Joining  </h6></div>
                                                <div className='col-md-3'><p >:          {this.formatDate(this.state.empDetails.date_of_joining)}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>PF ID  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.pF_no ? this.state.empDetails.pF_no : 'Not Entered'} </p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Email Address  </h6></div>
                                                <div className='col-md-3'><p className='font-weight-bolde'>: {this.state.empDetails.email}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>CTC  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.ctc} </p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Experience  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.year_of_experience}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Medical Ins. #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.medical_insurance_no ? this.state.empDetails.medical_insurance_no : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Designation  </h6></div>
                                                <div className='col-md-3'><p className='font-weight-boldeDesignation'>:          {this.state.empDetails.designation}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Emer. Contact Person  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.emergency_contact_person ? this.state.empDetails.emergency_contact_person : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>System Role  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.role_name}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Emer. Contact #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.emergency_contact_no ? this.state.empDetails.emergency_contact_no : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Reporting To  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.reportingto_name}</p></div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className='row nameAlignment'>
                                                <div className='col-md-3'><h6 className='font-weight-bold'>Name  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.first_name} {this.state.empDetails.last_name}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Designation  </h6></div>
                                                <div className='col-md-3'><p className='font-weight-boldeDesignation'>:          {this.state.empDetails.designation}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Employee ID  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.id}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>System Role  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.role_name}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Gender  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.gender}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Contact #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.contact_no}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Date Of Birth  </h6></div>
                                                <div className='col-md-3'><p >:          {this.formatDate(this.state.empDetails.date_of_birth)}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Blood Group  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.blood_group ? this.state.empDetails.blood_group : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Date Of Joining  </h6></div>
                                                <div className='col-md-3'><p >:          {this.formatDate(this.state.empDetails.date_of_joining)}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Medical Ins. #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.medical_insurance_no ? this.state.empDetails.medical_insurance_no : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Email Address  </h6></div>
                                                <div className='col-md-3'><p className='font-weight-bolde'>: {this.state.empDetails.email}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Emer. Contact #  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.emergency_contact_no ? this.state.empDetails.emergency_contact_no : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Experience  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.year_of_experience}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Emer. Contact Person  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.emergency_contact_person ? this.state.empDetails.emergency_contact_person : 'Not Entered'}</p></div>

                                                <div className='col-md-3'><h6 className='font-weight-bold'>Reporting To  </h6></div>
                                                <div className='col-md-3'><p >:          {this.state.empDetails.reportingto_name}</p></div>
                                            </div>
                                        )
                                    }
                                })()}

                                <div>
                                    <ol className="breadcrumb">
                                        <h5><li className="breadcrumb-item active">Leave Balance <small>(Days)</small></li></h5>
                                    </ol>
                                    <ul className='ul_class text-center'>
                                        <li>{this.leaveBalance.bind(this)}<span></span></li>
                                    </ul>
                                </div>
                                <br></br>
                                <div>
                                    <ol className="breadcrumb">
                                        <h5><li className="breadcrumb-item active">Currently Assigned Assets</li></h5>
                                    </ol>
                                </div>
                                <div>{this.renderEmpAsset()}</div>
                            </ModalBody>
                        </Modal>
                    </div>
                </div >
            )
        }
    }
}

function mapStateToProps({ userInformation, allEmployeeInfo }) {
    return { userInformation, allEmployeeInfo };
}

export default connect(mapStateToProps, { getEmployeesInfo, leaveBalance, hrEmpTracker, empLeaveHistory, getUserList, getEmpDetails, getEmployeeAsset })(EmployeeTracker);