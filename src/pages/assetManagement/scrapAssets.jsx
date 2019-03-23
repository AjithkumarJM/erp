import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class ScrapAssets extends Component {
    render() {
        return (
            <div>
                scrap asset
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(ScrapAssets);