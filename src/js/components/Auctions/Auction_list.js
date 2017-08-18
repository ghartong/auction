import React from "react"
import PropTypes from 'prop-types'
import { filter as lofilter, orderBy as loOrderBy } from "lodash"
import { IndexLink, Link } from "react-router"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as actions from '../../actions/auctions'
import List_controls from '../Admin/List_controls'
import AddBar from '../Admin/Add_bar'
import './auctions.scss'

class Auction_list extends React.Component{
    constructor(props) {
        super(props)
        this.getList(props.auctions.data, props.status)
    }

    componentWillReceiveProps(nextProps) {
        //if auctions or url param changed, reload the list
        if ( (nextProps.auctions.data !== this.props.auctions.data) || (nextProps.status !== this.props.status) ) {
            this.getList(nextProps.auctions.data, nextProps.status)
        }
    }

    getList(auctions, status) {
        let filteredList = []
        switch (status.toLowerCase()) {
            case 'archived':
                filteredList = lofilter(auctions, {'ACTIVE' : false} )
                break
            case 'won':
                filteredList = lofilter(auctions, {'WINNER': this.props.user_id, 'ACTIVE': false } )
                break
            case 'admin':
                filteredList = loOrderBy(auctions, ['ACTIVE', 'ENDDATE'], ['desc', 'desc'])
                break
            default:
                filteredList = lofilter(auctions, {'ACTIVE' : true} )
        }
        this.props.actions.setAuctionList(filteredList)
    }

    displayList(list, status, isAdmin, handleEditAuction, handleDeleteAuction) {
        let alist = list.map(function(auction){
            let winnerBox = 
                <div>
                    <strong>Ends:</strong> {moment(auction.ENDDATE).format('MMMM Do YYYY, h:mm a')}
                </div>
            if (!auction.ACTIVE) {
                winnerBox =
                <div>
                    <strong>Ended:</strong> {moment(auction.ENDDATE).format('MMMM Do YYYY, h:mm a')}
                    <br/>
                    <strong>Winner:</strong> {auction.WINNER_NAME}
                </div>
            }
            return (<li key={auction.ID}>
                        <Link to={`auction/${auction.ID}`}>{auction.NAME}</Link>
                        <br/>
                        {winnerBox}
                        {isAdmin && status === 'admin' ? 
                            <List_controls 
                                item_id={parseInt(auction.ID)}
                                handleEdit={handleEditAuction}
                                handleDelete={handleDeleteAuction}
                            />
                        :
                            null
                        }
                    </li>)
        })
        return <ul class="auction-list col-xs-12">{alist}</ul>
    }

	render(){
        let header_text = ''
        let isAdmin = this.props.isAdmin
        switch (this.props.status.toLowerCase()) {
            case 'won':
                header_text = 'Won'
                break
            case 'archived':
                header_text = 'Closed'
                break
            case 'admin':
                header_text = 'All'
                break
            default:
                header_text = 'Open'
        }
        const auction_list = this.props.auction_list.data ? this.props.auction_list.data : this.props.auction_list
        const displayList = this.displayList.bind(this)
        const status = this.props.status
		return(
            <div>
                <div class="header">
                    <h1>{header_text} Auctions</h1>
                </div>
                {this.props.status.toLowerCase() === 'admin' ? 
                    <AddBar handleClick={this.props.handleAddAuction()} />
                : null}
                <div class="col-xs-12">
                    {auction_list.length ?
                        displayList(auction_list, status, isAdmin, this.props.handleEditAuction(), this.props.handleDeleteAuction())
                    :
                        <p>No auctions available at this time.</p>
                    }
                </div>
            </div>
		);
	}
}

Auction_list.defaultProps = {
    status: 'open',
    handleDeleteAuction: () => {},
    handleEditAuction: () => {},
    handleAddAuction: () => {}
}

Auction_list.propTypes = {
    status:  PropTypes.string,
    handleDeleteAuction: PropTypes.func,
    handleEditAuction: PropTypes.func,
    handleAddAuction: PropTypes.func
}

function mapStateToProps(state) {
    return {
        auctions: state.auctions,
        auction_list: state.auction_list,
        user_id: state.auth.auth ? state.auth.auth[0].EMPNUM : 0,
        isAdmin: state.auth.isAdmin ? state.auth.isAdmin : false
    }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auction_list)
