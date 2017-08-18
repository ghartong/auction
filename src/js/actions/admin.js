import { pull as loPull, filter as loFilter } from "lodash"

//ACTION TYPES
export const DELETE_AUCTION = 'DELETE_AUCTION'
export const AUCTION_DELETE_FAILED = 'DELETE_AUCTION_DB_FAILED'
export const AUCTION_DELETE_SUCCESS = 'DELETE_AUCTION_DB_SUCCESS'

export function deleteAuction(auction_id) {
    return function(dispatch, getState) {
        const auctionUrl = '//wincfdev01.sterling.com/auction/api/index.cfm/auctions'

        let postData = {
            auction_id: auction_id,
        }

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        let fetchData = {
            method: 'DELETE',
            body: JSON.stringify(postData),
            headers: headers
        }

        // deleting auction from db removes its bids too
        return fetch(auctionUrl, fetchData)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            if (!response.ok) {
                dispatch({type: 'DELETE_AUCTION_DB_FAILED', payload: body})
            } else {
                dispatch({type: 'DELETE_AUCTION_DB_SUCCESS', payload: 'Auction deleted.'})
                // update state for auctions
                const auctions = getState().auctions.data
                const auction = loFilter(auctions, {'ID': parseInt(auction_id)})
                const newAuctions = loPull(auctions, auction[0])

                dispatch({
                    type: DELETE_AUCTION,
                    payload: newAuctions
                })
            }
        })
    }
}
