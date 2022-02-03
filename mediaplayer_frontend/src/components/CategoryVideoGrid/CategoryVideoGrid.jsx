import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import axios from 'axios'

import "./category-video-grid.css";

export default class CategoryVideoGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videothumbnaildata: [],
            categorydata: {}
        }

    }

    componentDidMount = () => {
        console.log('test')
        console.log("hi from categorygrid")
        //const { videoId } = this.props;
        console.log('categorypage' + this.props.categoryId)


        axios.get(`${"http://localhost:44307/api/Video/userwithcategoryvideo/"}${this.props.videoId}`)
            .then((response) => {
                console.log("videodata")
                this.setState({ videothumbnaildata: [...response.data] }, () => console.log(this.state))

            })
            .catch((error) => {
                console.log(error);
            });
        axios.get(`${"http://localhost:44307/api/Category/"}${this.props.videoId}`)
            .then((response) => {
                console.log("d " + response.data);
                this.setState({ categorydata: response.data }, () => console.log(this.state))

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
        const { isSmall } = this.props;



        return (
            <section class={`categoryvideos ${isSmall ? 'small-mode' : ''}`}>
                {<h1>{this.state.categorydata.categoryType}</h1>}
                {this.state.videothumbnaildata.map(this.renderVideo)}
            </section>
        );
    }
}
