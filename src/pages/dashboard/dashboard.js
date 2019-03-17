import React, { Component } from 'react';
import { connect } from 'react-redux';
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
            pending_Leave_Application: 0
        }
    }

    componentDidMount() {
        const { getDashboardDetails, getMonthlyNotifications } = this.props;
        const { employee_id } = userInfo;

        getUserDetails();
        getDashboardDetails(employee_id);
        getMonthlyNotifications();
    }

    componentWillReceiveProps = ({ dashboardData, monthlyNotifications, userInformation }) => {

        this.setState({ userInformation: userInformation.data.data })

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

    renderBirthdayDate = (row, col) => {
        let date = moment(row).format('ddd MMM DD YYYY');
        let split = date.split('');

        let month = [];
        let deStructuredDate = [];
        split.map((date, index) => {
            if (index > 3 && index < 7) month.push(date);
            if (index > 7 && index < 10) deStructuredDate.push(date)
        });

        return (
            <div>
                <h2>{deStructuredDate.join('')}</h2>
                <h4>{month.join('')}</h4>
            </div>
        );
    }

    renderName = (row, col) => {
        const { first_name, last_name } = col;
        return (
            <div><h3 className='font-weight-normal'>{first_name} {last_name}</h3>
                <span> Anniversary </span>
            </div>
        )
    }

    renderMonthlyNotifications = () => {
        const { birthday, anniversary, userInformation: { role_id } } = this.state;

        if (role_id === 3) {
            return (
                <div className='mt-5 col-md-12'>
                    <div className="tile-header text-dark">Birthday & Anniversary events in {moment().format('MMMM')}</div>
                    <div className='mt-3'>
                        <BootstrapTable
                            data={anniversary}
                            maxHeight='500' version='4'
                            ignoreSinglePage pagination >
                            <TableHeaderColumn isKey={true} width='10%' dataField='date_of_joining' dataAlign="center" className='d-none ' columnClassName='dateSection' dataFormat={this.renderBirthdayDate}>Emp ID</TableHeaderColumn>
                            <TableHeaderColumn dataField='first_name' className='d-none' dataFormat={this.renderName} columnClassName='align-top'>Date Of birth</TableHeaderColumn>
                            <TableHeaderColumn dataField='anniversary' className='d-none'>Anniversary</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            );
        }
    }

    render() {
        const { available_CL_EL, pending_Leave_Application, userInformation } = this.state;

        if (userInformation) {
            const { first_name, designation, reportingto_name, last_name } = userInformation;

            return (
                <div>
                    <div className="text-center welcome-block">
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
        } else return <Loader show={true} message={spinner} />
    }
}

function mapStateToProps({ dashboardData, monthlyNotifications, userInformation }) {
    return { dashboardData, monthlyNotifications, userInformation }
}

export default connect(mapStateToProps, {
    getDashboardDetails, getMonthlyNotifications
})(Dashboard);