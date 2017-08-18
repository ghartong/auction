import React from "react"

class Win_msg extends React.Component{
    render(){
        const msg = this.props.msg
        return(
            <div class="win-msg alert alert-success">
                {msg}
            </div>
        )}

}

Win_msg.defaultProps = {
    msg: 'Winning message goes here.'
}

export default Win_msg
