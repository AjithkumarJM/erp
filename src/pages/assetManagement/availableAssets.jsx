import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';

import { spinner, alertOptions, userInfo } from '../../const';
import { getAssets } from '../../services/assetManagement';

class AvailableAssets extends Component {
    componentWillMount() {
        const { getAssets } = this.props;
        getAssets('AVAILABLE');
    }

    renderAssetTable = () => {

    }

    render() {
        const { assetsList: { requesting } } = this.props;

        // if (requesting) return <Loader show={true} message={spinner} />
        // else {
        return (
            <div className='p-2 pt-3'>
                this is available
                {/* <button className='btn btn-secondary float-right'>Assign</button> */}
            </div>
        );
    }
    // }
}

const mapStateToProps = ({ assetsList }) => {
    return { assetsList }
}

export default connect(
    mapStateToProps, { getAssets }
)(AvailableAssets);