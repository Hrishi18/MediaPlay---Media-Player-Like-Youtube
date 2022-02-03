import React, { Component } from 'react';
import axios from 'axios';

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: '',
      selectedThumbnail: '',
      status: '',
      progress: 0
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
    const fileTypes = ['image/jpeg', 'image/png'];

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
    formData.append('Video.VideoId', 1000);
    formData.append('Video.UserId', 100);
    formData.append('Video.CategoryId', 1);
    formData.append('Video.VideoTag', document.getElementById("tags").value);
    formData.append('Video.VideoDescription', document.getElementById("description").value);

    // 2. post the file to the WEB API

    axios.post("http://localhost:31772/api/videos", formData, {
      onUploadProgress: progressEvent => {
        this.setState({
          progress: (progressEvent.loaded / progressEvent.total * 100)
        })
      }
    })
      .then((response) => {
        this.setState({ status: `upload success ${response.data}` });
      })
      .catch((error) => {
        this.setState({ status: `upload failed ${error.errMessage}` });
      })



  }
  render() {
    return (
      <div className='container'>
        <h1 className='title'>Upload</h1>
        <div className='uploadForm'>
          <div className='left'>
            <div id='video' className='file-upload-wrapper' data-text="Select your Video!">
              <input id='videofile' className='file-upload-field' type="file" onChange={this.selectFileHandler} />
            </div>
            <div id='thumbnail' className='file-upload-wrapper' data-text="Select your Image!">
              <input id='thubmnailfile' className='file-upload-field' type="file" onChange={this.selectThumbnailHandler} />
            </div>
            <div className='textbox'  >

              <input id='title' className='' type="text" placeholder='Title' />
            </div>
            <div className='textbox'>
              <input id='tags' className='' type="text" placeholder='Tags' />
            </div>
            <hr />
          </div>
          <div className='right'>

            <div className='textbox1'>
              <input id='description' className='' type="text" placeholder='Description' />
            </div>
            <div>
              <button className='file-upload-btn' type="button" onClick={this.uploadHandler}>Upload</button></div>
            <hr />
          </div>
        </div>


        <div>{this.state.progress}</div>
        <br />
        <div>{this.state.status}</div>
      </div>
    );
  }
}

export default FileUploadComponent;
