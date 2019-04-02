const clientListType = {
    REQ: 'CLIENT_LIST_RES',
    RES: 'CLIENT_LIST_REQ',
    FAIL: 'CLIENT_LIST_FAIL'
}

const activeClientType = {
    REQ: 'ACTIVE_CLIENT_LIST_RES',
    RES: 'ACTIVE_CLIENT_LIST_REQ',
    FAIL: 'ACTIVE_CLIENT_LIST_FAIL'
}

const clientByIdType = {
    REQ: 'CLIENT_BY_ID_RES',
    RES: 'CLIENT_BY_ID_REQ',
    FAIL: 'CLIENT_BY_ID_FAIL'
}

const allClientType = {
    REQ: 'GET_ALL_CLIENTS_RES',
    RES: 'GET_ALL_CLIENTS_REQ',
    FAIL: 'GET_ALL_CLIENTS_FAIL'
}

export { clientListType, activeClientType, allClientType, clientByIdType }