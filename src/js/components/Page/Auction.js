import React from "react";

import "./Page.scss";
import Auction_list from '../Auctions/Auction_list.js'

export default class Auction_pg extends React.Component{
	render(){
		return(
			<div>
                <Auction_list 
					status={this.props.params.status ? this.props.params.status : this.props.route.status ? this.props.route.status : 'open'} 
				/>
			</div>
		);
	}
}
