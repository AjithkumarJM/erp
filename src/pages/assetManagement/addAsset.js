import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'

import AssetBulkupload from './assetBulkupload';
import FormField from '../../const/form-field';
import { validator } from '../../const/form-field/validator';
import { spinner, alertOptions } from '../../const';
import { getAssetTypes, postCreateAsset } from '../../services/assetManagement';

class AddAsset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            modal: false,
        };
    }

    // componentWillMount = () => {this.props.getAssetTypes();

    toggle = () => this.setState({ modal: !this.state.modal });

    notify = (message, type) => this.msg.show(message, { type });

    onSubmitAddasset = values => {
        const { reset, postCreateAsset,history } = this.props;
        const { purchase_date } = values;

        if (purchase_date._isValid) values.purchase_date = moment(purchase_date._d).format('YYYY/MM/DD')

        Object.keys(values).map(key => values[key] = values[key].trim())

        this.setState({ loader: true })

        postCreateAsset(values, data => {
            const { code, message } = data.data;

            if (code === 'EMS_001') {
                this.setState({ loader: false })
                reset();
                this.notify(message, 'success')
                setTimeout(() => history.push('/asset_management/'), 3000);
            } else {
                this.setState({ loader: false })
                this.notify(message, 'error')
            }
        })
    }

    render() {
        const { assetTypes: { requesting, response },
            handleSubmit, reset, pristine, submitting, history, className } = this.props;
        const { required } = validator;
        const { loader, modal } = this.state;

        // if (requesting) return <Loader show={true} message={spinner} />
        // else {
        return (
            <Row className='p-2 pt-0'>
                <Loader show={loader} message={spinner} />
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                <Col md={12} sm={12} className="page-header">
                    <h2>Create Asset</h2>
                    <button onClick={() => history.push(`/asset_management/`)} className='btn float-right btn-ems-navigate btn-sm'> Back <i className="ml-1 fa fa-arrow-left" /></button>
                    <button className='btn float-right btn-ems-ternary btn-sm mr-1' onClick={this.toggle}>Bulk Upload <i className="ml-1 fa fa-upload" /></button>
                </Col>

                <Col md={12} sm={12} >
                    <form className="row">
                        <div className='col-md-6'>
                            <FormField
                                label='Asset Serial #'
                                name="asset_serial_no"
                                placeholder="Enter Asset Serial #"
                                fieldRequire={true}
                                validate={[required]}
                            />

                            <FormField
                                label='Model'
                                name="model"
                                placeholder="Eg : XYZ123"
                                fieldRequire={true}
                                validate={[required]}
                            />

                            <FormField
                                fieldRequire={true}
                                label='Purchased Date'
                                type='datePicker'
                                usage={false}
                                name="purchase_date"
                                placeholder="YYYY/MM/DD"
                                validate={[required]}
                            />

                            <FormField
                                fieldRequire={true}
                                label='Make'
                                name="make"
                                placeholder="Eg : Dell"
                                validate={[required]}
                            />

                            <FormField
                                fieldRequire={true}
                                label='Type'
                                type="dropDown" //api
                                id='type_id'
                                parse={this.parse}
                                displayName='type_name'
                                name="type_id"
                                list={response.data}
                                validate={[required]}
                            />

                        </div>
                        <div className='col-md-6'>

                            <FormField
                                fieldRequire={true}
                                validate={[required]}
                                label='Vendor Name'
                                name="vendor_name"
                                placeholder="Enter Vendor Name"
                            />

                            <FormField
                                fieldRequire={true}
                                validate={[required]}
                                label='Invoice #'
                                name="invoice_no"
                                placeholder='Enter Invoice #'
                            />
                            <FormField
                                fieldRequire={true}
                                validate={[required]}
                                label='Warranty Period (in Months)'
                                name="warranty_period"
                                placeholder="Eg : 2"
                            />
                            <FormField
                                fieldRequire={true}
                                validate={[required]}
                                label='Cost'
                                name="price"
                                placeholder="Eg: 150.50"
                            />
                            <FormField
                                name="notes"
                                type="textarea"
                                label="Notes"
                            />
                        </div>
                    </form >
                    <div className="text-center">
                        <button type='submit' onClick={handleSubmit(this.onSubmitAddasset)} className="btn-spacing btn btn-sm btn-ems-primary" disabled={pristine || submitting}>Add</button>
                        <button type='reset' onClick={reset} disabled={pristine || submitting} className="btn btn-sm btn-ems-clear">Clear</button>
                    </div >
                </Col>

                <Modal isOpen={modal} toggle={this.toggle} className={className}>
                    <ModalHeader toggle={this.toggle}>Asset Bulk Upload</ModalHeader>
                    <ModalBody className='mb-3'>
                        <AssetBulkupload />
                    </ModalBody>
                </Modal>
            </Row>
        )
    }
    // }
}

const mapStateToProps = ({ assetTypes }) => {
    return { assetTypes }
}

export default reduxForm({
    form: 'createAssetForm'
})(connect(mapStateToProps, { getAssetTypes, postCreateAsset })(AddAsset));
