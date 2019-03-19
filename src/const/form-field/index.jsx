import React, { Component } from "react";
import { Field } from "redux-form";
import {
    Input, Row, Col, Label
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from "moment";

import "./style.scss";

class FormField extends Component {

    generateComponent = field => {
        const { type, input, placeholder, keyword, list, label, option, disable, meta: { error, touched }, fieldRequire } = field;
        const childFormClassName = `form-control form-control-sm ${touched && error ? 'input-error' : ''}`;
        const labelText = fieldRequire === true ? <div><span className='text-danger'>*</span> {label ? label : placeholder}</div> : label ? label : placeholder
        const errorSection = error && touched ? <span className="text-danger"><i className='fa fa-info-circle' /> {error}</span> : ''

        if (type === 'select') {
            let optionList = _.map(list, (data, index) => <option value={data[keyword]} key={index}>{data[option]} </option>)
            return (
                <Row className='form-group'>
                    <Col md={5} >
                        <Label >{labelText}</Label>
                    </Col>

                    <Col md={7}>
                        <select className={childFormClassName} {...input}>
                            <option value="">Select</option>
                            {optionList}
                        </select>
                        {errorSection}
                    </Col>
                </Row>
            )
        } else if (type === 'date') {
            return (
                <Row className='form-group'>
                    <Col md={5} >
                        <Label >{labelText}</Label>
                    </Col>

                    <Col md={7}>
                        <DatePicker
                            className={childFormClassName} {...input}
                            dateFormat='YYYY/MM/DD'
                            placeholderText='YYYY/MM/DD'
                            withPortal
                            showMonthDropdown
                            showYearDropdown
                            tabIndex={1}
                            dropdownMode="select"
                            selected={input.value ? moment(input.value, 'YYYY/MM/DD') : null}
                            disabled={disable} />
                        {errorSection}
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row className={'form-group'}>
                    <Col md={5} >
                        <Label >{labelText}</Label>
                    </Col>

                    <Col md={7}>
                        <Input
                            type={type}
                            className={childFormClassName}
                            placeholder={placeholder}
                            disabled={disable}
                            {...input}
                        />
                        {errorSection}
                    </Col>
                </Row>
            );
        }
    }

    render = () => <Field {...this.props} component={this.generateComponent} />
}

export default FormField;