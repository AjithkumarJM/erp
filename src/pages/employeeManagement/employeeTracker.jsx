import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import { Col } from 'reactstrap';
import _ from 'lodash';

import { getEmployeesInfoById } from '../../services/employeeTracker';
import { userInfo, spinner, tableOptions } from '../../const'

class EmployeeTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empDetails: {}
        }
    }

    componentWillMount = () => {
        const { role_id } = userInfo;
        const { getEmployeesInfoById } = this.props;

        getEmployeesInfoById(role_id);
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    generateName = (row, cell) => <Link to={`/employee_tracker/info/${cell.id}`}>{`${cell.first_name} ${cell.last_name}`}</Link>

    renderTable = () => {
        const { data } = this.props.allEmployeeInfoById.response;
        const { role_id } = userInfo;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
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

    render() {
        const { allEmployeeInfoById: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div>
                    <Col md={12} className="page-header mb-3">
                        <h2>Employee Tracker</h2>
                    </Col>
                    <div className="p-1">
                        {this.renderTable()}
                    </div>
                </div >
            )
        }
    }
}

const mapStateToProps = ({ allEmployeeInfoById }) => {
    return { allEmployeeInfoById };
}

export default connect(mapStateToProps, { getEmployeesInfoById })(EmployeeTracker);