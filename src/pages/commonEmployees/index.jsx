import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { getCommonEmployeeInfo } from '../../services/commonEmployees'
import { spinner, tableOptions } from '../../const';
import maleLogo from '../../assets/images/userMaleLogo.png';
import femaleLogo from '../../assets/images/userFemaleLogo.png';

class commonEmployees extends Component {

    componentWillMount = () => this.props.getCommonEmployeeInfo();

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date
    
    generateName = (row, { gender, id, first_name, last_name, designation }) => {
        return (
            <Row>
                <Col md={3} ><img src={gender === "Male" ? maleLogo : femaleLogo} alt='avatar' height='35' width='35' /></Col>
                <Col md={9} className='text-left'>
                    <div >{`${first_name} ${last_name}`}</div>
                    <p className='text-muted'>{designation}</p>
                </Col>
            </Row>
        )
    }

    empListTable() {
        const { data } = this.props.commonEmployeesInfo.response;

        return (
            <BootstrapTable data={data} options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn width='20%' dataAlign="center" dataField='first_name' isKey searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.generateName}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='blood_group' searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>BLOOD GROUP</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='medical_insurance_no'>MEDICAL INSURANCE</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='emergency_contact_no'>EMERGENCY CONTACT #</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='emergency_contact_person' >EMERGENCY CONTACT PERSON</TableHeaderColumn>
            </BootstrapTable>
        )

    }
    render() {
        const { commonEmployeesInfo: { requesting, response } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='row'>
                    <div className="col-12 page-header">
                        <h2>Know Your Colleagues</h2>
                    </div>
                    <div className='col-md-12 '>
                        {this.empListTable()}
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = ({ commonEmployeesInfo }) => {
    return { commonEmployeesInfo }
}

export default connect(mapStateToProps, { getCommonEmployeeInfo })(commonEmployees);