import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Route, Switch, Redirect, Link } from "react-router-dom";
import { NavTab } from 'react-router-tabs';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { userInfo } from '../../const';
import CurrentAssets from './currentAsset';
import AvailableAssets from './availableAssets';
import PreviousAssets from './previousAssets';
import ScrapAssets from './scrapAssets';
import AssignedAssets from './assignedAssets';
import AssetInformation from './assetInformation';
import CreateAsset from './createAsset';
import UpdateAsset from './updateAsset';

class AssetManagementHome extends Component {

    componentDidMount() {
        const { location: { pathname }, history } = this.props;
        const { role_id } = userInfo;

        pathname === '/asset_management/' || pathname === '/asset_management' ?
            role_id === 3 ? history.push('/asset_management/available_assets') : history.push('/asset_management/current_assets')
            : null
    }

    render() {
        const { role_id } = userInfo;
        return (
            <div>
                <Col md={12} className="page-header">
                    <h2>{role_id === 3 ? 'Asset Management' : 'Assets'}</h2>
                </Col>

                {role_id === 3 ?
                    <span>
                        <NavTab to="/asset_management/available_assets" >Available</NavTab>
                        <NavTab to="/asset_management/assigned_assets">Assigned</NavTab>
                        <NavTab to="/asset_management/scrap_assets">Scrap</NavTab>
                    </span>
                    : null
                }
                <NavTab to="/asset_management/current_assets">Currently Assigned</NavTab>
                <NavTab to="/asset_management/previous_assets">Previously Assigned</NavTab>

                {role_id === 3 ? < Link to='/employee_tracker/add_asset' className='btn btn-ems-ternary float-right m-2'>Add Asset <i className="ml-2 fa fa-plus-circle"></i></Link> : null}

                <Switch>
                    <Route exact path='/asset_management/current_assets' render={props => <CurrentAssets {...props} />} />
                    <Route exact path='/asset_management/previous_assets' render={props => <PreviousAssets {...props} />} />
                    <Route path='/asset_management/about_asset/:assetId' render={props => <AssetInformation {...props} />} />
                    <Route path='/asset_management/available_assets' render={props => <AvailableAssets {...props} />} />
                    <Route path='/asset_management/scrap_assets' render={props => <ScrapAssets {...props} />} />
                    <Route path='/asset_management/create_asset' render={props => <CreateAsset {...props} />} />
                    <Route path='/asset_management/update_asset/:assetId' render={props => <UpdateAsset {...props} />} />
                    <Route path='/asset_management/assigned_assets' render={props => <AssignedAssets {...props} />} />
                    <Redirect to='/asset_management/' />
                </Switch>


            </div>
        );
    }
}

const mapStateToProps = ({ }) => {
    return {}
}

export default connect(
    mapStateToProps,
)(AssetManagementHome);