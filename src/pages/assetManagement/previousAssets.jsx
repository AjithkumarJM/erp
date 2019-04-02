import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import moment from 'moment';
import Loader from 'react-loader-advanced';

import { spinner, alertOptions, userInfo, tableOptions } from '../../const';
import { getAssetById } from '../../services/assetManagement';

class CurrentAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputValues: [],
            toggleButton: false,
            loader: false
        }
    }

    componentWillMount() {
        const { getAssetById } = this.props;
        const { employeeId } = this.props.match.params;

        getAssetById(employeeId);
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date
    
    renderTimeline = () => {
        const { previousAssignedAsset } = this.props.assetById.response.data;

        let timeline = previousAssignedAsset.map((data, index) => {
            return (
                <article className="timeline-entry mt-3">
                    <div className="timeline-entry-inner">
                        <time className="timeline-time" datetime="2014-01-10T03:45">Released On<span>{this.formatDate(data.released_on)}</span> <span>{moment(data.released_on).format('dddd')}</span></time>
                        <div className="timeline-icon">
                            <i className="fa fa-calendar"></i>
                        </div>
                        <div className="timeline-label">
                            <h2><a href="#">{data.type_name} | {data.asset_serial_no}</a> <p>{data.make}  (Model: {data.model})</p></h2>
                            <p>Assigned on {<strong className='h6'>{moment(data.assigned_on).format('LL')}</strong>}</p>
                        </div>
                    </div>
                </article>
            )
        })
        return (
            <div className='row justify-content-md-center'>
                <div className="timeline-centered">{timeline}</div>
            </div>
        )
    }

    render() {
        const { assetById: { requesting, response } } = this.props;
        const { loader } = this.state;

        if (requesting) return <Loader show={true} message={spinner} />
        else if (response.data) {
            return (
                <div className='p-2 pt-3'>
                    <Loader show={loader} message={spinner} />
                    {this.renderTimeline()}
                </div>
            );
        } else return <Loader show={true} message={spinner} />
    }
}

const mapStateToProps = ({ assetById }) => {
    return { assetById }
}

export default connect(
    mapStateToProps, { getAssetById }
)(CurrentAssets);