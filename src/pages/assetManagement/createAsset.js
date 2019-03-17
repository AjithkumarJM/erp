import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatusList, getTypeList, createAsset } from './../../actions'
import AlertContainer from 'react-alert'
import { Field, reduxForm } from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader-advanced';

class CreateAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: {
                visible: false,
            },
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            alertOptions: {
                offset: 14,
                position: 'bottom right',
                theme: 'dark',
                time: 5000,
                transition: 'scale'
            }
        };

        this.dropDownApis()
    }

    dropDownApis() {
        this.props.getStatusList((data) => {
            this.setState({ assetStatus: data.data.data })
        })

        this.props.getTypeList((data) => {
            this.setState({ assetType: data.data.data })
        })
    }

    submit(values) {
        if (values.purchase_date._isValid) {
            values.purchase_date = moment(values.purchase_date._d).format('YYYY/MM/DD')
        }
        Object.keys(values).map(function (key, index) {
            values[key] = values[key].trim()
        });
        this.setState({ loader: { visible: true } })
        this.props.createAsset(values, (data) => {
            if (data.data.code == 'EMS_001') {
                this.setState({ loader: { visible: false } })
                this.props.reset();
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 3000
                })
                setTimeout(() => {
                    window.location.href = '/asset_management';
                }, 3000);
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

    renderField(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group row ${touched && error ? 'is-invalid' : ''}`

        if (field.type == 'dropDown') {
            let optionList = _.map(field.list, (data,index) => {
                return <option key={index} value={data[field.id]}>{data[field.displayName]}</option>;
            })
            return (
                <div className={className}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <select className="form-control form-control-sm" {...field.input}>
                            <option value="">Select</option>
                            {optionList}
                        </select>
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        } else if (field.type == 'datePicker') {
            return (
                <div className={className}>
                    <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                    <div className='col-sm-7'>
                        <DatePicker
                            className="form-control form-control-sm" {...field.input}
                            dateFormat='YYYY/MM/DD'
                            placeholderText='YYYY/MM/DD'
                            withPortal
                            showMonthDropdown
                            showYearDropdown
                            tabIndex={1}
                            dropdownMode="select"
                            selected={field.input.value ? moment(field.input.value, 'YYYY/MM/DD') : null}
                            disabled={field.usage} />
                        <div className="text-help">
                            {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                        </div>
                    </div>
                </div>
            )
        } return (
            < div className={className} >
                <label className="col-sm-5 col-form-label col-form-label-sm">{field.label}</label>
                <div className='col-sm-7'>
                    <input
                        disabled={field.usage}
                        className="form-control form-control-sm"
                        type="text"
                        placeholder={field.placeholder}
                        {...field.input} />
                    <div className="text-help">
                        {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                    </div>
                </div >
            </div>
        );
    }

    render() {
        const { handleSubmit, reset, pristine, submitting } = this.props;
        const { loader, alertOptions, spinner, assetType } = this.state;

        return (
            <div>
                <form className="row">
                    <Loader show={loader.visible} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <div className='col-md-6'>
                        <Field
                            label={<div><span className='text-danger'>*</span> Asset Serial #</div>}
                            name="asset_serial_no"
                            component={this.renderField}
                            placeholder="Enter Asset Serial #"
                        />

                        <Field
                            label={<div><span className='text-danger'>*</span> Model</div>}
                            name="model"
                            component={this.renderField}
                            placeholder="Eg : XYZ123"
                        />

                        <Field
                            label={<div><span className='text-danger'>*</span> Purchased Date</div>}
                            type='datePicker'
                            usage={false}
                            name="purchase_date"
                            component={this.renderField}
                            placeholder="YYYY/MM/DD"
                        />

                        <Field
                            label={<div><span className='text-danger'>*</span>  Make</div>}
                            name="make"
                            component={this.renderField}
                            placeholder="Eg : Dell"
                        />

                        <Field
                            label={<div><span className='text-danger'>*</span>  Type</div>}
                            type="dropDown" //api
                            id='type_id'
                            parse={this.parse}
                            displayName='type_name'
                            name="type_id"
                            list={assetType}
                            component={this.renderField}
                        />

                    </div>
                    <div className='col-md-6'>

                        <Field
                            label={<div><span className='text-danger'>*</span> Vendor Name</div>}
                            name="vendor_name"
                            component={this.renderField}
                            placeholder="Enter Vendor Name"
                        />

                        <Field
                            label={<div><span className='text-danger'>*</span> Invoice #</div>}
                            name="invoice_no"
                            component={this.renderField}
                            placeholder='Enter Invoice #'
                        />
                        <Field
                            label={<div><span className='text-danger'>*</span> Warranty Period (in Months)</div>}
                            name="warranty_period"
                            component={this.renderField}
                            placeholder="Eg : 2"
                        />
                        <Field
                            label={<div><span className='text-danger'>*</span>  Cost</div>}
                            name="price"
                            component={this.renderField}
                            placeholder="Eg: 150.50"
                            normalize={this.normalizePhone}
                        />
                        <div className='row'>
                            <label className='col-5'>Notes</label>
                            <div className='col-7'>
                                <Field className='col-12' name="notes" component="textarea" />
                            </div>
                        </div>
                    </div>
                </form >
                <div className="row justify-content-md-center bulkupload-wrap">
                    <div >
                        <button type='submit' onClick={handleSubmit(this.submit.bind(this))} className="btn-spacing btn btn-sm btn-ems-primary" disabled={pristine || submitting}>Add</button>
                    </div>
                    <div >
                        <button type='reset' onClick={reset} disabled={pristine || submitting} className="btn btn-sm btn-ems-clear">Clear</button>
                    </div>
                </div >
            </div>
        )
    }
}

function validate(values) {
    const errors = {};

    if (!values.asset_serial_no) {
        errors.asset_serial_no = "Enter Asset Serial #"
    }

    if (!values.model) {
        errors.model = "Enter Model"
    }

    if (!values.purchase_date) {
        errors.purchase_date = "Enter Purchase Date"
    }

    if (!values.make) {
        errors.make = "Enter Make"
    }

    if (!values.type_id) {
        errors.type_id = "Select Type"
    }

    if (!values.vendor_name) {
        errors.vendor_name = "Enter Vendor Name"
    }

    if (!values.invoice_no) {
        errors.invoice_no = "Enter Invoice #"
    }

    if (!values.id) {
        errors.id = "Enter Employee "
    }

    if (!values.warranty_period) {
        errors.warranty_period = "Enter Warranty Period"
    }

    if (!values.price) {
        errors.price = "Enter Cost"
    }

    if (values.price) {
        if (/^[0-9.]+$/.test(values.price)) {
        } else {
            errors.price = "Enter valid cost"
        }
    }

    return errors;
}
export default reduxForm({
    validate,
    form: 'createAssetForm',
})(connect(null, { getStatusList, getTypeList, createAsset })(CreateAsset));