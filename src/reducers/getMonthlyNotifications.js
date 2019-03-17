export default function(state= {}, action){
    switch(action.type){
        case 'GET_MONTHLY_NOTIFICATIONS':
            state = action.payload.data.data;
            return state;
        default:
            return state;
    }
}