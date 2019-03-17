import React, { Component } from 'react'
import CreateAsset from './createAsset';
import AssetBulkupload from './assetBulkupload';
import { Link } from 'react-router-dom';

export default class addAsset extends Component {

    render() {
        return (
            <div>
                <div className='row'>
                    <div className="col-12 page-header">
                        <h2>Create Asset</h2>
                        <Link to='/asset_management' className='btn float-right ems-btn-ternary'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
                    </div>
                    <div className='col-md-12'>
                        <div>
                            <CreateAsset />
                            <ol className="breadcrumb assetWrap font-weight-bold">
                                <li className="breadcrumb-item active">Asset Bulkupload</li>
                            </ol>
                            <AssetBulkupload />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}