import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class PreviousAssets extends Component {
    render() {
        return (
            <div>
                previous assets
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(PreviousAssets);