import React, { Component } from 'react'

import LikedVideoGrid from '../../components/LikedVideoGrid/LikedVideoGrid'
import { withRouter } from "react-router-dom";

class LikedPage extends Component {

    onVideoClick = () => {
        this.props.history.push('/watch')
    }
    render() {
        return (
            <>

                <LikedVideoGrid onVideoClick={this.onVideoClick} headerTitle='Liked by you...' />
            </>

        )
    }

}

export default withRouter(LikedPage)