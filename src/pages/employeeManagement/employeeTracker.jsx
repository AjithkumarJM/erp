import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
            modal: false
        }
    }

    componentDidMount = () => {
        const { role_id } = userInfo;
        const { getEmployeesInfo } = this.props;

        if (role_id === 3) getEmployeesInfo();
    }

    componentWillReceiveProps = ({ allEmployeeInfo }) => this.setState({ allEmployeeInfo: allEmployeeInfo.response.data });

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
        const { allEmployeeInfo } = this.state;
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
            <BootstrapTable data={allEmployeeInfo} maxHeight='500' version='4' options={options} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
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
        const { allEmployeeInfo: { requesting } } = this.props;
        const { role_id } = userInfo;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className="row">
                    <div className="col-12 page-header">
                        <h2>Employee Tracker</h2>
                        {role_id === 3 ? < Link to='/employee_tracker/create_employee' className='btn float-right ems-btn-ternary'><i className="fa fa-plus"></i> Add Employee</Link> : null}
                    </div>
                    <div className="col-md-12">
                        {this.renderTable()}
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