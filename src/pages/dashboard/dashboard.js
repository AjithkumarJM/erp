import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { getDashboardDetails, getMonthlyNotifications } from '../../services/dashboard';
import { getUserDetails } from '../../services/userDetails';
import { spinner, userInfo } from '../../const/index';
import './style.scss';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            available_CL_EL: 0,
            reporties_Pending_Leave: 0,
            pending_Leave_Application: 0,
            userInformation: {}
        }
    }

    componentDidMount = () => {
        const { getDashboardDetails, getMonthlyNotifications } = this.props;
        const { employee_id } = userInfo;

        getUserDetails();
        getDashboardDetails(employee_id);
        getMonthlyNotifications();
    }

    componentWillReceiveProps = ({ dashboardData, monthlyNotifications, userInformation }) => {

        this.setState({ userInformation: userInformation.response.data })
        if (!_.isEmpty(dashboardData.response)) {

            const { reporties_Pending_Leave, available_CL_EL, pending_Leave_Application } = dashboardData.response.data;
            this.setState({ reporties_Pending_Leave, available_CL_EL, pending_Leave_Application })
        }

        if (!_.isEmpty(monthlyNotifications.response)) {
            const { birthday, anniversary } = monthlyNotifications.response.data;
            this.setState({ anniversary, birthday })
        }
    }

    renderReporteesLeave = () => {
        const { reporties_Pending_Leave, userInformation: { role_id } } = this.state;

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

    renderBirthdayDate = date => {
        ;
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

    renderEventList = events => {
        let list;

        if (events.length !== 0) {
            list = _.map(events, (event, index) => {
                const { date_of_joining, first_name, last_name } = event;
                return (
                    <ListGroupItem className='d-inline-block' key={index} style={{ borderLeft: '3px solid #2baffe' }}>
                        {this.renderBirthdayDate(moment(date_of_joining).format('ddd MMM DD YYYY'))} Work anniversary of <span className='font-weight-bold'>{first_name} {last_name}</span>
                    </ListGroupItem>
                )
            })
        } else return list = <ListGroupItem> No work anniversary events in this month</ListGroupItem >

        return <ListGroup>{list}</ListGroup>
    }

    renderMonthlyNotifications = () => {
        const { birthday, anniversary, userInformation: { role_id } } = this.state;

        if (role_id === 3) {
            return (
                <div className='mt-5 ml-2 eventSection'>
                    <div className="h5"><span className='font-weight-bold'>Events</span> <span className='text-muted h6'>In {moment().format('MMMM')}</span></div>
                    <div className='mt-2'>
                        <Row>
                            <Col md={6} sm={12}>
                                <div className="h6 font-weight-bold">Anniversary</div>
                                {this.renderEventList(anniversary)}
                            </Col>

                            <Col md={6} sm={12}>
                                <div className="h6 font-weight-bold">Birthday</div>
                                {this.renderEventList(birthday)}
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    }

    render() {
        const { available_CL_EL, pending_Leave_Application, userInformation } = this.state;
        const { dashboardData: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            const { first_name, designation, reportingto_name, last_name } = userInformation;

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
                            {this.renderReporteesLeave()}
                        </div>
                    </div>
                    {this.renderMonthlyNotifications()}
                </div>
            )
        }
    }
}

function mapStateToProps({ dashboardData, monthlyNotifications, userInformation }) {
    return { dashboardData, monthlyNotifications, userInformation }
}

export default connect(mapStateToProps, {
    getDashboardDetails, getMonthlyNotifications
})(Dashboard);