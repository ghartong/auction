import React from "react"
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { DatePicker, TimePicker } from 'redux-form-material-ui';
import { connect } from 'react-redux'
import { filter as loFilter } from 'lodash'
import { setAuction } from '../../actions/auctions'
import moment from 'moment'

import './admin.scss'

const validate = values => {
    const errors = {}

    if (!values.NAME) {
        errors.NAME = "Please enter a name for this auction.";
    }

    if (values.MINBID < 0) {
        errors.MINBID = "Please enter a minimum bid for this auction. '0' is none."
    } else if (isNaN(values.MINBID)) {
        errors.MINBID = "Please enter a whole number only for a minimum bid for this auction. '0' is none."
    }

    if (!values.ENDDATE) {
        errors.ENDDATE = "Please enter an end date for this auction.";
    }

    return errors
}

class Auction_form extends React.Component{
    renderField = ({ input, label, type, meta: { touched, error } }) => (
        <fieldset class={`form-group ${touched && error ? 'has-error' : ''} ${type==='hidden' ? 'no-display' : ''}`}>
            <label class="control-label">{label}</label>
            <div>
                <input {...input} class="form-control" type={type} placeholder={label} />
                {touched && error && <div class="help-block"><small>{error}</small></div>}
            </div>
        </fieldset>
    )

    renderArea = ({ input, label, type, meta: { touched, error } }) => (
        <fieldset class={`form-group ${touched && error ? 'has-error' : ''} ${type==='hidden' ? 'no-display' : ''}`}>
            <label class="control-label">{label}</label>
            <div>
                <textarea {...input} class="form-control" type={type} placeholder={label}>{input.value}</textarea>
                {touched && error && <div class="help-block"><small>{error}</small></div>}
            </div>
        </fieldset>
    )

    renderBox = ({ input, label, type, notes, meta: { touched, error } }) => (
        <fieldset class={`form-group ${touched && error ? 'has-error' : ''} ${type==='hidden' ? 'no-display' : ''}`}>
            <div>
                <label class="checkbox-inline">
                    <input {...input} class="form-control" type={type} />
                    {notes}
                </label>
            </div>
        </fieldset>
    )

    renderDate = ({ input, label, meta: { touched, error } }) => (
        <fieldset class={`form-group ${touched && error ? 'has-error' : ''}`}>
            <label class="control-label">{label}</label>
            <div>
                <DatePicker
                    {...input}
                    hintText="Controlled Date Input"
                />
                {touched && error && <div class="help-block"><small>{error}</small></div>}
            </div>
        </fieldset>
    )

    render(){
        const auction = this.props.auction
        const addEditLabel = auction.ID > 0 ? 'Edit' : 'Add'
        const addEditVerb = auction.ID > 0 ? 'edit' : 'add'
        return(
            <div class="auction-form">
                <h2>{addEditLabel} Auction {auction.NAME ? `: ${auction.NAME}` : null}</h2>
                <form onSubmit={this.props.handleSubmit(this.props.handleFormSubmit())}>
                    <Field type="text" component={this.renderField} label="Name" name="NAME" />

                    <Field type="number" component={this.renderField} label="Minimum Bid" name="MINBID" />
            
                    <fieldset class={`form-group `}>
                        <label class="control-label">End Date</label>
                        <div>
                            <Field
                                name="end_date"
                                component={DatePicker}
                                format={null}
                                hintText="Day the auction should end"
                                className="date-picker"
                            />
                      </div>
                    </fieldset>

                    <fieldset class={`form-group `}>
                        <label class="control-label">End Time</label>
                        <div>
                            <Field
                                name="end_time"
                                component={TimePicker}
                                format={null}
                                hintText="Time the auction should end"
                                className="time-picker"
                            />
                      </div>
                    </fieldset>

                    <Field component={this.renderArea} label="Description" name="DESCRIPTION" multiLine={true} rows={4} />
            
                    <Field type="checkbox" component={this.renderBox} label="Is Active" name="ACTIVE" notes="check to make active" />
            
                    <div class="list-controls">
                        <button action="submit" class="btn btn-primary"><span class="glyphicon glyphicon-ok" /> Save</button>
                        <button onClick={this.props.handleFormCancel()} class="btn btn-danger"><span class="glyphicon glyphicon-remove" /> Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}

Auction_form.defaultProps = {
    handleFormSubmit: () => { console.log('sucker') }
}

Auction_form.propTypes = {
    handleFormSubmit: PropTypes.func.isRequired
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
Auction_form = reduxForm({
  form: 'auction',  // a unique identifier for this form
    enableReinitialize: true,
  validate
})(Auction_form)

// You have to connect() to any reducers that you wish to connect to yourself
Auction_form = connect(
  state => ({
        auction: state.auction.data,
        auctions: state.auctions.data,
        initialValues: {
            ID: state.auction.data.ID,
            NAME: state.auction.data.NAME,
            MINBID: state.auction.data.MINBID,
            end_date: new Date(state.auction.data.ENDDATE),
            end_time: new Date(state.auction.data.ENDDATE),
            DESCRIPTION: state.auction.data.DESCRIPTION,
            ACTIVE: state.auction.data.ACTIVE
        }
  })
)(Auction_form)

export default Auction_form
