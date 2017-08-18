import * as auctionActions  from './auctions'
import { filter as lofilter, orderBy as loSortBy, size as loSize } from "lodash"

//ACTION TYPES
export const UPDATE_BID = 'UPDATE_BID'
export const SET_BIDS = 'SET_BIDS'
export const SET_BID_ERROR = 'SET_BID_ERROR'
export const SET_WIN_MSG = 'SET_WIN_MSG'
export const BID_SAVE_SUCCESS = 'BID_SAVE_SUCCESS'
export const CHECK_HIGH_BID = 'CHECK_HIGH_BID'
export const INSERT_BID = 'INSERT_BID_START'
export const INSERT_BID_FAILED = 'INSERT_BID_FAILED'
export const INSERT_BID_SUCCESS = 'INSERT_BID_SUCCESS'
export const UPDATE_BID_STARTED = 'UPDATE_BID_STARTED'
export const UPDATE_BID_FAILED = 'UPDATE_BID_FAILED'
export const UPDATE_BID_SUCCESS = 'UPDATE_BID_SUCCESS'
export const FETCH_BIDS_START = 'FETCH_BIDS_START'
export const FETCH_BIDS_FAILED = 'FETCH_BIDS_FAILED'
export const FETCH_BIDS_SUCCESS = 'FETCH_BIDS_SUCCESS'
export const CALC_HIGH_BID_START = 'CALC_HIGH_BID_START'
export const CALC_HIGH_BID_END = 'CALC_HIGH_BID_END'
export const NOTIFY_BIDDER = 'NOTIFY_BIDDER'

export function checkWinner() {
    return function(dispatch, getState) {
        if (getState().auth.auth && getState().auth.auth[0].EMPNUM === getState().auction.data[0].WINNER) {
            dispatch(setWinMsg('You are the current high bidder.'))
        }
    }
}

export function setBidError(msg) {
    return {
        type: SET_BID_ERROR,
        payload: msg
    }    
}

export function setWinMsg(msg) {
    return {
        type: SET_WIN_MSG,
        payload: msg
    }    
}

export function submitBid(auction, bid, userId) {
    return (dispatch, getState) => {
        let errMsg = ''
        if (bid <= auction.MINBID) {
            errMsg = 'Bid is not higher than minimum bid'
            dispatch(setBidError(errMsg))
            return Promise.reject(errMsg)
        } else if (bid <= auction.HIGHBID) {
            errMsg = 'Bid is not higher than current highest bid'
            dispatch(setBidError(errMsg))
            return Promise.reject(errMsg)
        } else {
            dispatch(setBidError(''))
            dispatch(insertBid(bid, bid, auction.ID, userId))
                .then(() => {
                    dispatch({type: BID_SAVE_SUCCESS})
                })
            return Promise.resolve('SUCCESS')
        }
    }
}

export function insertBid(current_bid, max_bid, auction_id, user_id) {
    return function(dispatch) {
        dispatch({type: 'INSERT_BID_START'})
        const url = '//wincfdev01/auction/api/index.cfm/bids'

        let postData = {
            user_id: user_id,
            auction_id: auction_id,
            max_bid: max_bid,
            current_bid: current_bid
        }

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(postData),
            headers: headers
        }
        return fetch(url, fetchData)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            if (!response.ok) {
                dispatch({type: 'INSERT_BID_FAILED'})
                dispatch(setBidError('Error inserting bid.'))
            } else {
                dispatch({type: 'INSERT_BID_SUCCESS'})
                dispatch(requestBids(auction_id))
                .then(() => {
                    dispatch(checkHighBid(body))
                })
        }
        })
    }
}

export function updateBid(bid) {
    return function(dispatch) {
        dispatch({type: 'UPDATE_BID_STARTED'})
        const url = '//wincfdev01/auction/api/index.cfm/bids'
        let postData = {
            bid_id: bid.bid_id,
            user_id: bid.user_id,
            auction_id: bid.auction_id,
            max_bid: bid.max_bid,
            current_bid: bid.current_bid
        }

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(postData),
            headers: headers
        }
        return fetch(url, fetchData)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            if (!response.ok) {
                dispatch({type: 'UPDATE_BID_FAILED'})
                dispatch(setBidError('Error updating bid.'))
            } else {
                dispatch({type: 'UPDATE_BID_SUCCESS'})
                dispatch(requestBids(bid.auction_id))
                    .then(() => {
                        dispatch(auctionActions.requestAuctions())
                    })
            }
        })
    }
}

