import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { spinner, alertOptions, userInfo, tableOptions } from '../../const';
import { getAssets } from '../../services/assetManagement';

class AvailableAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputValues: []
        }
    }

    componentWillMount() {
        const { getAssets } = this.props;
        getAssets('AVAILABLE');
    }

    handleOnRowSelect = ({ id }, isSelected) => {
        const { outputValues } = this.state;
        let index = outputValues.indexOf(id)

        isSelected === true ? outputValues.push(id) : outputValues.splice(index, 1)
    }

    handleOnSelectAll = (isSelected, row) => {
        const { outputValues } = this.state;
        // console.log(row, isSelected);
        if (isSelected === true) _.map(row, ({ id }) => outputValues.push(id))
        else this.setState({ outputValues: [] })
        
        console.log(outputValues)
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, cell) => <Link to={`/asset_management/update_asset/`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    renderAssetLink = (row, { asset_serial_no, id }) => <Link to={`/asset_management/info/${id}`}>{asset_serial_no}</Link>

    renderAssetTable = () => {
        const { data } = this.props.assetsList.response;

        const selectRowOptions = {
            mode: "checkbox",
            clickToSelect: false,
            onSelect: this.handleOnRowSelect,
            onSelectAll: this.handleOnSelectAll
        };

        return (
            < BootstrapTable
                selectRow={selectRowOptions}
                data={data}
                version='4'
                options={tableOptions}
                ignoreSinglePage
                pagination
            >
                <TableHeaderColumn isKey dataField='id' hidden dataAlign="center"  >id</TableHeaderColumn>
                <TableHeaderColumn dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.renderAssetLink}>Serial #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Make</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center" >Model</TableHeaderColumn>
                <TableHeaderColumn dataField='warranty_expiry_date' dataAlign="center" dataSort dataFormat={this.formatDate}>Warranty Expires On</TableHeaderColumn>
                <TableHeaderColumn dataField='scrap_date' dataAlign="center" dataFormat={this.formatDate} >Scrap Date</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate}>Action</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { assetsList: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='p-2 pt-3'>
                    {this.renderAssetTable()}
                    <div className='actionBtnStyling'>
                        <button className='btn btn-secondary float-right btn-ems-ternary btn-sm'>Assign Asset
                        <i className='fa fa-tasks ml-2' /></button>

                        <button className='btn btn-secondary float-right btn-ems-ternary btn-sm mr-1'>Scrap Asset
                        <i className='fa fa-trash ml-2' /></button>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = ({ assetsList }) => {
    return { assetsList }
}

export default connect(
    mapStateToProps, { getAssets }
)(AvailableAssets);