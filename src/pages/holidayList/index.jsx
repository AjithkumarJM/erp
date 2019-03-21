import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import { Col, Row } from 'reactstrap';

import { getHolidayList } from '../../services/leaveManagement';
import { spinner } from '../../const';

class HolidayList extends Component {

    componentWillMount() {
        const { getHolidayList } = this.props;

        getHolidayList();
    }

    renderDates = date => `${moment(date).format('dddd')}, ${moment(date).format('ll')}`

    renderHolidayList = () => {
        const { data } = this.props.holidayList.response;

        const options = {
            sizePerPage: 10,  // which size per page you want to locate as default            
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }],
            paginationSize: 3,  // the pagination bar size  
        };

        return (
            <BootstrapTable data={data} version='4' options={options} ignoreSinglePage pagination>
                <TableHeaderColumn isKey dataField='holiday_name' dataAlign="center">Holiday Name</TableHeaderColumn>
                <TableHeaderColumn dataField='holiday_date' dataFormat={this.renderDates} dataAlign="center" dataSort>Date</TableHeaderColumn>
            </BootstrapTable>
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
                    <Col className='col-md-12 '>{this.renderHolidayList()}</Col>
                </Row>
            )
        }
    }
}

const mapStateToProps = ({ holidayList }) => {
    return { holidayList }
}

export default connect(mapStateToProps, { getHolidayList })(HolidayList);