import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {

    };
}

class EmployeeDetails extends Component {
    render() {
        return (
            <div>
                Hey everyone
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(EmployeeDetails);