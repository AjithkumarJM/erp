import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAvailableAssets, viewAssetAction, assetStatus, getEmployeeAsset } from './../../actions'
import moment from 'moment';
import UpdateAsset from './updateAsset';
import AssignForm from './assignAssetForm'
import { Link } from 'react-router-dom';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';
import cookie from 'react-cookies';
import {
    DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

class AssetManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: cookie.load('session'),
            collapseState: 'collapse',
            collapseStateAssign: 'collapse',
            collapseStateScrap: 'collapse',
            identifier: 'AVAILABLE',
            selectedIds: [],
            selectedIdsAvailable: [],
            selectedIdsAssign: [],
            rowId: [],
            toggleAssign: false,
            updateStatus: false,
            addAsset: false,
            timelineAsset: [],
            alertOptions: {
                offset: 14,
                position: 'bottom right',
                theme: 'dark',
                time: 5000,
                transition: 'scale'
            },
            assignedOnDate: {
                assigned_on: moment(Date()).format('YYYY/MM/DD')
            },
            loader: {
                visible: false,
            },
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            modal: false,
            assetViewModal: false
        }

        this.toggle = this.toggle.bind(this);
        this.toggleAssetInfo = this.toggleAssetInfo.bind(this);

        this.apiCalls()
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    toggleAssetInfo() {
        this.setState({
            assetViewModal: !this.state.assetViewModal
        });
    }

    apiCalls(value) {
        value == undefined ? value = 'AVAILABLE' : null
        this.state.identifier = value;
        value != 'CURRENTLY_ASSIGN' && value != 'PREVIOUS_ASSETS' ? this.props.getAvailableAssets(value) : null
        this.props.getEmployeeAsset(this.state.data.employee_id, ((data) => {
            this.setState({ empAsset: data.data.data.currentAssignedAsset, timelineAsset: data.data.data.previousAssignedAsset })
        }))
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ availableAssets: nextProps.assets })
    }

    toggleCollapse() {
        this.setState({
            collapseState: 'collapse',
            collapseStateAssign: 'collapse',
            collapseStateScrap: 'collapse',
        })
    }

    renderWarrantyDate(date) {
        if (typeof (date) == 'string') {
            return moment((date.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return date;
        }
    }

    renderLoaderClass() {
        if (this.state.loader.visible == true) {
            return 'show'
        } else {
            return 'hide'
        }
    }

    onRowSelect(data, row, isSelected, e) {
        if (data == "AVAILABLE") {
            let index = this.state.selectedIdsAvailable.indexOf(row.id);
            index != -1 ? this.state.selectedIdsAvailable.splice(index, 1) : this.state.selectedIdsAvailable.push(row.id);
            index != -1 ? this.state.rowId.splice(index, 1) : this.state.rowId.push(row.id);
        } else {
            let index = this.state.selectedIdsAssign.indexOf(row.id);
            index != -1 ? this.state.selectedIdsAssign.splice(index, 1) : this.state.selectedIdsAssign.push(row.id);
        }
        let index = this.state.selectedIdsAvailable.indexOf(row.id);
        // console.log(this.state.selectedIdsAvailable)
        // console.log(this.state.rowId)
        // console.log(this.state.selectedIdsAssign)
    }

    onSelectAll(data, isSelected, rows) {
        if (isSelected == true) {
            if (data == 'AVAILABLE') {
                rows.map((row, index) => {
                    let indexN = this.state.selectedIdsAvailable.indexOf(row.id);
                    indexN != -1 ? null : this.state.selectedIdsAvailable.push(row.id);
                    indexN != -1 ? null : this.state.rowId.push(row.id);
                })
            } else if (data == 'ASSIGNED') {
                rows.map((row, index) => {
                    let indexN = this.state.selectedIdsAssign.indexOf(row.id);
                    indexN != -1 ? null : this.state.selectedIdsAssign.push(row.id);
                })
            }
        } else {
            this.state.rowId = []
            this.state.selectedIdsAvailable = []
            this.state.selectedIdsAssign = []
        }
    }

    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    handleRowSelect(row) {
        this.props.viewAssetAction(row.id, (data) => {
            this.setState({ assetDetails: data.data.data.asset_details, assetLog: data.data.data.asset_log })
        })

        this.setState({ assetViewModal: !this.state.assetViewModal })

    }

    scrapTheAsset(status) {
        this.setState({ modal: !this.state.modal })
        let apiId;
        let values;
        values = {
            "asset_id_list": this.state.identifier == 'ASSIGNED' ? this.state.selectedIdsAssign : this.state.selectedIdsAvailable,
            "status_name": "SCRAP"
        }
        status == 'SCRAPinASSIGN' ? apiId = 'ASSIGNED' : apiId = 'AVAILABLE'

        this.setState({ loader: { visible: true } })
        this.props.assetStatus(values, (data) => {
            this.props.getAvailableAssets(apiId)
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false } }
                )
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 5000
                })
                this.refs.table.setState({
                    selectedRowKeys: [],
                });

                if (this.state.identifier == 'ASSIGNED') {
                    this.state.selectedIdsAssign = []
                } else {
                    this.state.selectedIdsAvailable = []
                    this.state.rowId = []
                }
            } else {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'error',
                    theme: 'dark',
                    time: 5000
                })
            }
        })
    }

    scrapPrompt(value) {
        if (value == 'SCRAPinAVAILABLE') {
            if (this.state.identifier == 'AVAILABLE' && this.state.selectedIdsAvailable.length != 0 && this.state.rowId.length != 0) {
                // this.state.selectedIdsAvailable != [] ? $('#scrap_prompt').modal('show') : null
                this.state.selectedIdsAvailable != [] ? this.setState({ modal: !this.state.modal }) : null

            } else {
                this.msg.show("please select an Asset", {
                    position: 'bottom right',
                    type: 'info',
                    theme: 'dark',
                    time: 5000
                })
            }
        } else if (value == 'SCRAPinASSIGN') {
            if (this.state.identifier == 'ASSIGNED' && this.state.selectedIdsAssign.length != 0) {
                this.state.selectedIdsAssign != [] ? $('#scrap_prompt').modal('show') : null
            } else {
                this.msg.show("please select an Asset", {
                    position: 'bottom right',
                    type: 'info',
                    theme: 'dark',
                    time: 5000
                })
            }
        }
    }

    assignAsset(status) {
        let apiId;
        let values;

        if (status == 'MoveToAvailable') {
            if (this.state.identifier == 'ASSIGNED') {
                values = {
                    "asset_id_list": this.state.selectedIdsAssign,
                    "status_name": 'AVAILABLE'
                }
                apiId = 'ASSIGNED'
            }
        }

        if (this.state.identifier == 'ASSIGNED') {
            if (this.state.selectedIdsAssign.length != 0) {


                if (status) {
                    this.setState({ loader: { visible: true } })
                    this.props.assetStatus(values, (data) => {
                        this.props.getAvailableAssets(apiId)
                        if (data.data.code == 'EMS_001') {
                            this.setState({ loader: { visible: false } })
                            this.msg.show(data.data.message, {
                                position: 'bottom right',
                                type: 'success',
                                theme: 'dark',
                                time: 5000
                            })
                            this.refs.table.setState({
                                selectedRowKeys: [],
                            });
                            // this.state.selectedIdsAvailable = []                            
                            this.state.selectedIdsAssign = []
                            // this.state.rowId = []


                        } else {
                            this.setState({ loader: { visible: false } })
                            this.msg.show(data.data.message, {
                                position: 'bottom right',
                                type: 'error',
                                theme: 'dark',
                                time: 5000
                            })
                            this.refs.table.setState({
                                selectedRowKeys: [],
                            });
                        }
                    })
                }
            } else {
                this.msg.show("please select an Asset", {
                    position: 'bottom right',
                    type: 'info',
                    theme: 'dark',
                    time: 5000
                })
            }
        }

        if (this.state.identifier == 'AVAILABLE') {
            if (this.state.rowId.length != 0 || this.state.selectedIdsAvailable.length != 0) {
                if (this.state.selectedIdsAvailable.length != 0) {
                    status == 'ASSIGNinAVAILABLE' ? this.setState({ toggleAssign: true, selectedIdsAvailable: [] }) : null;
                }
            } else {
                this.msg.show("please select an Asset", {
                    position: 'bottom right',
                    type: 'info',
                    theme: 'dark',
                    time: 5000
                })
            }
        }
    }

    updateReroute() {
        this.props.getAvailableAssets('AVAILABLE')
        this.setState({ updateStatus: false })
        this.state.rowId = []
        this.state.selectedIdsAvailable = []
        this.state.selectedIdsAssign = []
    }
    reRoute() {
        this.setState({
            toggleAssign: false,
            addAsset: false,
        })
        this.state.rowId = []
        this.state.selectedIdsAvailable = []
        this.state.selectedIdsAssign = []
    }

    renderupdate(row, cell) {
        return (
            <div>
                <button className="btn ems-btn-ternary" onClick={this.update.bind(this, cell)}>Update</button>
            </div>
        )
    }

    update(values, e) {
        e.stopPropagation()
        this.props.viewAssetAction(values.id, (data) => {
            data.data.data.asset_details.purchase_date = this.renderWarrantyDate(data.data.data.asset_details.purchase_date)
            this.setState({
                updateAssetData: data.data.data.asset_details,
                updateStatus: true
            });
        })
    }

    renderDates(doj) {
        if (typeof (doj) == 'string') {
            return moment((doj.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return doj;
        }
    }

    assetLogGrid() {
        const options = {
            sizePerPage: 10,  // which size per page you want to locate as default            
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }],
            paginationSize: 3,  // the pagination bar size.                        
            paginationShowsTotal: this.renderPaginationShowsTotal,
            sizePerPageDropDown: this.renderSizePerPageDropDown,
            nextPage: 'Next',
            prePage: 'Previous',
            noDataText: 'There is no data to display',
        };
        return (
            < BootstrapTable
                data={this.state.assetLog}
                maxHeight='500' version='4'
                options={options}
                ignoreSinglePage pagination
                trClassName={this.rowClassNameFormat} >
                <TableHeaderColumn isKey dataField='employee_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee ID</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataAlign="center" dataFormat={this.renderDates}>Assigned On</TableHeaderColumn>
                <TableHeaderColumn dataField='released_on' dataAlign="center" dataFormat={this.renderDates}>Released On</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    viewDetailsRendering(row, cell) {
        return (
            <button className='btn ems-btn-ternary' data-toggle="modal" data-target=".bd-example-modal-lg" onClick={this.getAssetDetails.bind(this, cell)}>View</button>
        )
    }

    assetAssignedTable(row) {
        const selectRowProp = {
            mode: this.state.identifier != 'SCRAP' ? 'checkbox' : null,
            clickToSelect: false,
            onSelect: this.onRowSelect.bind(this, this.state.identifier),
            onSelectAll: this.onSelectAll.bind(this, this.state.identifier)
        };

        const options = {
            sizePerPage: 10,
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }],
            paginationSize: 3,
            paginationShowsTotal: this.renderPaginationShowsTotal,
            sizePerPageDropDown: this.renderSizePerPageDropDown,
            nextPage: 'Next',
            prePage: 'Previous',
            noDataText: 'There is no data to display',
            onRowClick: this.handleRowSelect.bind(this)
        };
        return (
            < BootstrapTable
                selectRow={selectRowProp}
                data={this.state.availableAssets}
                maxHeight='500' version='4' options={options}
                ref='table'
                ignoreSinglePage pagination
                hover={true} tableStyle={{ cursor: "pointer" }} trClassName={this.rowClassNameFormat} >
                <TableHeaderColumn isKey dataField='id' hidden dataAlign="center" >id</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee Name</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Employee ID</TableHeaderColumn>
                <TableHeaderColumn dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Serial #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Make</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataFormat={this.renderDates} dataAlign="center">Assigned On</TableHeaderColumn>
                <TableHeaderColumn dataField='warranty_expiry_date' dataAlign="center" dataSort dataFormat={this.renderWarrantyDate}>Warranty Expires On</TableHeaderColumn>
                <TableHeaderColumn dataField='scrap_date' dataAlign="center" dataFormat={this.renderDates} hidden={this.state.identifier != 'SCRAP' ? true : false}>Scrap Date</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.viewDetailsRendering.bind(this)}>Details</TableHeaderColumn> */}
                <TableHeaderColumn dataField='' dataAlign="center" hidden={this.state.identifier != 'SCRAP' ? false : true} dataFormat={this.renderupdate.bind(this)}>Update Asset</TableHeaderColumn>
            </BootstrapTable>
        )
    }
    assetAvailableTable(row) {
        const selectRowProp = {
            mode: this.state.identifier != 'SCRAP' ? 'checkbox' : null,
            clickToSelect: false,
            onSelect: this.onRowSelect.bind(this, this.state.identifier),
            onSelectAll: this.onSelectAll.bind(this, this.state.identifier)
        };


        const options = {
            sizePerPage: 10,
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }],
            paginationSize: 3,
            paginationShowsTotal: this.renderPaginationShowsTotal,
            sizePerPageDropDown: this.renderSizePerPageDropDown,
            nextPage: 'Next',
            prePage: 'Previous',
            noDataText: 'There is no data to display',
            onRowClick: this.handleRowSelect.bind(this)
        };
        return (
            < BootstrapTable
                selectRow={selectRowProp}
                data={this.state.availableAssets}
                maxHeight='500' version='4' options={options}
                ref='table'
                ignoreSinglePage pagination
                hover={true} tableStyle={{ cursor: "pointer" }} trClassName={this.rowClassNameFormat} >
                <TableHeaderColumn isKey dataField='id' hidden dataAlign="center" >id</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='employee_name' dataAlign="center" hidden={this.state.identifier == 'ASSIGNED' ? false : true} >Employee Name</TableHeaderColumn> */}
                {/* <TableHeaderColumn dataField='employee_id' dataAlign="center" hidden={this.state.identifier == 'ASSIGNED' ? false : true} >Employee ID</TableHeaderColumn> */}
                <TableHeaderColumn dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Serial #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Make</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center" >Model</TableHeaderColumn>
                <TableHeaderColumn dataField='warranty_expiry_date' dataAlign="center" dataSort dataFormat={this.renderWarrantyDate}>Warranty Expires On</TableHeaderColumn>
                <TableHeaderColumn dataField='scrap_date' dataAlign="center" dataFormat={this.renderDates} hidden={this.state.identifier != 'SCRAP' ? true : false}>Scrap Date</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.viewDetailsRendering.bind(this)}>Details</TableHeaderColumn> */}
                <TableHeaderColumn dataField='' dataAlign="center" hidden={this.state.identifier != 'SCRAP' ? false : true} dataFormat={this.renderupdate.bind(this)}>Update Asset</TableHeaderColumn>
            </BootstrapTable>
        )
    }


    renderList() {
        if (this.state.data.role_id == "3") {
            return (
                <ul className="nav nav-tabs nav-justified " role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#available_assets" role="tab" onClick={() => this.apiCalls('AVAILABLE')}>Available</a>
                    </li>
                    <li className="nav-item" >
                        <a className="nav-link " onClick={() => this.apiCalls('ASSIGNED')} data-toggle="tab" href="#assigned_assets" role="tab">Assigned</a>
                    </li>
                    <li className="nav-item" >
                        <a className="nav-link " onClick={() => this.apiCalls('SCRAP')} data-toggle="tab" href="#assets_in_scrap" role="tab">In Scrap</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#currently_assigned" role="tab" onClick={() => this.apiCalls('CURRENTLY_ASSIGN')}>Currently Assigned</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#previously_assigned" role="tab" onClick={() => this.apiCalls('PREVIOUS_ASSETS')}>Previously Assigned</a>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="nav nav-tabs nav-justified " role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#currently_assigned_employee" role="tab" onClick={() => this.apiCalls('CURRENTLY_ASSIGN')}>Currently Assigned</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#previously_assigned_employee" role="tab" onClick={() => this.apiCalls('PREVIOUS_ASSETS')}>Previously Assigned</a>
                    </li>
                </ul>
            )
        }
    }

    renderEmpAsset() {
        if (this.state.identifier == 'CURRENTLY_ASSIGN' || this.state.identifier == 'AVAILABLE') {
            const options = {
                sizePerPage: 10,
                sizePerPageList: [{
                    text: '10', value: 10
                }, {
                    text: '25', value: 25
                }, {
                    text: '50', value: 50
                }],
                paginationSize: 3,
                paginationShowsTotal: this.renderPaginationShowsTotal,
                sizePerPageDropDown: this.renderSizePerPageDropDown,
                nextPage: 'Next',
                prePage: 'Previous',
                noDataText: 'There is no data to display',
            };
            return (
                < BootstrapTable
                    data={this.state.empAsset}
                    maxHeight='500' version='4' options={options}
                    ignoreSinglePage pagination
                    hover={true} tableStyle={{ cursor: "pointer" }} trClassName={this.rowClassNameFormat} >
                    <TableHeaderColumn isKey dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Serial #</TableHeaderColumn>
                    <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Make</TableHeaderColumn>
                    <TableHeaderColumn dataField='type_name' dataAlign="center">Type</TableHeaderColumn>
                    <TableHeaderColumn dataField='model' dataAlign="center">Model</TableHeaderColumn>
                    <TableHeaderColumn dataField='assigned_on' dataFormat={this.renderDates} dataAlign="center">Assigned On</TableHeaderColumn>
                </BootstrapTable>
            )
        } else if (this.state.identifier == 'PREVIOUS_ASSETS') {
            if (this.state.timelineAsset.length == 0) {
                return (
                    <div className="alert ems-info text-center" role="alert">There is no data to display</div>
                )
            } else {
                let timeline = this.state.timelineAsset.map((data, index) => {
                    return (
                        <article className="timeline-entry assetMarginWrap">
                            <div className="timeline-entry-inner">
                                <time className="timeline-time" datetime="2014-01-10T03:45">Released On<span>{this.renderWarrantyDate(data.released_on)}</span> <span>{moment(data.released_on).format('dddd')}</span></time>
                                <div className="timeline-icon">
                                    <i className="fa fa-calendar"></i>
                                </div>
                                <div className="timeline-label">
                                    <h2><a href="#">{data.type_name} | {data.asset_serial_no}</a> <p>{data.make}  (Model: {data.model})</p></h2>
                                    <p>Assigned on {<strong className='h6'>{moment(data.assigned_on).format('LL')}</strong>}</p>
                                </div>
                            </div>
                        </article>
                    )
                })
                return (
                    <div className='row justify-content-md-center'>
                        <div className="timeline-centered">
                            {timeline}
                        </div>
                    </div>
                )
            }
        }
    }

    renderTab() {
        if (this.state.data.role_id == "3") {
            return (
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light justify-content-between custom-background-color">
                        <div className="">
                            <button type="button" className="btn leftMargin ems-btn-ternary float-right btn-spacing" onClick={this.assignAsset.bind(this, 'ASSIGNinAVAILABLE')}><i className="fa fa-check-square-o" aria-hidden="true"></i>  Assign</button>
                            <button type="button" className="btn ems-btn-ternary float-right" onClick={this.scrapPrompt.bind(this, 'SCRAPinAVAILABLE')}><i className="fa fa-trash-o" aria-hidden="true"></i>  Scrap</button>
                        </div>
                    </nav>
                    {this.assetAvailableTable()}
                </div>
            )
        }
    }

    renderTab2() {
        if (this.state.data.role_id == '3') {
            return (
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light justify-content-between custom-background-color">
                        <div className="">
                            <button type="button" className="btn leftMargin ems-btn-ternary float-right btn-spacing" onClick={this.assignAsset.bind(this, 'MoveToAvailable')}><i className="fa fa-chevron-circle-right" aria-hidden="true"></i>  Move to Available</button>
                            <button type="button" className="btn ems-btn-ternary float-right" onClick={this.scrapPrompt.bind(this, 'SCRAPinASSIGN')}><i className="fa fa-trash-o" aria-hidden="true"></i>  Scrap</button>
                        </div>
                    </nav>
                    {this.assetAssignedTable()}
                </div>
            )
        }
    }
    render() {
        if (this.state.toggleAssign == false && this.state.updateStatus == false) {
            return (
                <div>
                    <Loader show={this.state.loader.visible} message={this.state.spinner} />
                    <AlertContainer ref={a => this.msg = a} {...this.state.alertOptions} />
                    <div className='row'>
                        <div className="col-12 page-header">
                            <h2>{this.props.userDetails.role_id == "3" ? "Asset Management" : "Assets"}</h2>
                            {(() => {
                                if (this.state.data.role_id == 3) {
                                    return (
                                        <Link to='/create_asset' className='btn float-right ems-btn-ternary'><i className="fa fa-plus" aria-hidden="true"></i> Add Asset</Link>
                                    )
                                }
                            })()}
                        </div>
                    </div>
                    <div className='tab-set'>
                        {this.renderList()}
                        <div className='tab-content'>
                            <div className='tab-pane active' id="available_assets" role="tabpanel">
                                {this.renderTab()}
                            </div>
                            <div className='tab-pane fade' id="assigned_assets" role="tabpanel">
                                {this.renderTab2()}
                            </div>
                            <div className='tab-pane fade' id="assets_in_scrap" role="tabpanel">
                                {this.assetAvailableTable()}
                            </div>
                            <div className='tab-pane fade' id="currently_assigned" role="tabpanel">
                                {this.renderEmpAsset()}
                            </div>
                            <div className='tab-pane fade' id="previously_assigned" role="tabpanel">
                                {this.renderEmpAsset()}
                            </div>
                        </div>
                        {(() => {
                            if (this.state.data.role_id != 3) {
                                return (
                                    <div className='tab-content'>
                                        <div className='tab-pane active' id="currently_assigned_employee" role="tabpanel">
                                            {this.renderEmpAsset()}
                                        </div>
                                        <div className='tab-pane fade' id="previously_assigned_employee" role="tabpanel">
                                            {this.renderEmpAsset()}
                                        </div>
                                    </div>
                                )
                            }
                        })()}
                    </div>
                    <Modal isOpen={this.state.assetViewModal} toggle={this.toggleAssetInfo} className={this.props.className}  size='lg' backdrop='static'>
                        <ModalHeader toggle={this.toggleAssetInfo}>Asset Details</ModalHeader>
                        <ModalBody>
                            <div className='row breadcrumb-wrap'>
                                <h6 className='col-3 font-styling'>Asset Serial #</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.asset_serial_no : null}</p>

                                <h6 className='col-3 font-styling'>Vendor Name</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.vendor_name : null}</p>

                                <h6 className='col-3 font-styling'>Model</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.model : null}</p>

                                <h6 className='col-3 font-styling'>Status</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.status_name : null}</p>

                                <h6 className='col-3 font-styling'>Purchased Date</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.renderWarrantyDate(this.state.assetDetails.purchase_date) : null}</p>

                                <h6 className='col-3 font-styling'>Invoice #</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.invoice_no : null}</p>

                                <h6 className='col-3 font-styling'>Make</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.make : null}</p>

                                <h6 className='col-3 font-styling'>Warranty Expires On</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.renderWarrantyDate(this.state.assetDetails.warranty_expiry_date) : null}</p>

                                <h6 className='col-3 font-styling'>Type</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.type_name : null}</p>

                                <h6 className='col-3 font-styling'>Cost</h6>
                                <p className='col-3'>{this.state.assetDetails ? ":    " + this.state.assetDetails.price : null}</p>

                                <div className="col-12">
                                    <div className="row">
                                        <h6 className='col-3 font-styling'>Notes</h6>
                                        <p className='col-9'>{this.state.assetDetails ? this.state.assetDetails.notes ? ":    " + this.state.assetDetails.notes : ":    Not Entered" : null}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row breadcrumb-wrap'>
                                <ol className="breadcrumb col-12">
                                    <h5><li className="breadcrumb-item active">Asset Log</li>
                                    </h5>
                                </ol>
                            </div>
                            <div className="assetLogEqualPadding">
                                {this.assetLogGrid()}
                            </div>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
                        <ModalBody>
                            <h4 className="offset-md-2 col-md-8 col-md-2 text-center">Are you sure, you want to scrap the Asset(s) ?</h4>
                        </ModalBody>
                        <ModalFooter>
                            <button type="button" className="btn btn-sm btn-ems-primary" onClick={this.scrapTheAsset.bind(this, this.state.identifier == 'AVAILABLE' ? 'SCRAPinAVAILABLE' : 'SCRAPinASSIGN')}>Yes</button>
                            <button type="button" className="btn btn-sm btn-ems-secondary" onClick={() => this.setState({ modal: !this.state.modal })}>No</button>
                        </ModalFooter>
                    </Modal>
                </div >
            )
        }
        else if (this.state.toggleAssign == true) {
            return (
                <div className='row'>
                    <div className="col-12 page-header">
                        <h2>Assign</h2>
                        <button onClick={this.reRoute.bind(this)} className='btn float-right ems-btn-ternary'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</button>
                    </div>
                    <div className='col-md-12'>
                        <AssignForm callback={this.reRoute.bind(this)} assetId={this.state.rowId} initialValues={this.state.assignedOnDate} />
                    </div>
                </div>
            )
        } else if (this.state.updateStatus == true) {
            return (
                <div className='row'>
                    <div className="col-12 page-header">
                        <h2>Update Asset</h2>
                        <button onClick={this.updateReroute.bind(this)} className='btn float-right ems-btn-ternary'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</button>
                    </div>
                    <div className='col-md-12'>
                        <UpdateAsset initialValues={this.state.updateAssetData} callback={this.updateReroute.bind(this)} />
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        userDetails: state.userInformation,
        assets: state.availableAssets,
    };
}

export default connect(mapStateToProps, { getAvailableAssets, viewAssetAction, assetStatus, getEmployeeAsset })(AssetManagement);     