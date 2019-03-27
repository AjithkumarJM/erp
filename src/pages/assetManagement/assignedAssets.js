import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'

import { spinner, alertOptions, userInfo, tableOptions } from '../../const';
import { getAssets, postAssetStatus } from '../../services/assetManagement';

class AssignedAssets extends Component {
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
        getAssets('ASSIGNED');
    }

    handleOnRowSelect = ({ id }, isSelected) => {
        const { outputValues } = this.state;
        let index = outputValues.indexOf(id)

        if (isSelected === true) {
            outputValues.push(id)
            this.setState({ toggleButton: true })
        } else {
            outputValues.splice(index, 1)
            outputValues.length === 0 ? this.setState({ toggleButton: false }) : null
        }
    }

    handleOnSelectAll = (isSelected, row) => {
        const { outputValues } = this.state;

        if (isSelected === true) {
            _.map(row, ({ id }) => outputValues.push(id))
            this.setState({ toggleButton: true })
        } else {
            this.state.outputValues.splice(0, outputValues.length)
            outputValues.length === 0 ? this.setState({ toggleButton: false }) : null
        }
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, { id }) => <Link to={`/asset_management/update_asset/${id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

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

    notify = (message, type) => this.msg.show(message, { type })

    onSubmitAsset = type => {
        const { outputValues } = this.state;
        const { postAssetStatus, getAssets } = this.props;

        let values = {
            "asset_id_list": outputValues,
            "status_name": type
        }

        this.setState({ loader: true })
        postAssetStatus(values, response => {
            const { code, message } = response.data;
            if (code === 'EMS_001') {
                getAssets('ASSIGNED');
                this.setState({ loader: false })
                this.notify(message, 'success')
            } else {
                this.notify(message, 'error')
                this.setState({ loader: false })
            }
        })
    }

    renderActionButtons = () => {
        const { outputValues: { length }, toggleButton } = this.state;

        if (toggleButton && length !== 0) {

            return (
                <div className='actionBtnStyling'>
                    <button className='btn btn-secondary float-right btn-ems-ternary btn-sm' onClick={() => this.onSubmitAsset('AVAILABLE')}>Move To Available
                <i className='fa fa-tasks ml-2' /></button>

                    <button className='btn btn-secondary float-right btn-ems-ternary btn-sm mr-1' onClick={() => this.onSubmitAsset('SCRAP')}>Scrap Asset
                <i className='fa fa-trash ml-2' /></button>
                </div>
            );
        }
    }

    render() {
        const { assetsList: { requesting } } = this.props;
        const { loader } = this.state;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='p-2 pt-3'>
                    <Loader show={loader} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    {this.renderAssetTable()}
                    {this.renderActionButtons()}
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
)(AssignedAssets);