export function checkHighBid(this_bid) {
    return (dispatch, getState) => {
        dispatch({type: 'CHECK_HIGH_BID'})
        // get current winner and high bid for this auction from auction
        const auction = getState().auction.data[0]

        // get all bids for this auction
        const allBids = getState().bids.data

        // filter bids by max bid that's higher than highest current bid
        const inPlayBids = lofilter(allBids, function(o) {
            return o.MAX_BID > auction.HIGHBID
        })

        if (loSize(inPlayBids) > 0){
            dispatch({type:'CALC_HIGH_BID_START'})

            let nextCurrentBid = 0
            let newWinner = {}
            if (loSize(inPlayBids) > 1){
                // order by max bid value of inPlayBids and created date (based on ID)
                const sortedBids = loSortBy(inPlayBids, ['MAX_BID', 'ID'], ['desc', 'asc'])

                // top bid wins
                newWinner = sortedBids[0]
                let secondPlaceBid = 0
                if (sortedBids.length > 1) {
                    secondPlaceBid = sortedBids[1].MAX_BID
                }

                // get the higher of second place bid and the auction current high bid. add one.
                // this removes checking over and over for the next winner. if its second place, there's
                // one higher that will eventually win. so just bounce to +1 than second place max. if
                // for some reason (like no second place) the current auction high bid is higher, use
                // that and +1 so our new winner's bid is higher.
                const currentPlusOne = Math.max(secondPlaceBid, auction.HIGHBID) + 1

                // set next current bid for auction. we want to go higher than current auction high bid +1,
                // but don't want to use winner's MAX bid unless needed. there's a chance current plus one will
                // be higher than max bid (if winners max bid was same as second place max bid, but winner's bid
                // was first) then we don't want to go over the MAX bid so we use min() of the two.
                nextCurrentBid = Math.min(currentPlusOne, newWinner.MAX_BID)

            } else if ( loSize(inPlayBids) === 1 ) { // this will happen on auction's very first bid.
                nextCurrentBid = auction.MINBID > 0 ? auction.MINBID : 1
                newWinner = inPlayBids
            }

            // update auction high bid, winner and number of bids
            const newAuction = Object.assign( auction, {
                HIGHBID: nextCurrentBid,
                WINNER: newWinner.USER_ID,
                NUMBIDS: loSize(allBids)
            })
            dispatch(auctionActions.updateAuction(newAuction))

            // update winning bid. set bid.current bid to nextCurrentBid
            const newBid = Object.assign( newWinner, {
                CURRENT_BID: nextCurrentBid
            })
            dispatch(updateBid(newBid))
                .then(() => {
                    // notify 
                    const your_bid = lofilter( allBids, {'BID_ID': parseInt(this_bid)} )
                    dispatch( notifyBidder( your_bid[0], newBid) )
                })

            dispatch({type:'CALC_HIGH_BID_END'})
        } else {
            // Do we ever get here?
            console.log('No new high bid')
        }
    }
}

export function notifyBidder(your_bid, winning_bid) {
    return (dispatch, getState) => {
        dispatch({type:'NOTIFY_BIDDER'})
        if (your_bid.BID_ID === winning_bid.BID_ID) {
            // you won
            dispatch(setWinMsg('You are the current high bidder.'))
        } else {
            // you didn't win
            dispatch(setBidError('Sorry, you have been out-bid.'))
        }
    }    
}

export function requestBids(auction_id) {
  return function(dispatch) {
    dispatch({type: 'FETCH_BIDS_START'});
    return fetch('//wincfdev01/auction/api/index.cfm/bids?auction_id=' + auction_id)
      .then(response => response.json().then(body => ({ response, body })))
      .then(({ response, body }) => {
        if (!response.ok) {
            dispatch({type: 'FETCH_BIDS_FAILED'});
            dispatch(setBidError('Error fetching bids'))
        } else {
            dispatch({type: 'FETCH_BIDS_SUCCESS'});
            dispatch({
                type: SET_BIDS,
                payload: body
            })
        }
      })
  }
}
