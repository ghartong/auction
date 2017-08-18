import React from "react"
import { filter as lofilter, size as loSize } from "lodash"
import { hashHistory } from "react-router"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as actions from '../../actions/auctions'
import * as bidActions from '../../actions/bids'
import Bid_form from '../Bids/Bid_form'
import CountdownTimer from '../Timer/Timer'

class Auction extends React.Component{
    componentWillMount() {
        // if the browser is refreshed, state.auctions isn't populated before this page tries to load. Solve with this...
        if (loSize(this.props.auctions.data) === 1 && this.props.auctions.data[0].ID.length === 0) {
            this.props.actions.requestAuctions()
                .then(() => {
                    this.getAuction(this.props.auctions.data, this.props.params.auction_id)
                })
        } else {
            this.getAuction(this.props.auctions.data, this.props.params.auction_id)
        }
    }

    componentWillReceiveProps(nextProps) {
        //if auctions or auction id changed, reload the list
        if ( (nextProps.auctions.data !== this.props.auctions.data) || (nextProps.auction_id !== this.props.auction_id) ) {
            this.getAuction(nextProps.auctions.data, nextProps.params.auction_id)
        } 
    }

    getAuction(auctions, passedID = 0) {
        const auction = lofilter(auctions, {'ID' : parseInt(passedID)} )
        if ( !auction.length ){
            hashHistory.push('fourohfour')
        } else {
            this.props.bidActions.requestBids(passedID)
            this.props.actions.setAuction(auction)
            this.props.bidActions.checkWinner()
        }
    }

    handleBidSubmit(bid) {
        this.props.bidActions.submitBid(this.props.auction.data[0], bid, this.props.userId)
            .then(function(result) { 
                // TODO is this the place to turn on spinner?
                console.log('returned promise 1', result) 
            })
            .catch(err => console.log('dang it', err))
    }

    componentWillUnmount() {
        this.props.bidActions.setWinMsg('')
        this.props.bidActions.setBidError('')
    }
    
	render(){
        const auct = this.props.auction.data[0] ? this.props.auction.data[0] : this.props.auction
        const end_moment = new moment(auct.ENDDATE)
        const bid_label = auct.ACTIVE ? 'Current Highest Bid' : 'Winning Bid'
 		return(
            <div>
                <h1 class="header">{auct.NAME} <small>id: {this.props.params.auction_id}</small></h1>
                <div class="col-xs-12">
                    <div class="col-md-12">
                        <label>{bid_label}:</label> ${auct.HIGHBID} {auct.ACTIVE ? `- ${auct.WINNER_NAME}` : null }
                    </div>
                    {(auct.MINBID > 0 && (auct.MINBID > auct.HIGHBID)) ?
                        <div class="col-md-12">
                            <label>Minimum Bid:</label> ${auct.MINBID}
                        </div>
                    : null }
                    <div class="col-md-12">
                        <label>Current Number of Bids:</label> {auct.NUMBIDS}
                    </div>
                    { auct.ACTIVE ? 
                        <div class="col-md-12">
                            <CountdownTimer end_date={auct.ENDDATE} />
                        </div>
                    :
                        <div class="col-md-12">
                            <label>Ended:</label> {end_moment.format('MMMM Do YYYY, h:mm:ss a')}
                            <br/>
                            <label>Winner:</label> {auct.WINNER_NAME}
                        </div>
                    }
                    <p class="col-md-12">{auct.DESCRIPTION}</p>
                </div>
                { auct.ACTIVE ? 
                    <Bid_form 
                        auction={this.props.auction.data[0]} 
                        loggedIn={this.props.isLoggedIn} 
                        handleBidSubmit={this.handleBidSubmit.bind(this)}
                        bidErr={this.props.bidErr}
                        winMsg={this.props.winMsg}
                    />
                :
                    null
                }
            </div>
		)
	}
}

function mapStateToProps(state) {
    return {
        auctions: state.auctions,
        auction: state.auction,
        isLoggedIn: state.auth.authenticated,
        bidErr: state.bids.view.errMsg,
        winMsg: state.bids.view.winMsg,
        userId: state.auth.auth ? state.auth.auth[0].EMPNUM : null
    }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch),
		bidActions: bindActionCreators(bidActions, dispatch),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auction)
