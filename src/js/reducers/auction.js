import { 
    SET_AUCTION,
    RESET_AUCTION,
    UPDATE_ACTIVE,
    AUCTION_DELETE_FAILED, 
    AUCTION_DELETE_SUCCESS,
    UPDATE_AUCTION_SUCCESS,
    UPDATE_AUCTION_FAIL
} from '../actions/auctions'

const initialState = {
    data: {
        ID: '0',
        NAME: '',
        MINBID: '0.00',
        NUMBIDS: 0,
        HIGHBID: '0.00',
        ACTIVE: false,
        DESCRIPTION: '',
        ENDDATE: new Date()
    },
    view: {
        errMsg: '',
        msg: ''
    }
}

export default function auction(state = initialState, action) {
    switch (action.type) {
        case SET_AUCTION:
            return Object.assign({}, state, {
                data: action.payload
            })
        case RESET_AUCTION:
            return Object.assign({}, state, {
                ...initialState
            })
        case UPDATE_ACTIVE:
            let endingAuction = state.data[0]
            return Object.assign({}, state, {
                data: [{
                    ...endingAuction,
                    ACTIVE: false
                }]
            })
        case AUCTION_DELETE_FAILED:
            return {
                ...state, view: {errMsg: action.payload}
            }
        case UPDATE_AUCTION_FAIL:
            return {
                ...state, view: {errMsg: action.payload}
            }
        case AUCTION_DELETE_SUCCESS:
            return {
                ...state, view: {msg: action.payload}
            }
        case UPDATE_AUCTION_SUCCESS:
            return {
                ...state, view: {msg: action.payload}
            }
        default:
            return state;
    }
}
