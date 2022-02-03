import React, { Component } from 'react'

import LibraryVideoGrid from '../../components/LibraryVideoGrid/LibraryVideoGrid'
import { withRouter } from "react-router-dom";

class LibraryPage extends Component {

    onVideoClick = () => {
        this.props.history.push('/watch')
    }
    render() {
        return (
            <>

                <LibraryVideoGrid onVideoClick={this.onVideoClick} headerTitle='All you uploaded...' />
            </>

        )
    }

}

export default withRouter(LibraryPage)