import React from "react"
import PropTypes from 'prop-types'

import './admin.scss'

class List_controls extends React.Component{
    render(){
        const handleDelete = this.props.handleDelete
        const handleEdit = this.props.handleEdit
        const item_id = this.props.item_id

        return(
            <div class="list-controls">
                <button class="btn btn-primary btn-sm" onClick={() => handleEdit(item_id)}>
                    <span class="glyphicon glyphicon-pencil" /><span class="sr-only">Edit</span>
                </button>
                <button class="btn btn-danger btn-sm" onClick={() => handleDelete(item_id)}>
                    <span class="glyphicon glyphicon-remove" /><span class="sr-only">Delete</span>
                </button>
            </div>
        )
    }
}

List_controls.defaultProps = {
    item_id: 0,
    handleDelete: () => {},
    handleEdit: () => {}
}

List_controls.propTypes = {
    item_id: PropTypes.number.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
}

export default List_controls
