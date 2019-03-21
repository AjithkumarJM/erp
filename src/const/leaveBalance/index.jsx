import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';

import './style.scss';

const LeaveBalance = ({ leaveBalance, color }) => {
    // leaves for an year
    let CL = 12;
    let EL = 20;
    let ML = 182;
    let percentage;
    let WFHValue;
    let LOPValue;

    let balance = _.map(leaveBalance, ({ no_of_days, type_name }, index) => {
        if (type_name === 'CL') percentage = ((CL - no_of_days) / CL) * 100
        if (type_name === 'EL') percentage = ((EL - no_of_days) / EL) * 100
        if (type_name === 'ML') percentage = ((ML - no_of_days) / ML) * 100
        if (type_name === 'WFH') WFHValue = no_of_days;
        if (type_name === 'LOP') LOPValue = no_of_days;

        if (type_name !== 'WFH' && type_name !== 'LOP') {
            return (
                < div key={index} className='d-inline mr-2'>
                    <CircularProgressbar
                        initialAnimation={true}
                        percentage={Math.round(percentage)}
                        text={`${no_of_days} ${type_name}`}
                        className='mt-2 leaveBalanceStyling'
                        styles={{
                            path: { stroke: color },
                            text: { fill: color, fontSize: '16px', fontWeight: 'bold' },
                        }}
                    />
                </div>
            )
        }
    })

    return (
        <div className='text-center'>
            <div className="h5">
                <span className='font-weight-normal secondary-text'>Leave Balance</span> | <span className=' p-2 mt-1 badge badge-secondary'>WFH Taken: {WFHValue}</span> | <span className=' p-2 mt-1 badge badge-secondary'>LOP: {LOPValue}</span>
            </div>
            {balance}
        </div>
    );
};

export default LeaveBalance;