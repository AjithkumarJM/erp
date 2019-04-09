import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import { Route, Switch, Redirect } from "react-router-dom";
import { NavTab } from 'react-router-tabs';

import AllProjects from './allProjects';
import CreateProject from './createProject';
import UpdateProject from './updateProject';
import ActiveProjects from './activeProjects';
import InActiveProjects from './inActiveProjects';
import ProjectDetails from './projectDetails';
import AssignProject from './assignProject';

export default class ProjectManagementHome extends Component {

    componentDidMount = () => this.handleNavigation()

    componentDidUpdate = () => this.handleNavigation()

    handleNavigation = () => {
        const { location: { pathname }, history } = this.props;

        pathname === '/project_management/' || pathname === '/project_management' ?
            history.push('/project_management/all_projects') : null
    }

    renderNavLinks = () => {
        const { location: { pathname } } = this.props;

        return (
            <div>
                {
                    pathname === '/project_management/all_projects' || pathname === '/project_management/active_projects' || pathname === '/project_management/inActive_projects' ?
                        <span>
                            <Col md={12} className="page-header">
                                <h2>Project Management</h2>
                            </Col>

                            <NavTab to="/project_management/all_projects" >All Projects</NavTab>
                            <NavTab to="/project_management/active_projects">Active Projects</NavTab>
                            <NavTab to="/project_management/inActive_projects">InActive Projects</NavTab>
                            <Link to='/project_management/create_project' className='btn btn-ems-ternary btn-sm float-right m-2'>Add Project <i className="ml-2 fa fa-plus-circle"></i></Link>
                        </span> : null
                }
            </div>
        )
    }

    render() {
        return (
            <div>

                {this.renderNavLinks()}

                <Switch>
                    <Route path='/project_management/create_project' render={(props) => <CreateProject {...props} />} />
                    <Route path='/project_management/update_project/:projectId' render={(props) => <UpdateProject {...props} />} />
                    <Route path='/project_management/info/:projectId' render={(props) => <ProjectDetails {...props} />} />
                    <Route path='/project_management/all_projects' render={(props) => <AllProjects {...props} />} />
                    <Route path='/project_management/active_projects' render={(props) => <ActiveProjects {...props} />} />
                    <Route path='/project_management/inActive_projects' render={(props) => <InActiveProjects {...props} />} />
                    <Route path='/project_management/assign_project' render={(props) => <AssignProject {...props} />} />

                    <Redirect to='/project_management' />
                </Switch>
            </div>
        );
    }
}