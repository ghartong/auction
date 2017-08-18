import React from "react"
import { IndexLink, Link } from "react-router"
import { connect } from "react-redux"
import * as loginActions from '../../actions/login'
import { bindActionCreators } from 'redux'

class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
      today: new Date(),
      dropClass: false
    }
  }

  handleSignout() {
    this.toggleDrop()
    this.props.loginActions.signOutUser()
  }

  handleLogin() {
    this.toggleCollapse()
    this.props.loginActions.setRedirectURL('/')
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed
    this.setState({collapsed})
  }

  toggleDrop() {
    const dropClass = !this.state.dropClass
    this.setState({dropClass})
  }

  render() {
    const { location } = this.props
    const { collapsed } = this.state
    const navClass = collapsed ? "collapse" : ""

    return (
      <nav class={"navbar navbar-default row"} role="navigation">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <span>Signet IT Charity Auctions</span>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li >
                <IndexLink activeClassName="active" to="/" onClick={this.toggleCollapse.bind(this)}>
                  Welcome
                </IndexLink>
              </li>
              <li>
                <Link activeClassName="active" to="auctions" onClick={this.toggleCollapse.bind(this)}>
                  Open Auctions
                </Link>
              </li>
              <li>
                <Link activeClassName="active" to="auctions/archived" onClick={this.toggleCollapse.bind(this)}>
                  Closed Auctions
                </Link>
              </li>
              {this.props.authenticated ? 
                <li class={this.state.dropClass ? 'dropdown open' : 'dropdown'}>
                  <a onClick={this.toggleDrop.bind(this)} class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded={this.state.dropClass}>Glenn Hartong <span class="caret"></span></a>
                  <ul class="dropdown-menu">
                    <li>
                      <Link to="auctions/won" onClick={this.toggleDrop.bind(this)}>I Won</Link>
                    </li>
                    <li>
                      <Link to="admin" onClick={this.toggleDrop.bind(this)}>Admin</Link>
                    </li>
                    <li role="separator" class="divider"></li>
                    <li>
                      <Link to="logout" onClick={this.handleSignout.bind(this)}>Logout</Link>
                    </li>
                  </ul>
                </li>
              :
                <li>
                  <Link activeClassName="active" to="login" onClick={this.handleLogin.bind(this)}>
                    Login
                  </Link>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

function mapDispatchToProps(dispatch) {
	return {
		loginActions: bindActionCreators(loginActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
