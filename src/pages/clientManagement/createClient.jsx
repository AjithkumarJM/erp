import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import AlertContainer from 'react-alert'
import Loader from 'react-loader-advanced';
import { Link } from 'react-router-dom';
import { Form, FormGroup } from "reactstrap";

import { postCreateClient, getClientTypeList } from '../../services/clientManagement'
import { spinner, alertOptions } from '../../const';
import FormField from '../../const/form-field';
import { validator } from '../../const/form-field/validator';

class CreateClient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false
        };
    }

    componentDidMount = () => {
        const { getClientTypeList } = this.props;

        getClientTypeList();
    }

    notify = (message, type) => this.msg.show(message, { type });

    submitForm = values => {

        const { postCreateClient, reset, history } = this.props;

        Object.keys(values).map(k => values[k] = values[k].toString().trim());

        this.setState({ loader: true })
        postCreateClient(values, data => {
            const { code, message } = data.data;
            if (code === 'EMS_001') {
                this.setState({ loader: false })
                reset();
                this.notify(message, 'success')
                setTimeout(() => history.push('/employee_tracker'), 3000);
            } else {
                this.setState({ loader: false })
                this.notify(message, 'error')
            }
        })
    }

    normalizePhone = value => {
        if (!value) return value;
        const onlyNums = value.replace(/[^\d]/g, '')
        if (onlyNums.length <= 3) return onlyNums
        if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`

        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`
    }

    render() {
        const {
            handleSubmit, reset, pristine, submitting, clientTypeList: { requesting, response },
        } = this.props;
        const { loader } = this.state;
        let { required } = validator;

        if (requesting === true) return <Loader show={true} message={spinner} />
        else if (response && response.data) {
            return (
                <div className='p-2'>
                    <Loader show={loader} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    <div className='row'>
                        <div className="col-12 page-header">
                            <h2>Create Client</h2>
                            <Link to='/client_management' className='btn btn-sm btn-ems-navigate float-right'><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
                        </div>
                    </div>
                    <div>
                        <Form className='row'>
                            <div className='offset-md-3 col-md-6'>
                                <FormGroup>
                                    <FormField
                                        label="Client Name"
                                        name="client_name"
                                        fieldRequire={true}
                                        type="text"
                                        placeholder="Enter the Client Name"
                                        validate={[required]}
                                    />

                                    <FormField
                                        label="Client List"
                                        name="type_id"
                                        fieldRequire={true}
                                        type="select"
                                        list={response.data}
                                        keyword="client_type_id"
                                        option="client_type_description"
                                        validate={[required]}
                                    />

                                    <FormField
                                        fieldRequire={true}
                                        type='textarea'
                                        name='client_description'                                        
                                        label='Description'
                                        validate={[required]}
                                    />

                                </FormGroup>
                            </div>
                        </Form >
                        <div className="row justify-content-md-center">
                            <button type='submit' onClick={handleSubmit(this.submitForm)} className="mr-1 btn btn-sm btn-ems-primary" disabled={pristine || submitting}>Add</button>
                            <button type='reset' onClick={reset} disabled={pristine || submitting} className="btn btn-sm btn-ems-clear">Clear</button>
                        </div >
                    </div >
                </div >
            );
        } else return <Loader show={true} message={spinner} />
    }
}

const mapTostateProps = ({ clientTypeList }) => {

    return { clientTypeList }
}

CreateClient = reduxForm({
    form: 'CreateClientForm',
    enableReinitialize: true
})(CreateClient)

export default connect(mapTostateProps, {
    postCreateClient, getClientTypeList,
})(CreateClient)