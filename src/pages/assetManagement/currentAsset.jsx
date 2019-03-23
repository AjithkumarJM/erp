import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class CurrentAssets extends Component {
    render() {
        return (
            <div>
                currentAssetss
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(CurrentAssets);