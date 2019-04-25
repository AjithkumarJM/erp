import React from 'react';
import cookie from 'react-cookies';

const ROOT_URL = process.env.ROOT_URL;

// loader spinner
const spinner = <div className="lds-ripple"><div></div><div></div></div>

const userInfo = cookie.load('session');

const alertOptions = {
    offset: 14,
    position: 'bottom right',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
}

const genderList = [
    { name: 'Male', value: 'Male' }, { name: 'Female', value: 'Female' }
]

const activeInactiveType = [
    { name: 'Active', value: 1 }, { name: 'inActive', value: 0 }
]

const tableOptions = {
    sizePerPage: 10,
    sizePerPageList: [{
        text: '10', value: 10
    }, {
        text: '25', value: 25
    }, {
        text: '50', value: 50
    }, {
        text: '100', value: 100
    }],
    paginationSize: 3
};

const allLeaveType = {
    'CL': 'CL',
    'EL': 'EL',
    'ML': 'ML',
    'WFH': 'WFH',
    'LOP': 'LOP'
};

const leaveFormat = {
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Pending': 'Pending',
    'Cancelled': 'Cancelled'
};

const femaleLeaveType = {
    'CL': 'CL',
    'EL': 'EL',
    'ML': 'ML',
    'LOP': 'LOP',
    'WFH': 'WFH'
}
const maleLeaveType = {
    'CL': 'CL',
    'EL': 'EL',
    'LOP': 'LOP',
    'WFH': 'WFH'
}

export {
    ROOT_URL, spinner, userInfo, alertOptions, genderList,
    activeInactiveType, tableOptions, allLeaveType, leaveFormat, femaleLeaveType, maleLeaveType
}