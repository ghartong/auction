import React from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import "../../css/_global.scss"
import Header from "../components/Header/Header"
import Title from "../components/Header/Title"
import Nav from "../components/Navigation/Nav"
import Footer from "../components/Footer/Footer"

import * as actions from '../actions/auctions'

class Layout extends React.Component{	
	componentDidMount() {
		//load state with auctions
		this.props.actions.requestAuctions()
	}
	render(){
		const {location} = this.props;
		// passed in from Route
		const child_title = this.props.children.props.route.title;
		return(
			<div class="row" id="mainrow">
				<div class="col-sm-12 title">
					<Title />
				</div>
				<div class="col-sm-12 main">
					{this.props.auctionErr ?
						<div class="col-xs-12 alert alert-danger">{this.props.auctionErr}</div>
					: null}
					<Header child_title={child_title}/>
					<div class="col-xs-12 main_content">
						{this.props.children}
					</div>
					<Footer />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
    return {
		auctions: state.auctions,
		auctionErr: state.auctions.view.errMsg
    }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
