import { 
    REQUEST_AUCTIONS, 
    UPDATE_AUCTIONS, 
    DELETE_AUCTION, 
    SET_AUCTIONS_ERROR 
} from '../actions/auctions'

const initialState = {
    data: [
        {
            ID: '',
            NAME: '',
            MINBID: '0.00',
            NUMBIDS: 0,
            HIGHBID: '0.00',
            ACTIVE: false,
            DESCRIPTION: '',
            WINNER: ''
        }        
    ],
    view: {
        errMsg: ''
    }
}

export default function auctions(state = initialState, action) {
    switch (action.type) {
        case REQUEST_AUCTIONS:
            return Object.assign({}, state, {
                data: action.payload
            })
        case UPDATE_AUCTIONS:
            return Object.assign({}, state, {
                data: action.payload
            })
        case DELETE_AUCTION:
            return Object.assign({}, state, {
                data: action.payload
            })
        case SET_AUCTIONS_ERROR:
            let newErrMsg = {...state.view, errMsg: action.payload}
            return {
                ...state, view : newErrMsg
            }
        default:
            return state;
    }
}
