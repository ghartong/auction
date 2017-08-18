import React from "react"
import { Field, reduxForm } from 'redux-form'
import { hashHistory } from "react-router"
import * as loginActions from '../../actions/login'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Win_msg from '../Win/win.js'

import './Bid_form.scss'

const validate = values => {
    const errors = {}

    if (!values.bid) {
        errors.bid = "Please enter a bid.";
    } else if (isNaN(values.bid) || !Number.isInteger(values.bid * 1)) {
        errors.bid = "Please enter a bid in whole dollar amounts.";
    }

    if (values.bidErr) {
        errors.bid = values.bidErr;
    }

    return errors
}

class Bid_form extends React.Component{
    handleFormSubmit = (values) => {
       this.props.handleBidSubmit(values.bid).then(function(result) {
            this.props.validate({bidErr:this.props.bidErr})
        })
    }

    renderField = ({ input, label, type, meta: { touched, error } }) => (
        <div class={`form-group ${touched && error ? 'has-error' : ''}`}>
            <label class="sr-only">{label}</label>
            <div class="col-md-4">
                <input {...input} class="form-control" type={type} placeholder={label} />
                {touched && error && <div class="help-block"><small>{error}</small></div>}
            </div>
        </div>
    )

    handleLogin() {
        this.props.loginActions.setRedirectURL(`auction/${this.props.auction.ID}`)
        hashHistory.push('login')
    }

	render(){
        const auction_id = this.props.auction.id
        const winMsg = this.props.winMsg
		return(
            <div class="bid-form col-xs-12">
                    {winMsg ?
                        <Win_msg msg={winMsg} />
                    :
                        <div class="col-md-12">
                            { this.props.bidErr && <div class="has-error"><div class="help-block"><small>{this.props.bidErr}</small></div></div>}
                            { this.props.loggedIn ?
                                <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
                                    <Field name="bid" type="number" component={this.renderField} label="Bid" />

                                    <button action="submit" class="btn btn-primary">Place Bid</button>
                                </form>
                            :
                                <fieldset class="buttons row">
                                    <h2 class="col-xs-12">Login now to place your bid.</h2>
                                    <div class="col-xs-12 col-md-11">
                                        <button onClick={this.handleLogin.bind(this)} class="btn btn-primary">Login</button>
                                    </div>
                                </fieldset>
                            }
                        </div>
                    }
            </div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loginActions: bindActionCreators(loginActions, dispatch)
	}
}

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'bid',
    validate
})(Bid_form))