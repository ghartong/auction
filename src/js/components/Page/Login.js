import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as actions from '../../actions/login'
import { hashHistory } from "react-router"

const validate = values => {
    const errors = {}

    if (!values.username) {
        errors.username = "Please enter a username.";
    }

    if (!values.password) {
        errors.password = "Please enter your password."
    }

    return errors
}

class Login extends React.Component {
    handleFormSubmit = (values) => {
        this.props.signInUser(values)
        .then(() => {
            if (!this.props.authenticationError) {
                let redirectURL = this.props.redirectURL ? this.props.redirectURL : '/'
                hashHistory.push(redirectURL)
            }
        })
    }

    renderField = ({ input, label, type, autoFocus, meta: { touched, error } }) => (
        <fieldset class={`form-group ${touched && error ? 'has-error' : ''}`}>
            <label class="control-label">{label}</label>
            <div>
                <input {...input} class="form-control" type={type} placeholder={label} autoFocus={autoFocus} />
                {touched && error && <div class="help-block"><small>{error}</small></div>}
            </div>
        </fieldset>
    )

    renderAuthenticationError() {
        if (this.props.authenticationError) {
            return <div className="alert alert-danger">{ this.props.authenticationError }</div>
        }
        return <div></div>
    }

    render() {
        return (
            <div class="container">
                <div class="col-md-6 col-md-offset-3">
                    { this.renderAuthenticationError() }
                    <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
                        <Field name="username" type="text" component={this.renderField} label="Username" autoFocus={true} />
                        <Field name="password" type="password" component={this.renderField} label="Password" />

                        <button action="submit" class="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        redirectURL: state.auth.redirectURL,
        authenticationError: state.auth.error
    }
}

export default connect(mapStateToProps, actions)(reduxForm({
    form: 'login',
    validate
})(Login))
