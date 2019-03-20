import React from 'react';
import { Row, Col } from 'reactstrap';
import CircularProgressbar from 'react-circular-progressbar';

import './style.scss';

const LeaveBalance = ({ leaveBalance }) => {
    let CL = 12;
    let EL = 20;
    let ML = 182;
    let percentage;

    let balance = _.map(leaveBalance, ({ no_of_days, type_name, leavetype_id }, index) => {
        if (type_name === 'CL') percentage = ((CL - no_of_days) / CL) * 100
        if (type_name === 'EL') percentage = ((EL - no_of_days) / EL) * 100
        if (type_name === 'ML') percentage = ((ML - no_of_days) / ML) * 100

        return (
            <Col>
                < div key={index}>
                    <CircularProgressbar
                        percentage={Math.round(percentage)}
                        text={`${no_of_days} ${type_name}`}
                        className='mt-2 leaveBalanceStyling'
                        styles={{
                            path: { stroke: `#549187` },
                            text: { color: '#549187', fontSize: '16px',fontWeight:'bold' },
                        }}
                    />
                </div >
            </Col>
        )
    })

    return (
        <div>
            <div className="h5"><span className='font-weight-normal secondary-text'>Leave Balance</span></div>
            <Row>{balance}</Row>
        </div>
    );
};

export default LeaveBalance;