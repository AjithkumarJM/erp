import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class AssignProject extends Component {
    render() {
        return (
            <div>
                here comes assign
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(AssignProject);