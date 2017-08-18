import React from "react";

import "./Header.scss";

export default class Header extends React.Component{
	render(){
		return(
			<div class="header">
				{this.props.child_title ?
					<h1>
						{this.props.child_title}
					</h1>
				:''}
			</div>
		);
	}
}
