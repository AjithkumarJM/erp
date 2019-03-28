import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';

import { getAssetDetails } from '../../services/assetManagement';
import { spinner, tableOptions } from '../../const';

class AssetInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { employeeById: {} }
    }

    componentDidMount = () => {
        const { getAssetDetails } = this.props;
        const { assetId } = this.props.match.params;

        getAssetDetails(assetId);
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderAssetLog = () => {
        const { asset_log } = this.props.assetInfo.response.data;

        return (
            < BootstrapTable
                data={asset_log}
                maxHeight='500'
                version='4'
                options={tableOptions}
                ignoreSinglePage pagination >
                <TableHeaderColumn isKey dataField='employee_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>EMPLOYEE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataAlign="center" dataFormat={this.formatDate}>ASSIGNED ON</TableHeaderColumn>
                <TableHeaderColumn dataField='released_on' dataAlign="center" dataFormat={this.formatDate}>RELEASED ON</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { assetInfo: { requesting, response } } = this.props;

        if (requesting === true) return <Loader show={true} message={spinner} />
        else if (response.data && response) {

            let { asset_serial_no, vendor_name, model, status_name, purchase_date,
                invoice_no, make, warranty_expiry_date, type_name, price, notes } = response.data.asset_details;

            return (
                <div className='p-2'>
                    <div className='row'>
                        <div className="col-12 page-header">
                            <h2>Asset Details</h2>
                            <Link to='/asset_management' className='btn btn-sm btn-ems-navigate float-right'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
                        </div>
                    </div>
                    <div className="shadow pt-3 bg-white pr-3 mb-3">
                        <Row>
                            <Col md={3} className='align-self-center'>
                                <div className='text-center'>
                                    <img className='rounded-circle mt-2' src={`/src/assets/images/assets_minimal.jpg`} height='80' width='80' />
                                    <h5 className='text-muted font-weight-bold mt-2'>{type_name} <span className='h6'>
                                        {/* ({asset_serial_no}) */}
                                    </span></h5>
                                    <p className='text-muted'>Serial # {asset_serial_no}</p>

                                </div>
                            </Col>

                            <div className='col-md-9 align-self-center'>
                                <Row>
                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-file-invoice' /> INVOICE #</small>
                                        <p className='text-custom-info font-weight-bold'> {invoice_no}</p>
                                    </Col>

                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-info-circle' /> STATUS</small>
                                        <p className='text-custom-info font-weight-bold'> {status_name}</p>
                                    </Col>

                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-briefcase' /> MAKE</small>
                                        <p className='text-custom-info font-weight-bold'> {make}</p>
                                    </Col>

                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-users' /> VENDOR</small>
                                        <p className='text-custom-info font-weight-bold'> {vendor_name}</p>
                                    </Col>

                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-cube' /> MODEL</small>
                                        <p className='text-custom-info font-weight-bold'> {model}</p>
                                    </Col>

                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-calendar-alt' /> PURCHASE DATE</small>
                                        <p className='text-custom-info font-weight-bold'> {moment(purchase_date).format('YYYY/MM/DD')}</p>
                                    </Col>

                                    <Col md={2}>
                                        <small className='text-muted'><i className='fa fa-money-bill-alt' /> PRICE</small>
                                        <p className='text-custom-info font-weight-bold'> {price}</p>
                                    </Col>

                                    {(() => {
                                        if (notes) {
                                            return (
                                                <Col md={2}>
                                                    <small className='text-muted'><i className='fa fa-sticky-note' /> NOTES</small>
                                                    <p className='text-custom-info font-weight-bold'> {notes}</p>
                                                </Col>
                                            )
                                        }
                                    })()}

                                    <Col md={3}>
                                        <small className='text-muted'><i className='fa fa-calendar-alt' /> WARRANTY EXPIRY DATE</small>
                                        <p className='text-custom-info font-weight-bold'> {moment(warranty_expiry_date).format('YYYY/MM/DD')}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                    </div>
                    {this.renderAssetLog()}
                </div>
            );
        } else return <Loader show={true} message={spinner} />
    }
}

const mapStateToProps = ({ assetInfo }) => {

    return { assetInfo }
}

export default connect(
    mapStateToProps, { getAssetDetails }
)(AssetInfo);