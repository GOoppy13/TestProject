import React, { Component } from 'react';
import './Upload.css';
import Loader from './Loader';

export class Upload extends Component {
  static displayName = Upload.name;

  inputRef;

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = { dragActive: false, files: [], uploading: false, addedRows: null };

    this.handleOnDrag = this.handleOnDrag.bind(this);
    this.handelOnDrop = this.handelOnDrop.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
  }

  handleOnDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      this.setState({ dragActive: true });
    } else if (e.type === "dragleave") {
      this.setState({ dragActive: false });
    }
  }

  handelOnDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragActive: false });
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      this.handleFiles(e.dataTransfer.files);
    }
  }

  handleOnChange(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      this.handleFiles(e.target.files);
    }
  }

  onButtonClick() {
    this.inputRef.current.click();
  }

  handleFiles(files) {
    const _files = [...this.state.files];
    Object.keys(files).forEach(index => (files[index].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || files[index].type == 'application/vnd.ms-excel')
      && _files.push(files[index]))
    this.setState({ files: _files });
  }

  handleUploadClick() {
    const { files } = this.state;
    if (files?.length == 0) {
      return;
    }

    const formData = new FormData();
    files.forEach(f => formData.append(`files`, f));
    
    this.setState({ uploading: true });
    fetch('api/weathers/uploadfiles', { 
      method: 'POST',
      body: formData,
    })
    .then(resp => resp.json())
    .then(data => this.setState({ uploading: false, addedRows: data['rows'], files: [] }))
    .catch(() => this.setState({ uploading: false, addedRows: 0 }));
  }

  render() {
    const { dragActive, files, uploading, addedRows } = this.state;
    return (
      <div>
        <h1 id="tableLabel">Upload data</h1>
        {!uploading ? <>
          <form id="form-file-upload" onDragEnter={this.handleOnDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={this.inputRef} type="file" id="input-file-upload" multiple={true} onChange={this.handleOnChange} 
              accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
              <div>
                <p>Drag and drop your file here or</p>
                <button className="select-button" onClick={this.onButtonClick}>Select a file</button>
              </div> 
            </label>
            { dragActive && <div id="drag-file-element" onDragEnter={this.handleOnDrag} 
              onDragLeave={this.handleOnDrag} onDragOver={this.handleOnDrag} onDrop={this.handelOnDrop}></div> }
          </form>
          <div className='files-box'>
            {files.map((f, index) => {
              return <h5 key={`${f.name}${index}`}>{f.name}</h5>
            })}
          </div>
          <div className='upload-button' onClick={this.handleUploadClick}>Upload</div>
          {addedRows != null && <div>New entries added: {addedRows}</div>}
        </> :
        <Loader/>}
      </div>
    );
  }
}
