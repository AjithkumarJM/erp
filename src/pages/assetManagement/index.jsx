import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { Route, Switch, Redirect, Link } from "react-router-dom";
import { NavTab } from 'react-router-tabs';

import { userInfo } from '../../const';
import CurrentAssets from './currentAsset';
import AvailableAssets from './availableAssets';
import PreviousAssets from './previousAssets';
import ScrapAssets from './scrapAssets';
import AssignedAssets from './assignedAssets';
import AssetInformation from './assetInformation';
import UpdateAsset from './updateAsset';
import CreateAsset from './createAsset';
import AssetInfo from './assetInfo';

import './style.scss';

export default class AssetManagementHome extends Component {

    componentDidMount = () => this.handleNavigation()

    componentDidUpdate = () => this.handleNavigation()

    handleNavigation = () => {
        const { location: { pathname }, history } = this.props;
        const { role_id, employee_id } = userInfo;

        pathname === '/asset_management/' || pathname === '/asset_management' ?
            role_id === 3 ? history.push('/asset_management/available_assets') : history.push(`/asset_management/current_assets/${employee_id}`)
            : null
    }

    renderNavLinks = () => {
        const { role_id, employee_id } = userInfo;
        const { pathname } = this.props.location;

        if (
            pathname === `/asset_management/current_assets/${employee_id}`
            || pathname === `/asset_management/previous_assets/${employee_id}`
            || pathname === '/asset_management/available_assets/' || pathname === '/asset_management/available_assets'
            || pathname === '/asset_management/scrap_assets/' || pathname === '/asset_management/scrap_assets'
            || pathname === '/asset_management/assigned_assets/' || pathname === '/asset_management/assigned_assets'
        ) {
            return (
                <div>
                    <Col md={12} className="page-header mb-3">
                        <h2>{role_id === 3 ? 'Asset Management' : 'Assets'}</h2>
                    </Col>
                    {
                        role_id === 3 ?
                            <span>
                                <NavTab to="/asset_management/available_assets" >Available</NavTab>
                                <NavTab to="/asset_management/assigned_assets">Assigned</NavTab>
                                <NavTab to="/asset_management/scrap_assets">Scrap</NavTab>
                                <Link to='/asset_management/create_asset' className='btn btn-ems-ternary btn-sm float-right m-2'>Add Asset <i className="ml-2 fa fa-plus-circle"></i></Link>

                            </span> : null}
                    <NavTab to={`/asset_management/current_assets/${employee_id}`}>Currently Assigned</NavTab>
                    <NavTab to={`/asset_management/previous_assets/${employee_id}`}>Previously Assigned</NavTab>
                </div>
            )
        }
    }

    render() {

        return (
            <div>
                {this.renderNavLinks()}

                <Switch>
                    <Route exact path='/asset_management/current_assets/:employeeId' render={props => <CurrentAssets {...props} />} />
                    <Route exact path='/asset_management/previous_assets/:employeeId' render={props => <PreviousAssets {...props} />} />
                    <Route path='/asset_management/about_asset/:assetId' render={props => <AssetInformation {...props} />} />
                    <Route path='/asset_management/available_assets' render={props => <AvailableAssets {...props} />} />
                    <Route path='/asset_management/scrap_assets' render={props => <ScrapAssets {...props} />} />
                    <Route path='/asset_management/create_asset' render={props => <CreateAsset {...props} />} />
                    <Route path='/asset_management/update_asset/:assetId' render={props => <UpdateAsset {...props} />} />
                    <Route path='/asset_management/update_asset/:assetId' render={props => <UpdateAsset {...props} />} />
                    <Route path='/asset_management/assigned_assets' render={props => <AssignedAssets {...props} />} />
                    <Route path='/asset_management/info/:assetId' render={props => <AssetInfo {...props} />} />
                    <Redirect to='/asset_management/' />
                </Switch>
            </div>
        );
    }
}