import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getInactiveEmployees } from '../../services/employeeTracker';
import { userInfo, spinner, tableOptions } from '../../const'
import maleLogo from '../../assets/images/userMaleLogo.png';
import femaleLogo from '../../assets/images/userFemaleLogo.png';

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
        const { getInactiveEmployees } = this.props;

        if (role_id === 3) getInactiveEmployees();
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    generateName = (row, { gender, id, first_name, last_name, designation }) => {
        return (
            <Row>
                <Col md={3} ><img src={gender === "Male" ? maleLogo : femaleLogo} alt='avatar' height='40' width='40' /></Col>
                <Col md={9} className='text-left'>
                    <div className='font-weight-bold'>{`${first_name} ${last_name}`}</div>
                    <p className='text-muted'>Designation</p>
                </Col>
            </Row>
        )
    }

    renderInactiveEmployees = () => {
        const { data } = this.props.inActiveEmployees.response;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination >
                <TableHeaderColumn isKey dataField='first_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='date_of_joining' dataAlign="center" dataSort dataFormat={this.formatDate}>DATE OF JOINING</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='designation' dataAlign="center" dataSort>DESIGNATION</TableHeaderColumn>
                <TableHeaderColumn dataField='reportingto_name' dataAlign="center" dataSort >REPORTING TO</TableHeaderColumn>
                <TableHeaderColumn dataField='role_name' dataAlign="center" dataSort >ROLE</TableHeaderColumn> */}
            </BootstrapTable>
        )
    }

    render() {
        const { inActiveEmployees: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div>
                    <div className="p-1 pt-3">
                        {this.renderInactiveEmployees()}
                    </div>
                </div >
            )
        }
    }
}

const mapStateToProps = ({ inActiveEmployees }) => {
    return { inActiveEmployees };
}

export default connect(mapStateToProps, { getInactiveEmployees })(EmployeeTracker);