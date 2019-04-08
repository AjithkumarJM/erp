import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import { Route, Switch, Redirect } from "react-router-dom";
import { NavTab } from 'react-router-tabs';

import CreateClient from './createClient';
import ClientManagement from './clientManagement';
import UpdateClient from './updateClient';
import ActiveClients from './activeClients';
import AllClients from './allClients';
import ClientDetails from './clientDetails';
import { userInfo } from '../../const';

export default class ClientManagementHome extends Component {

    componentDidMount = () => this.handleNavigation()

    componentDidUpdate = () => this.handleNavigation()

    handleNavigation = () => {
        const { location: { pathname }, history } = this.props;

        pathname === '/client_management/' || pathname === '/client_management' ?
            history.push('/client_management/all_clients') : null
    }

    renderNavLinks = () => {
        const { role_id } = userInfo;
        const { location: { pathname } } = this.props;

        return (
            <div>
                {
                    role_id === 3 && (pathname === '/client_management/active_clients' || pathname === '/client_management/all_clients') ?
                        <span>
                            <Col md={12} className="page-header">
                                <h2>Client Management</h2>
                            </Col>

                            <NavTab to="/client_management/all_clients" >All Clients</NavTab>
                            <NavTab to="/client_management/active_clients">Active Clients</NavTab>
                            <Link to='/client_management/create_client' className='btn btn-ems-ternary btn-sm float-right m-2'>Add Client <i className="ml-2 fa fa-plus-circle"></i></Link>
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
                    <Route path='/client_management/create_client' render={(props) => <CreateClient {...props} />} />
                    <Route path='/client_management/update_client/:clientId' render={(props) => <UpdateClient {...props} />} />
                    <Route path='/client_management/info/:clientId' render={(props) => <ClientDetails {...props} />} />
                    <Route path='/client_management/active_clients' render={(props) => <ActiveClients {...props} />} />
                    <Route path='/client_management/all_clients' render={(props) => <AllClients {...props} />} />
                    <Route path='/client_management/clients' render={(props) => <ClientManagement {...props} />} />

                    <Redirect to='/client_management' />
                </Switch>
            </div>
        );
    }
}