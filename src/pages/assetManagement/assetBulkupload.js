import React, { Component } from 'react';
import _ from 'lodash';
import { AssetbulkUpload } from './../../actions'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';

class AssetBulkupload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: <div className="lds-ripple"><div></div><div></div></div>,
            loader: {
                visible: false,
            },
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
        const parentClassName = `form-group row`
        const childClassName = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`

        delete field.input.value;
        return (
            < div className={parentClassName} >
                <label className="col-sm-3 col-form-label col-form-label-sm">{field.label}</label>
                <div className='col-sm-9'>
                    <input
                        {...field.input}
                        disabled={field.usage}
                        className={childClassName}
                        id='file-upload'
                        accept=".xlsx, .xlsm, .xltx, .xltm"
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.input.value}
                    />
                    <div className="text-help">
                        {touched && error ? <div className='text-danger'>{error} <span ><i className='fa fa-exclamation-circle' /></span></div> : ''}
                    </div>
                </div >
            </div>
        )
    }


    bulkUpload(values) {
        this.setState({ loader: { visible: true } })
        this.props.AssetbulkUpload(values, (data) => {
            if (data.data.code == 'EMS_306') {
                this.setState({ loader: { visible: false } })
                this.msg.show(data.data.message, {
                    position: 'bottom right',
                    type: 'success',
                    theme: 'dark',
                    time: 3000
                })
                $("#file-upload").val("")
                setTimeout(() => {
                    window.location.href = '/asset_management';
                    // <Link to='/asset_management'></Link>
                }, 3000);
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
        const { loader, spinner, alertOptions } = this.state;

        return (
            <div>
                <Loader show={loader.visible} message={spinner} />
                <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                <div>
                    <br></br>
                    <form className="row justify-content-md-center" onSubmit={handleSubmit(this.bulkUpload.bind(this))}>
                        <Field
                            label='File Upload'
                            required
                            placeholder="Select the file to upload"
                            name="file"
                            type="file"
                            component={this.generateInputField}
                        />
                        <div className='col-md-2'>
                            <button type='submit' className="btn btn-sm btn-ems-primary">Upload</button>
                        </div>
                    </form>
                </div>
                <br></br>
            </div >
        )
    }
}

function validate(values) {
    const errors = {};
    if (!values.file) {
        errors.file = "Select the file"
    }
    if (values.file) {
        if (values.file.length == 0) {
            errors.file = "Select the file"
        }
    }

    return errors;
}

export default reduxForm({
    validate,
    form: 'AssetBulkupload',
})(connect(null, {
    AssetbulkUpload
})(AssetBulkupload));

