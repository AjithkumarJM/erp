import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class AssetInformation extends Component {
    render() {
        return (
            <div>
                Asset Info
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(AssetInformation);