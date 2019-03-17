import React from 'react';
import cookie from 'react-cookies';

const ROOT_URL = "https://emsapi-dev.azurewebsites.net/api/v2/";

// loader spinner
const spinner = <div className="lds-ripple"><div></div><div></div></div>

const userInfo = cookie.load('session');

export { ROOT_URL, spinner, userInfo }