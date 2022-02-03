import React, { Component } from 'react'
import { withRouter, useParams } from "react-router-dom";
import SearchVideoGrid from '../../components/SearchVideoGrid/SearchVideoGrid'


class SearchPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            searchtext: this.props.match.params.id,

        }

    }
    onVideoClick = () => {
        this.props.history.push('/watch/')
        window.location.reload();

    }

    render() {
        let state = this.state

        return (

            <SearchVideoGrid st={this.props.match.params.id} onVideoClick={this.onVideoClick} headerTitle={this.state.searchtext} />




        );
    }
}


export default withRouter(SearchPage)