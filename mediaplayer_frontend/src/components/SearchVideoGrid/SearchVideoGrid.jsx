import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { withRouter, useParams } from "react-router-dom";
import axios from 'axios'

import "./search-video-grid.css";

export default class SearchVideoGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videothumbnaildata: [],


        }

    }

    componentDidMount = () => {
        const { st } = this.props;
        console.log('test')
        console.log("hi from searchgrid")

        axios.get(`${"http://localhost:44307/api/Search/searchvideo/"}${st}`)
            .then((response) => {
                console.log("videodata")
                this.setState({ videothumbnaildata: [...response.data] }, () => console.log(this.state))

            })
            .catch((error) => {
                console.log(error);
            });
    }

    renderVideo = (video) => {
        const { isSmall } = this.props;


        return (
            <Link className="text-link" to={"/watch/" + video.videoId} onClick={() => { this.props.history.push("/watch/" + video.videoId); window.location.reload() }}>
                <div class="video" >
                    <p class="animate-text">{video.videoDescription}</p>

                    <img class="thumbnail" src={video.videoThumbnailPath} alt="" />
                    {!isSmall && <>

                        <h2 class="title">{video.videoTitle}</h2>

                    </>}
                    {!!isSmall && <div>
                        <h2 class="title">{video.videoTitle}</h2>

                    </div>}

                    {!isSmall && <>

                        <h3 class="name">{video.name}</h3>

                    </>}
                    {!!isSmall && <div>
                        <h3 class="name">{video.name}</h3>

                    </div>}

                </div>
            </Link>)
    }
    render() {
        const { headerTitle, isSmall } = this.props;




        return (
            <section class={`searchvideos ${isSmall ? 'small-mode' : ''}`}>
                {<h1>Search results for "{headerTitle}"</h1>}
                {this.state.videothumbnaildata.map(this.renderVideo)}
            </section>
        );
    }
}
