import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'
import { Typeahead } from 'react-bootstrap-typeahead'

import { getStatusList, getTypeList, assetStatus, getAvailableAssets, getAllEmpList } from './../../actions'
import { spinner, alertOptions } from '../../const';
import { postAssetStatus, getAssets } from '../../services/assetManagement';
import { getEmployeesInfo } from '../../services/employeeTracker';
import { validator } from '../../const/form-field/validator';
import FormField from '../../const/form-field';

class AssignForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            enableErrorMessage: false
        };
    }

    componentDidMount() {
        const { getEmployeesInfo } = this.props;

        getEmployeesInfo();
    }

    notify = (message, type) => this.msg.show(message, { type })

    onSubmit = values => {
        const { selected } = this.state;
        const { reset, postAssetStatus, getAssets, assetIdList } = this.props;
        const { assigned_on } = values;

        if (assigned_on._isValid) values.assigned_on = moment(assigned_on._d).format('YYYY/MM/DD')

        let submitValues = {
            "asset_id_list": assetIdList,
            "status_name": "ASSIGNED",
            "employee_id": selected,
            "assigned_on": assigned_on
        }
        console.log(submitValues)
        this.setState({ loader: true })
        postAssetStatus(submitValues, data => {
            const { code, message } = data.data;
            if (code == 'EMS_001') {
                getAssets('AVAILABLE');
                reset();
                this._typeahead.getInstance().clear()
                this.setState({ loader: false, enableErrorMessage: true, errorMessage: message })
            } else this.setState({ loader: false, enableErrorMessage: true, errorMessage: message })
        })
    }

    renderErrorMessage = () => {
        const { errorMessage, enableErrorMessage } = this.state;

        if (enableErrorMessage === true) return <div className='alert alert-danger mt-3 ml-4 mr-4'>{errorMessage} <i className='float-right fa fa-times-circle m-1' onClick={() => this.setState({ enableErrorMessage: false })} /></div>
    }

    render() {
        const { handleSubmit, reset, allEmployeeInfo: { requesting, response } } = this.props;
        const { loader, selected } = this.state;
        const { required } = validator;

        if (requesting) return <Loader show={true} message={spinner} />
        else if (response.data) {
            return (
                <div>
                    <form >
                        <Loader show={loader} message={spinner} />
                        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                        <div>
                            <div className='row mb-2'>
                                <div className='col-md-5'>
                                    <div><span className='text-danger'>*</span>  Assign to Employee</div>
                                </div>
                                <div className='col-md-7'>
                                    <Typeahead
                                        bsSize='small'
                                        onChange={selected => this.setState({ selected: selected[0].id })}
                                        placeholder='Enter Employee'
                                        options={response.data}
                                        id='typeAhead'
                                        // selected={selected}
                                        labelKey={options => `${options.first_name} ${options.last_name} (${options.id})`}
                                        ref={(ref) => this._typeahead = ref}
                                    />
                                </div>
                            </div>


                            <div>
                                <FormField
                                    label='Assigned On'
                                    fieldRequire={true}
                                    type='date'
                                    disable={false}
                                    name="assigned_on"
                                    placeholder="YYYY/MM/DD"
                                    validate={[required]}
                                    withPortal={false}
                                />
                            </div>
                        </div>
                        {this.renderErrorMessage()}
                        <div className='text-right'>
                            <button type='submit' onClick={handleSubmit(this.onSubmit)} className="mr-2 btn btn-sm btn-ems-primary" >Assign</button>
                            <button type='reset' onClick={() => {
                                this._typeahead.getInstance().clear()
                                reset()
                            }
                            } className="btn btn-sm btn-ems-clear">Clear</button>
                        </div >
                    </form >
                </div >
            )
        } else return <Loader show={true} message={spinner} />
    }
}

const mapStateToProps = ({ allEmployeeInfo }) => {
    return { allEmployeeInfo }
}

export default reduxForm({
    enableReinitialize: true,
    form: 'assetStatusForm',
})(connect(mapStateToProps, {
    getEmployeesInfo,
    postAssetStatus, getAssets,

    getStatusList, getTypeList, assetStatus, getAvailableAssets, getAllEmpList
})(AssignForm));