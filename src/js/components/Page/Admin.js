import React from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hashHistory } from "react-router"
import { orderBy as loOrderBy, filter as loFilter } from "lodash"
import * as adminActions from '../../actions/admin'
import * as auctionActions from '../../actions/auctions'
import Win_msg from '../Win/win'
import Err_msg from '../ErrorMsg/errorMsg'
import PropTypes from 'prop-types'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import moment from 'moment'

import "./Page.scss"

class Admin_pg extends React.Component{
    static childContextTypes = {
        muiTheme: PropTypes.object
    }

    //I don't understand all this. needed to stop some odd errors. Googled this solution
    getChildContext() {
        return {
            muiTheme: getMuiTheme(lightBaseTheme)
        }
    }

    handleAddAuction() {
        hashHistory.push('admin/auction/0')
    }

    handleEditAuction(auction_id) {
        hashHistory.push(`admin/auction/${auction_id}`)
    }

    handleDeleteAuction(auction_id) {
        if ( confirm('Are you sure?') ) {
            // delete from database and state.auctions
            this.props.adminActions.deleteAuction(auction_id)
            .then(()=>{
                // update state auction_list
                const filteredList = loOrderBy(this.props.auctions, ['ACTIVE', 'ENDDATE'], ['desc', 'desc'])
                this.props.auctionActions.setAuctionList(filteredList)
            })
        }
    }

    handleFormSubmit(values) {
        //convert ENDDATE from date obj to string in desired format
        const goodVals = {...values, ENDDATE: moment(values.end_date).format('MM/DD/YYYY') + ' ' +moment(values.end_time).format('HH:mm:ss')}

        this.props.auctionActions.updateAuction(goodVals)
        .then(()=>{
            hashHistory.push(`admin`)
        })
    }

    handleFormCancel() {
        hashHistory.push(`admin`)
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.params.auction_id && (this.props.params.auction_id != nextProps.params.auction_id) ) {
            // get id from url. needed for when page is reloaded or loaded directly
            const urlAuction = parseInt(nextProps.params.auction_id)
            // get the correct auction from the state
            const auctionFromStateArray = loFilter(this.props.auctions, {'ID': urlAuction})
            if (auctionFromStateArray[0]) {
                this.props.auctionActions.setAuction(auctionFromStateArray[0])
            } else {
                this.props.auctionActions.resetAuction()
            }
        }
        return true
    }

    render(){
        const showWin = this.props.auction.view.msg ? true : false
        const showErr = this.props.auction.view.errMsg ? true : false
		return(
			<div>
                <h1>Auction Administration</h1>
                {showWin && <Win_msg msg={this.props.auction.view.msg} />}
                {showErr && <Err_msg msg={this.props.auction.view.errMsg} />}
                {React.cloneElement(this.props.children, 
                    { 
                        status: 'admin',
                        handleAddAuction: () => this.handleAddAuction.bind(this),
                        handleEditAuction: () => this.handleEditAuction.bind(this),
                        handleDeleteAuction: () => this.handleDeleteAuction.bind(this),
                        handleFormSubmit: () => this.handleFormSubmit.bind(this),
                        handleFormCancel: () => this.handleFormCancel.bind(this),
                        auction_id: this.props.params.auction_id ? parseInt(this.props.params.auction_id) : 0,
                    })}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
  return {
    auction: state.auction,
    auction_msg: state.auction.view,
    auctions: state.auctions.data,
    isLoggedIn: state.auth.authenticated,
    isAdmin: state.auth.isAdmin
  }
}

function mapDispatchToProps(dispatch) {
	return {
        adminActions: bindActionCreators(adminActions, dispatch),
        auctionActions: bindActionCreators(auctionActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin_pg)
