import React from "react"

class Err_msg extends React.Component{
    render(){
        const msg = this.props.msg
        return(
            <div class="err-msg alert alert-danger">
                {msg}
            </div>
        )}

}

Err_msg.defaultProps = {
    msg: 'Error message goes here.'
}

export default Err_msg
