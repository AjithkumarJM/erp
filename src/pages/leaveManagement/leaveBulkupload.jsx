import React, { Component } from 'react';
import _ from 'lodash';
import { LeaveBulkUpload, leaveBalance } from '../../actions';
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';

class Bulkupload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: cookie.load('session'),
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
        }
    }

    generateInputField(field) {
        const { meta: { touched, error } } = field;
        const childClassName = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`
        delete field.input.value;

        return (

            < div className='row' >
                <label className="col-sm-3 col-form-label col-form-label-sm ">{field.label}</label>
                <div className='col-sm-9'>
                    <input
                        disabled={field.usage}
                        className={childClassName}
                        id='file-upload'
                        accept=".xlsx, .xlsm, .xltx, .xltm"
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.input.value}
                        {...field.input} />
                    <div className="text-help">
                        {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                    </div>
                </div >
            </div>
        )
    }

    bulkUpload(values) {
        this.setState({ loader: { visible: true } })
        this.props.LeaveBulkUpload(values, (data) => {
            if (data.data.code == 'EMS_306') {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 5000
                })
                $("#file-upload").val("")
                this.props.leaveBalance(this.state.data.employee_id, (data) => {
                    this.setState({ leavebalance: data.data.data })
                })
            } else {
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'error',
                    theme: 'dark',
                    time: 5000
                })
                this.setState({ loader: { visible: false } })
            }
        })
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <div>
                <Loader show={this.state.loader.visible} message={this.state.spinner} />
                <AlertContainer ref={a => this.msg = a} {...this.state.alertOptions} />
                <div className="d-flex justify-content-center">
                    <form onSubmit={handleSubmit(this.bulkUpload.bind(this))} style={{ display: 'inline-flex' }}>
                        <Field
                            label='File Upload'
                            required
                            placeholder="Select the file to upload"
                            name="file"
                            type="file"
                            component={this.generateInputField}
                        />
                        <div>
                            <button type='submit' className="btn btn-sm btn-ems-primary" style={{ marginLeft: '10px', marginTop: '3px' }}>Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

function validate(values) {
    const errors = {};
    if (!values.file) { errors.file = "Select the file" }
    if (values.file) {
        if (values.file.length == 0) { errors.file = "Select the file" }
    }

    return errors;
}

export default reduxForm({
    validate,
    form: 'bulkuploadForm',
})(connect(null, {
    LeaveBulkUpload, leaveBalance
})(Bulkupload));
