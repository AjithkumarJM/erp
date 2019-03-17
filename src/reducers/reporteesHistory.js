export default function(state= {}, action){
    switch(action.type){
        case 'GET_REPORTEES_HISTORY':
            state = action.payload.data.data;
            return state;
        default:
            return state;
    }
}

