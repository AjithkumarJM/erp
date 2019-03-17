export default function(state= {}, action){
    switch(action.type){
        case 'ASSET_AVAILABLE_LIST':
            state = action.payload.data.data;
            return state;
        default:
            return state;
    }
}