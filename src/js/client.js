import React from "react"
import ReactDOM from "react-dom"
import {Router, Route, IndexRoute, hashHistory, Redirect} from "react-router"
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import AuthCheckContainer from './components/Page/AuthCheck'
import Layout from './layouts/main'
import Home_pg from './components/Page/Home'
import Login_pg from './components/Page/Login'
import SignUp_pg from './components/Page/SignUp'
import Auction_pg from './components/Page/Auction'
import Auction from './components/Auctions/Auction'
import Auction_list from './components/Auctions/Auction_list'

import Admin_pg from './components/Page/Admin'
import Auction_form from './components/Admin/Auction_form'

import Fourohfour from './layouts/Fourohfour'

import injectTapEventPlugin from 'react-tap-event-plugin'

const app = document.getElementById('app')
const store = configureStore()

injectTapEventPlugin()

ReactDOM.render(
	<Provider store={store}>
		<Router onUpdate={() => window.scrollTo(0, 0)} history={hashHistory}>
			<Route path="/" component={Layout}>
				{/* these pages can only be accessed when logged in. wrap in auth checker */}
				<Route component={AuthCheckContainer}>
					<Route path="auctions/won" name="auctions" component={Auction_pg} status="won"></Route>

					<Route path="admin" name="admin" component={Admin_pg} title="Auction Administration">
						<IndexRoute component={Auction_list} />
						<Route path="auctions" name="auctionList" component={Auction_list} />
						<Route path="auction/:auction_id" name="editAuction" component={Auction_form} />
					</Route>
				</Route>
				<IndexRoute component={Home_pg} title="Welcome"></IndexRoute>
				<Route path="login" name="login" component={Login_pg} title="Login"></Route>
				<Route path="signup" name="signup" component={SignUp_pg} title="Sign Up"></Route>
				<Route path="logout" name="logout" component={Login_pg} title="Login"></Route>
				
				<Route path="auctions" name="auctions" component={Auction_pg}></Route>
				<Route path="auctions/:status" name="auctions" component={Auction_pg}></Route>
				<Route path="auction/:auction_id" component={Auction}></Route>

			</Route>
			{/* could use completely different layout for 404 or whatever */}
			<Route path="*" name="fourohfour" component={Fourohfour} title="Ooops!!"></Route>
		</Router>
	</Provider>,
	app
);
