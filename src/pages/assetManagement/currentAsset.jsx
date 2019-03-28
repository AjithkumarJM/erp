import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { spinner, alertOptions, userInfo, tableOptions } from '../../const';
import { getAssetById } from '../../services/assetManagement';

class CurrentAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputValues: [],
            toggleButton: false,
            loader: false
        }
    }

    componentWillMount() {
        const { getAssetById } = this.props;
        const { employeeId } = this.props.match.params;

        getAssetById(employeeId);
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderAssetLink = (row, { asset_serial_no }) => asset_serial_no

    renderAssetTable = () => {

        const { currentAssignedAsset } = this.props.assetById.response.data;

        return (
            < BootstrapTable
                data={currentAssignedAsset}
                version='4'
                options={tableOptions}
                ignoreSinglePage
                pagination
            >
                <TableHeaderColumn isKey dataField='id' hidden dataAlign="center"  >id</TableHeaderColumn>
                <TableHeaderColumn dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.renderAssetLink}>SERIAL #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>MAKE</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center" >Model</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataAlign="center" dataSort dataFormat={this.formatDate}>ASSIGNED ON</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { assetById: { requesting, response } } = this.props;
        const { loader } = this.state;

        if (requesting) return <Loader show={true} message={spinner} />
        else if (response.data) {
            return (
                <div className='p-2 pt-3'>
                    <Loader show={loader} message={spinner} />
                    {this.renderAssetTable()}
                </div>
            );
        } else return <Loader show={true} message={spinner} />
    }
}

const mapStateToProps = ({ assetById }) => {
    return { assetById }
}

export default connect(
    mapStateToProps, { getAssetById }
)(CurrentAssets);