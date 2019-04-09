import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import { Col, Row } from 'reactstrap';

import { getHolidayList } from '../../services/leaveManagement';
import { spinner, tableOptions } from '../../const';

class HolidayList extends Component {

    componentWillMount = () => this.props.getHolidayList();

    renderDates = date => `${moment(date).format('MMM Do')}`

    renderHolidayList = () => {
        const { data } = this.props.holidayList.response;

        let list = _.map(data, ({ holiday_date, holiday_name }, index) => {
            return (
                <article className="timeline-entry mt-3" key={index}>
                    <div className="timeline-entry-inner">
                        <time className="timeline-time" dateTime="2014-01-10T03:45"><span>{this.renderDates(holiday_date)}</span> <span>{moment(data.released_on).format('dddd')}</span></time>
                        <div className="timeline-icon">
                            <i className="fa fa-calendar"></i>
                        </div>
                        <div className="timeline-label">
                            <h2>{holiday_name}</h2>
                        </div>
                    </div>
                </article>
            )
        });
        return (
            // <BootstrapTable data={data} version='4' options={tableOptions} ignoreSinglePage pagination>
            //     <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">HOLIDAY NAME</TableHeaderColumn>
            //     <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDates} dataAlign="center" dataSort>DATE</TableHeaderColumn>
            // </BootstrapTable>
            <div className='row justify-content-md-center parent-wrap'>
                <div className="timeline-centered">{list}</div>
            </div>
        )
    }
    render() {
        const { holidayList: { requesting } } = this.props;
        let year = new Date().getFullYear();

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <Row>
                    <Col md={12} className="page-header"> <h2>Holiday List ({year})</h2></Col>
                    <Col md={12}>{this.renderHolidayList()}</Col>
                </Row>
            )
        }
    }
}

const mapStateToProps = ({ holidayList }) => {
    return { holidayList }
}

export default connect(mapStateToProps, { getHolidayList })(HolidayList);