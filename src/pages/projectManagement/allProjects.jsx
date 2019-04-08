import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import { Col } from 'reactstrap';
import _ from 'lodash';

import { getAllProjects } from '../../services/projectManagement';
import { userInfo, spinner, tableOptions } from '../../const'

class AllProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empDetails: {}
        }
    }

    componentWillMount = () => {
        const { role_id } = userInfo;
        const { getAllProjects } = this.props;

        if (role_id === 3) getAllProjects();
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, { project_id }) => <Link to={`/project_management/update_project/${project_id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    generateName = (row, { projectId, projectName }) => <Link to={`/project_management/info/${projectId}`}>{projectName}</Link>

    renderTable = () => {
        const { data } = this.props.allProjects.response;
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
        const { allProjects: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div>
                    <div className="p-1">
                        {this.renderTable()}
                    </div>
                </div >
            )
        }
    }
}

const mapStateToProps = ({ allProjects }) => {
    return { allProjects };
}

export default connect(mapStateToProps, { getAllProjects })(AllProjects);