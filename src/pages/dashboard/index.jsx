import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { getDashboardDetails, getMonthlyNotifications } from '../../services/dashboard';
import { spinner, userInfo } from '../../const/index';
import './style.scss';

class Dashboard extends Component {

    componentWillMount = () => {
        const { getDashboardDetails, getMonthlyNotifications } = this.props;
        const { employee_id } = userInfo;

        getDashboardDetails(employee_id);
        getMonthlyNotifications();
    }

    renderBirthdayDate = date => {
        let split = date.split('');

        let month = [];
        let deStructuredDate = [];
        split.map((date, index) => {
            if (index > 3 && index < 7) month.push(date);
            if (index > 7 && index < 10) deStructuredDate.push(date)
        });

        return <span className='font-weight-bold' style={{ color: '#2baffe' }}>{deStructuredDate.join('')}  {month.join('')}</span>
    }

    renderName = (row, col) => {
        const { first_name, last_name } = col;

        return (
            <div className='text-muted'><h5 className='font-weight-normal'>{first_name} {last_name}</h5>
                <span> Anniversary </span>
            </div>
        )
    }

    generateSuffix = suffix => {
        var j = suffix % 10,
            k = suffix % 100;
        if (j == 1 && k != 11) {
            return suffix + "st";
        }
        if (j == 2 && k != 12) {
            return suffix + "nd";
        }
        if (j == 3 && k != 13) {
            return suffix + "rd";
        }
        return suffix + "th";
    }

    renderReporteesLeave = reporties_Pending_Leave => {
        const { role_id } = userInfo;

        // 3 HR
        // 9 and 8 TL & Manager
        if (role_id === 3 || role_id === 9 || role_id === 8) {
            return (
                <div className='col-sm-4 col-xs-12 col-md-4 text-center'>
                    <div className="tile-header"><i className="fa fa-users" aria-hidden="true"></i> Reportees Leave Request</div>
                    <div className="tile-css text-warning">
                        <div>{reporties_Pending_Leave === null ? "0" : reporties_Pending_Leave}<span className='leave-analytics'><small> leave(s)</small></span></div>
                    </div>
                </div>
            )
        }
    }

    renderEventList = (events, type) => {
        let list;

        if (events && events.length !== 0) {
            list = _.map(events, (event, index) => {
                const { date_of_joining, first_name, last_name, date_of_birth } = event;
                let date = type === 'birthday' ? date_of_birth : date_of_joining
                let anniversary = moment().diff('10/03/2018', 'years');
                let suffixAppendDate = this.generateSuffix(anniversary);
                
                return (
                    <ListGroupItem className='d-inline-block' key={index} style={{ borderLeft: '3px solid #2baffe' }}>
                        {this.renderBirthdayDate(moment(date).format('ddd MMM DD YYYY'))} - <span className='font-weight-bold'>{first_name} {last_name}</span>'s {type === 'anniversary' ?
                            `${suffixAppendDate} year work anniversary` : 'birthday'}
                    </ListGroupItem>
                )
            })
        } else return list = <ListGroupItem> No {type === 'anniversary' ? 'Work anniversary' : 'birthday'} events in this month</ListGroupItem >

        return <ListGroup>{list}</ListGroup>
    }

    renderMonthlyNotifications = () => {
        const { data } = this.props.monthlyNotifications.response;
        const { role_id } = userInfo;

        if (role_id === 3 && data) {
            const { birthday, anniversary } = data;
            return (
                <div className='mt-5 ml-2 eventSection'>
                    <div className="h5"><span className='font-weight-bold'>Events</span> <span className='text-muted h6'>In {moment().format('MMMM')}</span></div>
                    <div className='mt-2'>
                        <Row>
                            <Col md={6} sm={12}>
                                <div className="h6 font-weight-bold">Anniversary</div>
                                {this.renderEventList(anniversary, 'anniversary')}
                            </Col>

                            <Col md={6} sm={12}>
                                <div className="h6 font-weight-bold">Birthday</div>
                                {this.renderEventList(birthday, 'birthday')}
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    }

    render() {
        const { dashboardData: { requesting, response }, userInformation } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else if (response && response.data) {
            const { available_CL_EL, pending_Leave_Application, reporties_Pending_Leave } = response.data;
            const { first_name, designation, reportingto_name, last_name } = userInformation.response.data;

            return (
                <div>
                    <div className="text-center mt-4 mb-4 secondary-text">
                        <h1>Hi, {first_name + ' ' + last_name}</h1>
                        <div className="description">
                            Your designation is <strong>{designation}</strong> & reporting to <strong>{reportingto_name}</strong>
                        </div>
                    </div>
                    <div>
                        <div className='row tiles'>
                            <div className='col-sm-4 col-xs-12 col-md-4 text-center'>
                                <div className="tile-header"><i className="fa fa-columns" aria-hidden="true"></i> Available Leave</div>
                                <div className="tile-css">
                                    <div>{available_CL_EL === null ? "0" : available_CL_EL}<span className='leave-analytics'><small> day(s)</small></span></div>
                                </div>
                            </div>
                            <div className='col-sm-4 col-xs-12 col-md-4 text-center'>
                                <div className="tile-header"><i className="fa fa-clock-o" aria-hidden="true"></i> Awaiting for Approval</div>
                                <div className="tile-css text-danger">
                                    <div>{pending_Leave_Application === null ? "0" : pending_Leave_Application}<span className='leave-analytics'><small> leave(s)</small></span></div>
                                </div>
                            </div>
                            {this.renderReporteesLeave(reporties_Pending_Leave)}
                        </div>
                    </div>
                    {this.renderMonthlyNotifications()}
                </div>
            )
        } else return <Loader show={true} message={spinner} />
    }
}

function mapStateToProps({ dashboardData, monthlyNotifications, userInformation }) {
    return { dashboardData, monthlyNotifications, userInformation }
}

export default connect(mapStateToProps, {
    getDashboardDetails, getMonthlyNotifications
})(Dashboard);