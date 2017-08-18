import { SET_AUCTION_LIST } from '../actions/auctions'

const initialState = {
    data: [
        {
            ID: '',
            NAME: '',
            MINBID: '0.00',
            NUMBIDS: 0,
            HIGHBID: '0.00',
            ACTIVE: false,
            DESCRIPTION: ''
        }        
    ]
}

export default function auction_list(state = initialState, action) {
    switch (action.type) {
        case SET_AUCTION_LIST:
            return Object.assign({}, state, {
                data: action.payload
            })
        default:
            return state;
    }
}
