import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { spinner } from '../../const';
import { postLeaveBulkUpload } from '../../services/leaveManagement';

class Bulkupload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false, enableErrorMessage: false
        }
    }

    onSubmitBulkUpload = values => {
        const { postLeaveBulkUpload } = this.props;

        this.setState({ loader: true })
        postLeaveBulkUpload(values, data => {
            const { code, message } = data.data;
            if (code === 'EMS_306') {
                this.setState({ loader: false })
                $("#file-upload").val("")
            } else this.setState({ loader: false, errorMessage: message, enableErrorMessage: true })
        })
    }

    renderField = field => {
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

    renderErrorMessage = () => {
        const { errorMessage, enableErrorMessage } = this.state;

        if (enableErrorMessage === true) return <div className='alert alert-danger mt-3 ml-4 mr-4'>{errorMessage} <i className='float-right fa fa-times-circle m-1' onClick={() => this.setState({ enableErrorMessage: false })} /></div>
    }

    render() {
        const { handleSubmit } = this.props;
        const { loader } = this.state;

        return (
            <div>
                <Loader show={loader} message={spinner} />
                <div className="d-flex justify-content-center">
                    <form onSubmit={handleSubmit(this.onSubmitBulkUpload)} style={{ display: 'inline-flex' }}>
                        <Field
                            label='File Upload'
                            required
                            placeholder="Select the file to upload"
                            name="file"
                            type="file"
                            component={this.renderField}
                        />
                        <div>
                            <button type='submit' className="btn btn-sm btn-ems-primary mt-1 ml-2">Upload</button>
                        </div>
                    </form>
                </div>
                {this.renderErrorMessage()}
            </div>
        )
    }
}

function validate(values) {
    const errors = {};
    if (!values.file) return errors.file = "Select the file"
    if (values.file) {
        if (values.file.length == 0) { errors.file = "Select the file" }
    }

    return errors;
}

export default reduxForm({
    validate,
    form: 'bulkuploadForm',
})(connect(null, { postLeaveBulkUpload })(Bulkupload));
