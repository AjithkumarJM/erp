export default function(state= {}, action){
    switch(action.type){
        case 'GET_EMPLOYEE_LEAVE_HISTORY_LIST':
            state = action.payload.data.data;
            return state;
        default:
            return state;
    }
}