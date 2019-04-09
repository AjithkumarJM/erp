import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Col } from 'reactstrap';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getInactiveProjects } from '../../services/projectManagement';
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
        const { getInactiveProjects } = this.props;

        getInactiveProjects();
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    generateName = (row, { projectId, projectName }) => <Link to={`/project_management/info/${projectId}`}>{projectName}</Link>

    renderInactiveProjects = () => {
        const { data } = this.props.inActiveProjects.response;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn dataField='projectName' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>PROJECT NAME</TableHeaderColumn>
                <TableHeaderColumn isKey dataField='projectId' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>PROJECT ID</TableHeaderColumn>
                <TableHeaderColumn dataField='startDate' dataAlign="center" dataSort dataFormat={this.formatDate}>START DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='endDate' dataAlign="center" dataSort dataFormat={this.formatDate}>END DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='status' dataAlign="center" dataSort>STATUS</TableHeaderColumn>
                <TableHeaderColumn dataField='projectDescription' dataAlign="center" dataSort >PROJECT DESCRIPTION</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { inActiveProjects: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div>
                    <div className="p-1 pt-3">
                        {this.renderInactiveProjects()}
                    </div>
                </div >
            )
        }
    }
}

const mapStateToProps = ({ inActiveProjects }) => {
    return { inActiveProjects };
}

export default connect(mapStateToProps, { getInactiveProjects })(EmployeeTracker);