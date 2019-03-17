export default function (state = {}, action) {
    switch (action.type) {
        case 'LOAD_PENDING_LEAVEHISTORY':
            state = action.payload.data.data;            
            return state;
        default:
            return state;
    }
}
