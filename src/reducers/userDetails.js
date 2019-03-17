export default function(state= {}, action){
    switch(action.type){
        case 'GET_ME':
            state = action.payload.data.data;
            return state;
        default:
            return state;
    }
}