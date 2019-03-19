import React from 'react';
import cookie from 'react-cookies';

const ROOT_URL = "https://emsapi-dev.azurewebsites.net/api/v2/";

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

export { ROOT_URL, spinner, userInfo, alertOptions, genderList }