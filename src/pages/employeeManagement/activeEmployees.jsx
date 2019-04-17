import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getEmployeesInfo } from '../../services/employeeTracker';
import { userInfo, spinner, tableOptions } from '../../const'
import maleLogo from '../../assets/images/userMaleLogo.png';
import femaleLogo from '../../assets/images/userFemaleLogo.png';

class ActiveEmployees extends Component {
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

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    generateName = (row, { gender, id, first_name, last_name, designation }) => {
        return (
            <Row>
                <Col md={3} ><img src={gender === "Male" ? maleLogo : femaleLogo} alt='avatar' height='40' width='40' /></Col>
                <Col md={9} className='text-left'>
                    <Link to={`/employee_tracker/info/${id}`}>{`${first_name} ${last_name}`}</Link>
                    <p>{designation}</p>
                </Col>
            </Row>
        )
    }

    toggle = () => this.setState({ modal: !this.state.modal });

    renderTable = () => {
        const { data } = this.props.allEmployeeInfo.response;
        const { role_id } = userInfo;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='first_name' width='20%' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_joining' dataAlign="center" dataSort dataFormat={this.formatDate}>DATE OF JOINING</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_birth' dataAlign="center" dataSort dataFormat={this.formatDate}>DATE OF BIRTH</TableHeaderColumn>
                <TableHeaderColumn dataField='reportingto_name' dataAlign="center" dataSort >REPORTING TO</TableHeaderColumn>
                <TableHeaderColumn dataField='role_name' dataAlign="center" dataSort >ROLE</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate} hidden={role_id == 3 ? false : true}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { allEmployeeInfo: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div>
                    <div className="p-1 pt-3">
                        {this.renderTable()}
                    </div>
                </div >
            )
        }
    }
}

function mapStateToProps({ allEmployeeInfo }) {
    return { allEmployeeInfo };
}

export default connect(mapStateToProps, { getEmployeesInfo })(ActiveEmployees);