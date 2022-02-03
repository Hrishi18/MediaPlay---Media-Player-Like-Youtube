import React, { Component } from 'react';
import axios from 'axios';
import './uploadPage.css';
import { withRouter, useParams } from "react-router-dom";
import upload from "../../assets/images/upload.svg";
import ReactSession from 'react-client-session/dist/ReactSession';
import { TextField, Button, Grid } from '@material-ui/core'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import Select from '@mui/material/Select';
class UploadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: '',
            selectedThumbnail: '',
            status: '',
            progress: 0,
            category: ''
        }
    }
    selectFileHandler = (event) => {
        //1. define the array for the file type e.g. png, jpeg
        const fileTypes = ['video/mp4', 'video/mkv'];

        // 2. get the file type
        let file = event.target.files;
        console.log(`File ${file}`);
        // 3. the message for error if the file type of not matched
        let errMessage = [];
        // 4. to check the file type to match with the fileTypes array iterate 
        // through the types array
        if (fileTypes.every(extension => file[0].type != extension)) {
            errMessage.push(`The file ${file.type} extension is not supported`);
        } else {
            this.setState({
                selectedFile: file[0]
            });
        }
        document.getElementById("video").setAttribute("data-text", document.getElementById("videofile").value)
    };
    selectThumbnailHandler = (event) => {
        //1. define the array for the file type e.g. png, jpeg
        const fileTypes = ['image/jpeg', 'image/png', 'image/jpeg'];

        // 2. get the file type
        let file = event.target.files;
        console.log(`File ${file}`);
        // 3. the message for error if the file type of not matched
        let errMessage = [];
        // 4. to check the file type to match with the fileTypes array iterate 
        // through the types array
        if (fileTypes.every(extension => file[0].type != extension)) {
            errMessage.push(`The file ${file.type} extension is not supported`);
        } else {
            this.setState({
                selectedThumbnail: file[0]
            });
        }
        document.getElementById("thumbnail").setAttribute("data-text", document.getElementById("thubmnailfile").value)
    };
    // method contain logic to upload file
    uploadHandler = (event) => {
        // 1. the FormData object that contains the data to be posted to the 
        // WEB API
        const formData = new FormData();
        formData.append('videoFile', this.state.selectedFile);
        formData.append('ThumbnailFile', this.state.selectedThumbnail);
        formData.append('Video.VideoTitle', document.getElementById("title").value);
        formData.append('Video.UserId', ReactSession.get("userId"));
        formData.append('Video.CategoryId', this.state.category);
        formData.append('Video.VideoTag', document.getElementById("tags").value);
        formData.append('Video.VideoDescription', document.getElementById("description").value);
        console.log(ReactSession.get("token"))
        // 2. post the file to the WEB API
        axios({
            method: 'post',
            url: 'http://localhost:44307/api/Video',
            data: formData,

            headers: {
                'jwt': ReactSession.get("token")
            }

        })
            .then((response) => {
                this.setState({ status: `Upload Successful!` });
            })
            .catch((error) => {
                this.setState({ status: `Upload Failed!` });
            })



    }


    render() {

        const ColoredLine = ({ color }) => (
            <hr
                style={{
                    color: color,
                    backgroundColor: color,
                    height: 5
                }}
            />
        );
        const handleChange = (event) => {
            this.setState({ category: event.target.value });
        };

        const BootstrapInput = styled(InputBase)(({ theme }) => ({
            'label + &': {
                marginTop: theme.spacing(3),
            },
            '& .MuiInputBase-input': {
                borderRadius: 4,
                position: 'relative',
                backgroundColor: theme.palette.background.paper,
                border: '5px solid #ced4da',
                fontSize: 16,

                padding: '10px 26px 10px 12px',
                transition: theme.transitions.create(['border-color', 'box-shadow']),
                // Use the system font instead of the default Roboto font.
                fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ].join(','),
                '&:focus': {
                    borderRadius: 4,
                    borderColor: '#80bdff',
                    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
                },
            },
        }));
        return (

            <div className='upload-container'>
                <img src={upload} alt="uploadimg" className="uploadImg" />
                <h1 className='title'>Upload Video</h1>

                <div className='uploadForm'>
                    <Grid container spacing={2}>
                        <Grid lg={6} xs={8}>
                            <div id='video' className='file-upload-wrapper' data-text="Video">
                                <input id='videofile' className='file-upload-field' type="file" onChange={this.selectFileHandler} />
                            </div>
                        </Grid>
                        <Grid lg={6} xs={8}>

                            <div id='thumbnail' className='file-upload-wrapper' data-text="Thumbnail">
                                <input id='thubmnailfile' className='file-upload-field' type="file" onChange={this.selectThumbnailHandler} />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid lg={12} xs={8}>
                            <div className='textbox'  >

                                <input id='title' className='' type="text" placeholder='Title' />
                            </div>

                        </Grid>

                    </Grid>
                    <Grid container spacing={2}>
                        <Grid lg={11} xs={8}>
                            <div className='textbox3'>
                                <input id='tags' className='' type="text" placeholder='Tags' />
                            </div>
                        </Grid>
                        <Grid lg={1} xs={8}>

                            <Select className='cat'
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.category}
                                label="Category"
                                onChange={handleChange}
                                input={<BootstrapInput />}
                            >
                                <MenuItem value={1}>Food</MenuItem>
                                <MenuItem value={2}>Music</MenuItem>
                                <MenuItem value={3}>Animals</MenuItem>
                                <MenuItem value={4}>Educational</MenuItem>
                                <MenuItem value={5}>Kids</MenuItem>
                                <MenuItem value={6}>Entertainment</MenuItem>
                            </Select>


                        </Grid>
                    </Grid>

                    <Grid>

                        <div className='textbox1'>

                            <textarea style={{ resize: "none", border: "none" }} id="description" placeholder='Description' rows="4" cols="110"></textarea>
                        </div>
                    </Grid>


                    <div>
                        <button className='file-upload-btn' type="button" onClick={this.uploadHandler}>Submit</button></div>
                    <hr />
                    <h2>{this.state.status}</h2>
                </div>



            </div>
        );
    }
}


export default withRouter(UploadPage)
