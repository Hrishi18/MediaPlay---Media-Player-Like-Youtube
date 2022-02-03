import React, { Component } from 'react'

import VideoGrid from '../../components/VideoGrid/VideoGrid'
import { withRouter } from "react-router-dom";

class HomePage extends Component {

    onVideoClick = () => {
        this.props.history.push('/watch')
    }
    render() {
        return (
            <>

                <VideoGrid onVideoClick={this.onVideoClick} headerTitle='Recommended' />
            </>

        )
    }

}

export default withRouter(HomePage)