import React, { Component } from 'react';
import { Link, Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';

import { getUserList, empLeaveHistory, leaveBalance, hrEmpTracker, getEmpDetails, getEmployeeAsset } from '../../actions'
import { getEmployeesInfo } from '../../services/employeeTracker';
import { userInfo, spinner, tableOptions } from '../../const'

class EmployeeTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empDetails: {},
            modal: false
        }
    }

    componentWillMount = () => {
        const { role_id } = userInfo;
        const { getEmployeesInfo } = this.props;

        if (role_id === 3) getEmployeesInfo();
    }

    componentWillReceiveProps = ({ allEmployeeInfo }) => this.setState({ allEmployeeInfo: allEmployeeInfo.response.data });

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderEmpAsset = () => {
        return (
            < BootstrapTable
                data={this.state.empAsset}
                maxHeight='500' version='4' options={tableOptions}
                ignoreSinglePage pagination
                hover={true} tableStyle={{ cursor: "pointer" }} trClassName={this.rowClassNameFormat} >
                <TableHeaderColumn isKey dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>SERIAL #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>MAKE</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center">MODEL</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center">TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataFormat={this.formatDate} dataAlign="center">ASSIGNED ON</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn btn-ems-ternary mr-1">Update</Link>

    generateName = (row, cell) => <Link to={`/employee_tracker/info/${cell.id}`}>{`${cell.first_name} ${cell.last_name}`}</Link>

    toggle = () => this.setState({ modal: !this.state.modal });

    renderTable = () => {
        const { allEmployeeInfo } = this.state;
        const { role_id } = userInfo;

        return (
            <BootstrapTable data={allEmployeeInfo} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_joining' dataAlign="center" dataSort dataFormat={this.formatDate}>DATE OF JOINING</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_birth' dataAlign="center" dataSort dataFormat={this.formatDate}>DATE OF BIRTH</TableHeaderColumn>
                <TableHeaderColumn dataField='designation' dataAlign="center" dataSort>DESIGNATION</TableHeaderColumn>
                <TableHeaderColumn dataField='reportingto_name' dataAlign="center" dataSort >REPORTING TO</TableHeaderColumn>
                <TableHeaderColumn dataField='role_name' dataAlign="center" dataSort >ROLE</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate} hidden={role_id == 3 ? false : true}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    reRoute = () => this.props.getEmployeesInfo()

    leaveBalance = () => {
        const { leavebalance } = this.state;
        return _.map(leavebalance, data => <li className='li_class'><span className='li_class2'>{data.type_name} </span><a>{data.no_of_days} </a></li>);
    }
    renderInactiveEmployees = () => {
        const { allEmployeeInfo } = this.state;

        return (
            <BootstrapTable data={allEmployeeInfo} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_joining' dataAlign="center" dataSort dataFormat={this.formatDate}>DATE OF JOINING</TableHeaderColumn>
                <TableHeaderColumn dataField='designation' dataAlign="center" dataSort>DESIGNATION</TableHeaderColumn>
                <TableHeaderColumn dataField='reportingto_name' dataAlign="center" dataSort >REPORTING TO</TableHeaderColumn>
                <TableHeaderColumn dataField='role_name' dataAlign="center" dataSort >ROLE</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    renderTabsSection = () => {
        const { role_id } = userInfo;

        return (
            <Tabs>
                <TabList>
                    <Tab>Active Employees</Tab>
                    <Tab>In-Active Employees</Tab>
                    {role_id === 3 ? < Link to='/employee_tracker/create_employee' className='btn btn-ems-ternary float-right m-2'>Add Employee <i className="ml-2 fa fa-plus-circle"></i></Link> : null}

                </TabList>

                <TabPanel>{this.renderTable()}</TabPanel>
                <TabPanel>{this.renderInactiveEmployees()}</TabPanel>
            </Tabs>
        )
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
                    </div>
                    <div className="col-md-12">
                        {role_id !== 3 ? this.renderTable() : this.renderTabsSection()}
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