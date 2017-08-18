//ACTION TYPES
export const REQUEST_AUCTIONS = 'REQUEST_AUCTIONS'
export const SET_AUCTION_LIST = 'SET_AUCTION_LIST'
export const SET_AUCTION = 'SET_AUCTION'
export const RESET_AUCTION = 'RESET_AUCTION'
export const UPDATE_ACTIVE = 'UPDATE_ACTIVE'
export const UPDATE_AUCTIONS = 'UPDATE_AUCTIONS'
export const UPDATE_AUCTION_START = 'UPDATE_AUCTION_START'
export const UPDATE_AUCTION_FAILED = 'UPDATE_AUCTION_FAILED'
export const UPDATE_AUCTION_SUCCESS = 'UPDATE_AUCTION_SUCCESS'
export const FETCH_AUCTIONS_START = 'FETCH_AUCTIONS_START'
export const FETCH_AUCTIONS_FAILED = 'FETCH_AUCTIONS_FAILED'
export const SET_AUCTIONS_ERROR = 'SET_AUCTIONS_ERROR'
export const FETCH_AUCTIONS_SUCCESS = 'FETCH_AUCTIONS_SUCCESS'

//ACTION CREATORS
export function endAuction() {
    //ACTION
    return (dispatch, getState) => {
        //change the active flag on this auction
        dispatch(updateActive())
        // get the current auctions
        let currentAuctions = getState().auctions.data
        // function to update aution to the current auctions
        const replace = predicate => replacement => element =>
            predicate(element) ? replacement : element
        // get newly updated auction
        const replacement = getState().auction.data[0]
        // find the auction in the auctions
        const predicate = element => parseInt(element.ID) === parseInt(replacement.ID)
        // run through auctions and run function creating new auctions
        const newAuctions = currentAuctions.map(replace (predicate) (replacement))
        // update auctions with new auctions
        dispatch(updateAuctions(newAuctions))
        dispatch(updateAuction(replacement))
    }
}

export function updateActive() {
    return {
        type: UPDATE_ACTIVE
    }
}

export function setAuction(auction) {
    return function(dispatch) {
        dispatch({type: 'SET_AUCTION', payload: auction})
    }
}

export function resetAuction() {
    return function(dispatch) {
        dispatch({type: 'RESET_AUCTION'})
    }
}

export function setAuctionList(list) {
    //ACTION
    return {
        type: SET_AUCTION_LIST,
        payload: list
    }
}

export function updateAuctions(newAuctions) {
    //ACTION
    return {
        type: UPDATE_AUCTIONS,
        payload: newAuctions
    }
}

export function updateAuction(auction) {
    return function(dispatch) {
        dispatch({type: 'UPDATE_AUCTION_START'})
        const url = '//wincfdev01/auction/api/index.cfm/auctions'

        let postData = {
            auction_id: auction.ID,
            auction_name: auction.NAME,
            is_active: auction.ACTIVE,
            end_dtm: auction.ENDDATE,
            auction_desc: auction.DESCRIPTION,
            high_bid: auction.HIGHBID,
            min_bid: auction.MINBID,
            winner: auction.WINNER
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
                dispatch({type: 'UPDATE_AUCTION_FAIL', body})
                dispatch({type: 'SET_AUCTIONS_ERROR', payload: 'Error updating auctions.'})
            } else {
                dispatch({type: 'UPDATE_AUCTION_SUCCESS', payload: 'Auction updated successfully.'})
                dispatch(requestAuctions())
            }
        })
    }
}


export function requestAuctions() {
  return function(dispatch) {
    dispatch({type: 'FETCH_AUCTIONS_START'});
    return fetch('//wincfdev01/auction/api/index.cfm/auctions')
      .then(response => response.json().then(body => ({ response, body })))
      .then(({ response, body }) => {
        if (!response.ok) {
            dispatch({type: 'FETCH_AUCTIONS_FAILED'});
            dispatch({type: 'SET_AUCTIONS_ERROR', payload: 'Error fetching auctions.'})
        } else {
            dispatch({type: 'FETCH_AUCTIONS_SUCCESS'});
            dispatch({
                type: REQUEST_AUCTIONS,
                payload: body
            })
        }
      })
  }
}
