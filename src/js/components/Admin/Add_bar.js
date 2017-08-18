import React from "react"
import PropTypes from 'prop-types'

import './admin.scss'

class AddBar extends React.Component{
    render(){
        const handleClick = this.props.handleClick
        return(
            <div class="add-bar col-xs-12">
                <button class="btn btn-primary btn-sm" onClick={() => handleClick()}>
                    <span class="glyphicon glyphicon-plus" /> Add a new Auction
                </button>
            </div>
        )
    }
}

AddBar.defaultProps = {
    handleClick: () => {}
}

AddBar.propTypes = {
    handleClick: PropTypes.func.isRequired
}

export default AddBar
