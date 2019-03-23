import React, { Component } from "react";
import { Field } from "redux-form";
import {
    Input, Row, Col, Label
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from "moment";
import _ from 'lodash';

import "./style.scss";

class FormField extends Component {

    isWeekday = date => date.day() !== 0 && date.day() !== 6

    generateComponent = field => {
        const { type, input, placeholder, keyword, list, label, option, disable,
            meta: { error, touched }, inApplyLeave, fieldRequire, excludeDatesList, login
        } = field;

        const childFormClassName = `form-control form-control-sm ${touched && error ? 'is-invalid' : ''}`;
        const labelText = fieldRequire === true ? <div><span className='text-danger'>*</span> {label ? label : placeholder}</div> : label ? label : placeholder
        const errorSection = error && touched ? <span className="text-danger">{error} <i className='fa fa-info-circle' /> </span> : ''

        const excludeDates = _.map(excludeDatesList, ({ holiday_date }) => holiday_date);

        if (type === 'select') {
            let optionList = _.map(list, (data, index) => <option value={data[keyword]} key={index}>{data[option]} </option>)
            return (
                <Row className='form-group'>
                    {login !== true ?
                        <Col md={5} >
                            <Label >{labelText}</Label>
                        </Col> : null}

                    <Col md={login !== true ? 7 : 12}>
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
                            className={childFormClassName}
                            dateFormat='YYYY/MM/DD'
                            placeholderText='YYYY/MM/DD'
                            excludeDates={inApplyLeave === true ? excludeDates : null}
                            filterDate={inApplyLeave === true ? this.isWeekday : null}
                            minDate={inApplyLeave === true ? moment().subtract(30, "days") : null}
                            withPortal
                            showMonthDropdown
                            showYearDropdown
                            tabIndex={1}
                            dropdownMode="select"
                            selected={input.value ? moment(input.value, 'YYYY/MM/DD') : null}
                            disabled={disable}
                            {...field}
                        />
                        {errorSection}
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row className='form-group'>
                    {login !== true ?
                        <Col md={5} >
                            <Label >{labelText}</Label>
                        </Col> : null}

                    <Col md={login !== true ? 7 : 12}>
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