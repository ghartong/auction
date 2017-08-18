import { combineReducers } from 'redux'
import AuthReducer from './auth'
import AuctionsReducer from './auctions'
import AuctionReducer from './auction'
import AuctionListReducer from './auction_list'
import BidReducer from './bids'
import { BID_SAVE_SUCCESS } from '../actions/bids'
import { reducer as FormReducer } from 'redux-form'

const rootReducer = combineReducers({
    auth: AuthReducer,
    auction: AuctionReducer,
    auctions: AuctionsReducer,
    auction_list: AuctionListReducer,
    bids: BidReducer,
    form: FormReducer.plugin({
        bid: (state, action) => {
            switch(action.type) {
                case BID_SAVE_SUCCESS:
                    return undefined
                default:
                    return state
            }
        }
    })
})

export default rootReducer
