import React, { Component } from 'react';
import axios from 'axios';

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: '',
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
    document.getElementById("text").setAttribute("data-text", document.getElementById("file").value)
  };
  // method contain logic to upload file
  uploadHandler = (event) => {
    // 1. the FormData object that contains the data to be posted to the 
    // WEB API
    const formData = new FormData();
    formData.append('videoFile', this.state.selectedFile);

    // 2. post the file to the WEB API

    axios.post("http://localhost:31772/api/FileUpload/Upload", formData, {
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
        <h2>The File Upload DEMO</h2>
        <div id='text' className='file-upload-wrapper' data-text="Select your file!">

          <input id='file' className='file-upload-field' type="file" onChange={this.selectFileHandler} />
        </div>
        <hr />
        <div>
          <button className='file-upload-btn' type="button" onClick={this.uploadHandler}>Upload</button></div>
        <hr />
        <div>{this.state.progress}</div>
        <br />
        <div>{this.state.status}</div>
      </div>
    );
  }
}

export default FileUploadComponent;
