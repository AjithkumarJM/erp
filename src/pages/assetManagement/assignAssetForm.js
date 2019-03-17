import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatusList, getTypeList, assetStatus, getAvailableAssets, getAllEmpList } from './../../actions'
import { Field, reduxForm } from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import { Typeahead } from 'react-bootstrap-typeahead'
import AlertContainer from 'react-alert'

class AssignForm extends Component {
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
            },
            empId: []
        };
    }

    componentDidMount() {
        const { getStatusList, getTypeList, getAllEmpList } = this.props;

        getStatusList(data => this.setState({ assetStatus: data.data.data }))
        getTypeList(data => this.setState({ assetType: data.data.data }))
        getAllEmpList(data => this.setState({ empId: data.data.data }))
    }

    submit(values) {
        const { selected } = this.state;

        if (values.assigned_on._isValid) {
            values.assigned_on = moment(values.assigned_on._d).format('YYYY/MM/DD')
        }

        let typeAheadId;
        const instance = this._typeahead.getInstance();
        values.status_name = 'ASSIGNED',
            values.asset_id_list = this.props.assetId,
            selected ? selected.map((data, index) => { return typeAheadId = data.id }) : null
        values.employee_id = typeAheadId
        values.employee_id == null || values.employee_id.length == 0 ? instance.focus() : null

        if (values.employee_id != null) {
            this.setState({ loader: { visible: true } })
            this.props.assetStatus(values, (data) => {
                this.props.getAvailableAssets('AVAILABLE')
                if (data.data.code == 'EMS_001') {
                    this.setState({ loader: { visible: false } })
                    this._typeahead.getInstance().clear()
                    this.props.reset();
                    this.msg.show(data.data.message, {
                        position: 'bottom right',
                        type: 'success',
                        theme: 'dark',
                        time: 5000
                    })
                    setTimeout(() => {
                        this.props.callback();
                        // window.location.href = '/asset_management';
                    }, 2000);
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
    }

    goback = () => {
        const { reset, callback } = this.props;

        reset();
        callback();
    }

    renderField(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group row ${touched && error ? 'is-invalid' : ''}`

        if (field.type == 'dropDown') {
            let optionList = _.map(field.list, data => {
                return <option value={data[field.id]}>{data[field.displayName]}</option>;
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
        const { handleSubmit, reset } = this.props;
        const { loader, empId, spinner, selected, alertOptions } = this.state;

        return (
            <div>
                <form>
                    <Loader show={loader.visible} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <div className='TypeaheadWrap'>
                        <div className='offset-md-2 col-md-8 offset-md-2'>
                            <div className='row'>
                                <div className='col-md-5'>
                                    <div><span className='text-danger'>*</span>  Assign to Employee</div>
                                </div>
                                <div className='col-md-7'>
                                    <Typeahead
                                        bsSize='small'
                                        onChange={(selected) => {
                                            this.setState({ selected });
                                        }}
                                        placeholder='Enter Employee'
                                        options={empId}
                                        selected={selected}
                                        labelKey={options => `${options.first_name} ${options.last_name} (${options.id})`}
                                        ref={(ref) => this._typeahead = ref}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='offset-md-2 col-md-8 offset-md-2'>
                            <Field
                                label={<div><span className='text-danger'>*</span>  Assigned On</div>}
                                type='datePicker'
                                usage={false}
                                name="assigned_on"
                                component={this.renderField}
                                placeholder="YYYY/MM/DD"
                            />
                        </div>
                    </div>
                </form >
                <div className="row justify-content-md-center bulkupload-wrap">
                    <div >
                        <button type='submit' onClick={handleSubmit(this.submit.bind(this))} className="btn-spacing btn btn-sm btn-ems-primary" >Assign</button>
                    </div>
                    <div >
                        <button type='reset' onClick={() => {
                            reset()
                            this._typeahead.getInstance().clear()
                        }} className="btn btn-sm btn-ems-clear">Clear</button>
                    </div>
                </div >
            </div >
        )
    }
}

function validate(values) {
    const errors = {};

    if (!values.employee_id) {
        errors.employee_id = "Enter Employee Id"
    }

    if (!values.assigned_on) {
        errors.assigned_on = "Enter Assigned On"
    }

    return errors;
}

export default reduxForm({
    validate,
    enableReinitialize: true,
    form: 'assetStatusForm',
})(connect(null, { getStatusList, getTypeList, assetStatus, getAvailableAssets, getAllEmpList })(AssignForm));