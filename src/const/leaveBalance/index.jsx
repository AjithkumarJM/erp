import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';

import './style.scss';

const LeaveBalance = ({ leaveBalance }) => {
    let CL = 12;
    let EL = 20;
    let ML = 182;
    let percentage;
    let WFHValue;

    let balance = _.map(leaveBalance, ({ no_of_days, type_name }, index) => {
        if (type_name === 'CL') percentage = ((CL - no_of_days) / CL) * 100
        if (type_name === 'EL') percentage = ((EL - no_of_days) / EL) * 100
        if (type_name === 'ML') percentage = ((ML - no_of_days) / ML) * 100
        if (type_name === 'WFH') WFHValue = no_of_days;

        if (type_name !== 'WFH') {
            return (
                < div key={index} className='d-inline mr-2'>
                    <CircularProgressbar
                        percentage={Math.round(percentage)}
                        text={`${no_of_days} | ${type_name}`}
                        className='mt-2 leaveBalanceStyling'
                        styles={{
                            path: { stroke: `#549187` },
                            text: { color: '#549187', fontSize: '16px', fontWeight: 'bold' },
                        }}
                    />
                </div>
            )
        }
    })

    return (
        <div className='text-center'>
            <div className="h5">
                <span className='font-weight-normal secondary-text'>Leave Balance</span> | <span className=' p-2 mt-1 badge badge-secondary'>WFH Taken: {WFHValue}</span>
            </div>
            {balance}
        </div>
    );
};

export default LeaveBalance;