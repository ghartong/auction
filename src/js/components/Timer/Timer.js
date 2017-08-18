import React from "react"
import moment from 'moment'
import countdown from 'countdown'
require('moment-countdown')
import * as actions from '../../actions/auctions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class CountdownTimer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {secondsRemaining: moment().countdown(props.end_date).toString()};
  }

  componentDidMount() {
    if ( moment(this.props.end_date).isAfter(moment())  ){
      this.timerID = setInterval(
        () => this.tick(this.props.end_date),
        1000
      )
    } else {
      this.props.actions.endAuction()      
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick(endDate) {
    if ( this.state.secondsRemaining ) {
        this.setState({
        secondsRemaining: moment().countdown(endDate).toString()
        });
    } else {
        clearInterval(this.timerID);
        this.props.actions.endAuction()
    }
  }

  render() {
    return (
      <div><label>Ending:</label> {this.state.secondsRemaining}</div>
    )
  }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(null, mapDispatchToProps)(CountdownTimer)
