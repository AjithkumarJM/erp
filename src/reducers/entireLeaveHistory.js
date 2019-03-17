export default function(state= {}, action){
    switch(action.type){
        case 'ENTIRE_EMPLOYEE_LEAVEHISTORY':
            state = action.payload.data.data;
            return state;
        default:
            return state;
    }
}