import React, { Component, useEffect, useState } from 'react'
import { List, Avatar, Typography, Row, Col } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Grid } from '@material-ui/core'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Tooltip from '@mui/material/Tooltip';
import CategoryVideoGrid from '../../components/CategoryVideoGrid/CategoryVideoGrid'
import { Link } from "react-router-dom";
import history from '../../components/History/History';
import "./watch-page.css";
import { ReactSession } from 'react-client-session';
import Snackbar from '@mui/material/Snackbar';





class WatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoid: this.props.match.params.id,
            videodata: {},
            commentdata: [],
            commenttext: '',
            openSnack: false,
            userid: '',
            username: '',
            userdata: {},
            likes: '',
            dislikes: '',
            likedaction: '',
            dislikedaction: '',




        }

    }

    componentDidMount() {


        axios.get(`${"http://localhost:44307/api/Video/"}${this.state.videoid}`)
            .then((response) => {
                //console.log(response.data);

                this.setState({ videodata: response.data }, () => console.log(this.state))
            })
            .catch((error) => {
                console.log(error);
            });
        axios.get(`${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}`)
            .then((response) => {
                console.log("status " + response.data);

                if (response.data == 1) {
                    this.setState({ likedaction: 'liked' }, () => console.log(this.state))
                    this.setState({ dislikedaction: '' }, () => console.log(this.state))
                    console.log("likedactioninside1")

                }
                else if (response.data == 0) {
                    this.setState({ likedaction: '' }, () => console.log(this.state))
                    this.setState({ dislikedaction: 'disliked' }, () => console.log(this.state))
                    console.log("likedactioninside2")
                }
                else {
                    this.setState({ likedaction: '' }, () => console.log(this.state))
                    this.setState({ dislikedaction: '' }, () => console.log(this.state))
                    console.log("likedactioninside3")

                }


            })
            .catch((error) => {
                console.log(error);
            });
        axios.get(`${"http://localhost:44307/api/Comment/commentswithusername/"}${this.state.videoid}`)
            .then((response) => {
                //console.log(response.data);

                this.setState({ commentdata: [...response.data] }, () => console.log(this.state))

            })
            .catch((error) => {
                console.log(error);
            });

        axios.get(`${"http://localhost:44307/api/Users/"}${ReactSession.get("userId")}`)
            .then((response) => {
                //console.log("user " + response.data);

                this.setState({ userdata: response.data }, () => console.log(this.state))

            })
            .catch((error) => {
                console.log(error);
            });



        axios.get(`${"http://localhost:44307/api/Like/likescount/"}${this.state.videoid}`)
            .then((response) => {
                console.log("l " + response.data);
                this.setState({ likes: response.data }, () => console.log(this.state))
            })
            .catch((error) => {
                console.log(error);

            });

        axios.get(`${"http://localhost:44307/api/Like/dislikescount/"}${this.state.videoid}`)
            .then((response) => {
                console.log("d " + response.data);
                this.setState({ dislikes: response.data }, () => console.log(this.state))

            })
            .catch((error) => {
                console.log(error);

            });



    }

    handleSearch = () => {
        if (this.state.videodata['videoTag'] != "") {
            history.push('/SearchPage/' + this.state.videodata['videoTag']);
            window.location.reload();
        }

    }
    handleClick = () => {
        this.setState({ openSnack: true });
        console.log(this.state.openSnack)
    };
    handleClose = () => {
        this.setState({ openSnack: false });
    };
    handleLike = () => {
        if (!ReactSession.get("isSubmitted")) {
            this.handleClick();
            return;
        }
        //like=1 dislike=0
        //like=1 dislike=1
        if (this.state.likedaction === 'liked') {
            axios.delete(`${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}`)
                .then((data) => {
                    console.table(data.data)
                    axios.get(`${"http://localhost:44307/api/Like/likescount/"}${this.state.videoid}`)
                        .then((response) => {
                            //console.log(response.data);
                            this.setState({ likes: response.data }, () => console.log(this.state))
                            this.setState({ likedaction: '' }, () => console.log(this.state))

                        })

                })

                .catch((error) => {
                    console.log(error)

                })

        }
        //like=0 dislike=1
        //delete data
        //add like
        else if (this.state.likedaction === '' && this.state.dislikedaction === 'disliked') {

            let url = `${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}/${"true"}`

            axios.delete(`${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}`)
                .then((data) => {
                    console.table(data.data)
                    axios.post(url)
                        .then((data) => {
                            console.table(data.data)
                            axios.get(`${"http://localhost:44307/api/Like/likescount/"}${this.state.videoid}`)
                                .then((response) => {
                                    //console.log(response.data);
                                    this.setState({ likes: response.data }, () => console.log(this.state))
                                    axios.get(`${"http://localhost:44307/api/Like/dislikescount/"}${this.state.videoid}`)
                                        .then((response) => {
                                            //console.log(response.data);
                                            this.setState({ dislikes: response.data }, () => console.log(this.state))
                                            this.setState({ likedaction: 'liked' }, () => console.log(this.state))
                                            this.setState({ dislikedaction: '' }, () => console.log(this.state))
                                        })
                                        .catch((error) => {
                                            console.log(error);

                                        });

                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        })
                        .catch((error) => {
                            console.table('Error : ' + error)

                        })



                })
                .catch((error) => {
                    console.log(error)

                })

        }
        //like=0 dislike=0
        else {
            let url = `${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}/${"true"}`
            axios.post(url)
                .then((data) => {
                    console.table(data.data)
                    axios.get(`${"http://localhost:44307/api/Like/likescount/"}${this.state.videoid}`)
                        .then((response) => {
                            //console.log(response.data);
                            this.setState({ likes: response.data }, () => console.log(this.state))
                            this.setState({ likedaction: 'liked' }, () => console.log(this.state))
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.table('Error : ' + error)

                })

        }

    }

    handleDislike = () => {
        if (!ReactSession.get("isSubmitted")) {
            this.handleClick();
            return;
        }
        if (this.state.dislikedaction === 'disliked') {
            axios.delete(`${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}`)
                .then((data) => {
                    console.table(data.data)
                    axios.get(`${"http://localhost:44307/api/Like/dislikescount/"}${this.state.videoid}`)
                        .then((response) => {
                            //console.log(response.data);
                            this.setState({ dislikes: response.data }, () => console.log(this.state))
                            this.setState({ dislikedaction: '' }, () => console.log(this.state))

                        })

                })
                .catch((error) => {
                    console.log(error)

                })

        }
        else if (this.state.likedaction === 'liked' && this.state.dislikedaction === '') {

            let url = `${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}/${"false"}`

            axios.delete(`${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}`)
                .then((data) => {
                    console.table(data.data)
                    axios.post(url)
                        .then((data) => {
                            console.table(data.data)
                            axios.get(`${"http://localhost:44307/api/Like/dislikescount/"}${this.state.videoid}`)
                                .then((response) => {
                                    //console.log(response.data);
                                    this.setState({ dislikes: response.data }, () => console.log(this.state))
                                    axios.get(`${"http://localhost:44307/api/Like/likescount/"}${this.state.videoid}`)
                                        .then((response) => {
                                            //console.log(response.data);
                                            this.setState({ likes: response.data }, () => console.log(this.state))
                                            this.setState({ likedaction: '' }, () => console.log(this.state))
                                            this.setState({ dislikedaction: 'disliked' }, () => console.log(this.state))
                                        })
                                        .catch((error) => {
                                            console.log(error);

                                        });

                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        })
                        .catch((error) => {
                            console.table('Error : ' + error)

                        })



                })
                .catch((error) => {
                    console.log(error)

                })

        }
        else {
            let url = `${"http://localhost:44307/api/Like/"}${ReactSession.get("userId")}/${this.state.videoid}/${"false"}`
            axios.post(url)
                .then((data) => {
                    console.table(data.data)
                    axios.get(`${"http://localhost:44307/api/Like/dislikescount/"}${this.state.videoid}`)
                        .then((response) => {
                            //console.log(response.data);
                            this.setState({ dislikes: response.data }, () => console.log(this.state))
                            this.setState({ dislikedaction: 'disliked' }, () => console.log(this.state))
                        })
                        .catch((error) => {
                            console.log(error);

                        });
                })
                .catch((error) => {
                    console.table('Error : ' + error)
                })
        }

    }

    handleAlert = () => {
        alert("Clicked");
    }
    handleSubmit = () => {

        console.table(this.state)

        if (this.state.commenttext !== '') {
            console.log('Insertion Operation')

            //console.table(data)
            let url = `${"http://localhost:44307/api/Comment/"}${ReactSession.get("userId")}/${this.state.videoid}/${this.state.commenttext}`
            console.log("url:" + url)
            axios.post(url)
                .then((data) => {
                    console.table(data.data)
                    axios.get(`${"http://localhost:44307/api/Comment/commentswithusername/"}${this.state.videoid}`)
                        .then((response) => {
                            //console.log(response.data);
                            this.setState({ commentdata: [...response.data] }, () => console.log(this.state))
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.table('Error : ' + error)
                })
            this.setState({ commenttext: '' })
        } else {
            console.log('No data found Operation')
        }

    }

    handleChanges = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
        console.log('name : ' + name + ' value : ' + value)
    }

    onVideoClick = () => {
        this.props.history.push('/watch/')
        window.location.reload();

    }



    render() {
        let state = this.state
        console.log("cm" + this.state.commentdata)
        //const { id } = this.props.match.params.id;
        console.log(this.props.match.params.id);




        const ColoredLine = ({ color }) => (
            <hr
                style={{
                    color: color,
                    backgroundColor: color,
                    height: 1
                }}
            />
        );

        return (
            <div className='watch_page'>
                <Grid container spacing={2}>
                    <Grid item lg={9} xs={12}>
                        <div className="post_page" style={{ width: '100%', padding: '3rem 4em', textAlign: 'start' }}>
                            <video style={{ width: '100%' }} src={this.state.videodata["videoPath"]} controls></video>
                            <div className='video_details'>
                                <Grid container>
                                    <Grid lg={10} xs={8}>
                                        <h1>{this.state.videodata["videoTitle"]}</h1>
                                        <h2>{this.state.videodata["videoDescription"]}</h2>
                                        <Link onClick={this.handleSearch}> <h3>{this.state.videodata["videoTag"]}</h3></Link>

                                    </Grid>
                                    <Grid lg={2} xs={4}>
                                        <div className='likes'>
                                            <React.Fragment>
                                                <span key="comment-basic-like">
                                                    <Tooltip title="like">

                                                        <ThumbUpIcon type="like"
                                                            fontSize={'large'}
                                                            color={this.state.likedaction === 'liked' ? 'success' : 'action'}
                                                            //theme={this.state.likedaction === 'liked' ? 'filled' : 'outlined'}
                                                            onClick={this.handleLike}

                                                        />
                                                    </Tooltip>
                                                    <span style={{ paddingLeft: '10px', cursor: 'auto', fontFamily: 'Lucida Sans', fontSize: '20px' }}>{this.state.likes}</span>
                                                </span>&nbsp;&nbsp;
                                                <span key="comment-basic-dislike">
                                                    <Tooltip title="dislike">
                                                        <ThumbDownIcon
                                                            fontSize={'large'}
                                                            type="dislike"
                                                            color={this.state.dislikedaction === 'disliked' ? 'error' : 'action'}
                                                            //theme={this.state.dislikedaction === 'disliked' ? 'filled' : 'outlined'}
                                                            onClick={this.handleDislike}

                                                        />
                                                    </Tooltip>
                                                    <span style={{ paddingLeft: '10px', cursor: 'auto', fontFamily: 'Lucida Sans', fontSize: '20px' }}>{this.state.dislikes}</span>
                                                </span>
                                            </React.Fragment>

                                        </div>

                                    </Grid>

                                </Grid>
                            </div>
                            <ColoredLine color="grey" />
                            <div className='comments_section'>

                                <Grid container>
                                    <Grid lg={11} xs={8}>
                                        <div className="flex_containt">
                                            <TextField
                                                fullWidth
                                                id="commenttext"
                                                name="commenttext"
                                                placeholder="Comments..."
                                                variant="outlined"
                                                size="large"
                                                value={state.commenttext}
                                                onChange={this.handleChanges}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid lg={1} xs={4}>
                                        <div className="flex_button">
                                            <Button
                                                variant="contained"
                                                onClick={this.handleSubmit}

                                            >
                                                Post
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>

                            <div className="comment_display_section">
                                {

                                    this.state.commentdata.map(item =>
                                    (<div>
                                        <div className='comments_display'>
                                            <h1>{item.name}:</h1>
                                            <p>{item.commentText}</p>
                                        </div>

                                    </div>)
                                    )
                                }
                            </div>

                        </div>
                    </Grid >
                    <Snackbar
                        open={this.state.openSnack}
                        autoHideDuration={3000}
                        onClose={this.handleClose}
                        message="Please Sign-In first"

                    />
                    <Grid item lg={2} xs={12}>
                        <CategoryVideoGrid onVideoClick={this.onVideoClick} videoId={this.state.videoid} />
                    </Grid>
                </Grid >

            </div >


        )
    }
}


export default withRouter(WatchPage)