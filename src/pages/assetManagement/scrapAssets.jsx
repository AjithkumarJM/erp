import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { spinner, alertOptions, userInfo, tableOptions } from '../../const';
import { getAssets, postAssetStatus } from '../../services/assetManagement';

class ScrapAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputValues: [],
            toggleButton: false,
            loader: false
        }
    }

    componentWillMount() {
        const { getAssets } = this.props;
        getAssets('SCRAP');
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderAssetLink = (row, { asset_serial_no }) => asset_serial_no

    renderAssetTable = () => {
        const { data } = this.props.assetsList.response;

        return (
            < BootstrapTable
                data={data}
                version='4'
                options={tableOptions}
                ignoreSinglePage
                pagination
            >
                <TableHeaderColumn isKey dataField='id' hidden dataAlign="center"  >id</TableHeaderColumn>
                <TableHeaderColumn dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.renderAssetLink}>SERIAL #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>MAKE</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center" >MODEL</TableHeaderColumn>
                <TableHeaderColumn dataField='warranty_expiry_date' dataAlign="center" dataSort dataFormat={this.formatDate}>WARRANTY EXPIRES ON</TableHeaderColumn>
                <TableHeaderColumn dataField='scrap_date' dataAlign="center" dataFormat={this.formatDate} >SCRAP DATE</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { assetsList: { requesting } } = this.props;
        const { loader } = this.state;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='p-2 pt-3'>
                    <Loader show={loader} message={spinner} />
                    {this.renderAssetTable()}
                </div>
            );
        }
    }
}

const mapStateToProps = ({ assetsList }) => {
    return { assetsList }
}

export default connect(
    mapStateToProps, { getAssets, postAssetStatus }
)(ScrapAssets);