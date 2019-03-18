import React, { Component } from 'react';
import { getCommonEmpDetails } from '../../actions'
import { connect } from 'react-redux'
import moment from 'moment';

class CommonEmpDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.commonEmpDetails();
    }

    commonEmpDetails() {
        this.props.getCommonEmpDetails((data) => {
            this.setState({ comnEmpDetails: data.data.data });
        })
    }

    formatDate(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }

    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    fullName(row, cell) {
        return cell.first_name + " " + cell.last_name
    }

    empListTable() {
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
            <BootstrapTable data={this.state.comnEmpDetails} options={options} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn dataAlign="center" dataField='first_name' isKey searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.fullName}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='blood_group' searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Blood Group</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='medical_insurance_no'>Medical Insurance</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='emergency_contact_no'>Emergency Contact #</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField='emergency_contact_person' >Emergency Contact Person</TableHeaderColumn>
            </BootstrapTable>
        )

    }
    render() {
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

export default connect(null, { getCommonEmpDetails })(CommonEmpDetails);