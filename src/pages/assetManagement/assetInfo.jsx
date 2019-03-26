import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class AssetInfo extends Component {
    render() {
        return (
            <div>
                This is asset information
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(AssetInfo);