import React from 'react'
import { connect } from 'react-redux'
import { hashHistory } from "react-router"
import * as actions from '../../actions/login'
import { bindActionCreators } from 'redux'

class AuthCheck extends React.Component {
  componentDidMount() {
    const { dispatch, currentURL } = this.props

    if (!this.props.isLoggedIn) {
      this.props.actions.setRedirectURL(this.props.currentURL)
      hashHistory.push("/login")
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      return this.props.children
    } else {
      return null
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: state.auth.authenticated,
    currentURL: ownProps.location.pathname
  }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthCheck)