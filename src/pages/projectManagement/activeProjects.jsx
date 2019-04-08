import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col } from 'reactstrap';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getActiveProjects } from '../../services/projectManagement';
import { userInfo, spinner, tableOptions } from '../../const'

class ActiveProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empDetails: {},
            modal: false
        }
    }

    componentWillMount = () => {
        const { role_id } = userInfo;
        const { getActiveProjects } = this.props;

        if (role_id === 3) getActiveProjects();
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, cell) => <Link to={`/employee_tracker/update_employee/${cell.id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    generateName = (row, { projectId, projectName }) => <Link to={`/project_management/info/${projectId}`}>{projectName}</Link>

    toggle = () => this.setState({ modal: !this.state.modal });

    renderTable = () => {
        const { data } = this.props.activeProjects.response;
        const { role_id } = userInfo;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination trClassName={this.rowClassNameFormat}>
                <TableHeaderColumn dataField='projectName' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>PROJECT NAME</TableHeaderColumn>
                <TableHeaderColumn isKey dataField='projectId' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>PROJECT ID</TableHeaderColumn>
                <TableHeaderColumn dataField='startDate' dataAlign="center" dataSort dataFormat={this.formatDate}>START DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='endDate' dataAlign="center" dataSort dataFormat={this.formatDate}>END DATE</TableHeaderColumn>
                <TableHeaderColumn dataField='status' dataAlign="center" dataSort>STATUS</TableHeaderColumn>
                <TableHeaderColumn dataField='projectDescription' dataAlign="center" dataSort >PROJECT DESCRIPTION</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate} hidden={role_id == 3 ? false : true}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { activeProjects: { requesting } } = this.props;

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

function mapStateToProps({ activeProjects }) {
    return { activeProjects };
}

export default connect(mapStateToProps, { getActiveProjects })(ActiveProjects);