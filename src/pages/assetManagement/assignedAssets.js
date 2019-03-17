import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAvailableAssets, viewAssetAction } from './../../actions'
import moment from 'moment';
import AlertContainer from 'react-alert'

class AssignedAssetsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: [],
            alertOptions: {
                offset: 14,
                position: 'bottom right',
                theme: 'dark',
                time: 5000,
                transition: 'scale'
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ assignedList: nextProps.assets })
    }

    onRowSelect(row, isSelected, e) {
        isSelected == true ? this.state.selectedIds.push(row.id) : this.state.selectedIds = []
    }

    onSelectAll(isSelected, rows) {
        isSelected == true ? this.state.selectedIds.push(rows.id) : this.state.selectedIds = []
    }

    rowClassNameFormat(row, rowIdx) {
        return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
    }

    renderWarrantyDate(date) {
        if (typeof (date) == 'string') {
            return moment((date.split('T'))[0]).format('YYYY/MM/DD');
        } else {
            return date;
        }
    }

    assignAsset(status) {
        if (this.state.selectedIds.length != 0) {
            status == 'ASSIGN' ? this.setState({ toggleAssign: true, selectedIds: [] }) : null;
        } else {
            this.msg.show("please select an Asset", {
                position: 'bottom right',
                type: 'info',
                theme: 'dark',
                time: 5000
            })
        }
    }

    assignedTable() {
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: false,
            onSelect: this.onRowSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this)
            // unselectable: nextProps.unselectable
        };

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
            noDataText: 'No Results Found',
            // onRowClick: this.handleRowSelect.bind(this)
        };

        return (
            < BootstrapTable
                selectRow={selectRowProp}
                data={this.state.assignedList}
                maxHeight='500' version='4' options={options}
                ignoreSinglePage pagination
                hover={true} tableStyle={{ cursor: "pointer" }} trClassName={this.rowClassNameFormat} >
                <TableHeaderColumn isKey dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Serial #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>Make</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center">Model</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center">Type</TableHeaderColumn>
                <TableHeaderColumn dataField='warranty_expiry_date' dataAlign="center" dataSort dataFormat={this.renderWarrantyDate}>warranty Expires On</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.viewDetailsRendering.bind(this)}>Details</TableHeaderColumn> */}
                <TableHeaderColumn dataField='employee_name' dataAlign="center" >Assigned To</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataAlign="center" dataFormat={this.renderWarrantyDate}>Assigned Date</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        return (
            <div>
                <AlertContainer ref={a => this.msg = a} {...this.state.alertOptions} />
                <nav className="navbar navbar-expand-lg navbar-light justify-content-between custom-background-color">
                    <div className="">
                        <button type="button" className="btn leftMargin ems-btn-ternary btn-spacing float-right" onClick={this.assignAsset.bind(this, 'ASSIGN')}><i className="fa fa-plus" aria-hidden="true"></i>  Move To Available</button>
                        <button type="button" className="btn ems-btn-ternary float-right" onClick={this.assignAsset.bind(this, 'SCRAP')}><i className="fa fa-trash-o" aria-hidden="true"></i>  Scrap</button>
                    </div>
                </nav>
                {this.assignedTable()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userDetails: state.userInformation,
        assets: state.availableAssets,
    };
}

export default (connect(mapStateToProps, { getAvailableAssets, viewAssetAction }))(AssignedAssetsTable);
