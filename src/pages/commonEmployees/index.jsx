import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { getCommonEmployeeInfo } from '../../services/commonEmployees'
import { spinner, tableOptions } from '../../const';

class commonEmployees extends Component {

    componentWillMount = () => this.props.getCommonEmployeeInfo();

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    generateName = (row, cell) => cell.first_name + " " + cell.last_name

    empListTable() {
        const { data } = this.props.commonEmployeesInfo.response;

        return (
            <BootstrapTable data={data} options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn dataAlign="center" dataField='first_name' isKey searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.generateName}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='blood_group' searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Blood Group</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='medical_insurance_no'>Medical Insurance</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='emergency_contact_no'>Emergency Contact #</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='emergency_contact_person' >Emergency Contact Person</TableHeaderColumn>
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