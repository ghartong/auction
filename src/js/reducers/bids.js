import { SET_BIDS, SET_BID_ERROR, SET_WIN_MSG } from '../actions/bids'

const initialState = {
    data: {
        BID_ID: '',
        AUCTION_ID: '',        
        USER_ID: '',
        MIN_BID: '0',
        NUM_BIDS: 0,
        HIGH_BID: '0'
    },
    view: {
        errMsg: '',
        winMsg: '',
    }
}

export default function bids(state = initialState, action) {
    switch (action.type) {
        case SET_BIDS:
            return Object.assign({}, state, {
                data: action.payload
            })
        case SET_BID_ERROR:
            return Object.assign({}, state, {
                view: {errMsg: action.payload}
            })
        case SET_WIN_MSG:
            return Object.assign({}, state, {
                view: {winMsg: action.payload}
            })
        default:
            return state;
    }
}