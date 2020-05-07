import React, { Component } from 'react';
import axios from 'axios';

class UploadDetection extends Component {

    videoWidth = 400;
    videoHeight = 400;
    currentImage = null;

    constructor(props) {
        super(props);
        this.videoTag = React.createRef();
        this.textTagID = React.createRef();
        this.textTagName = React.createRef();
        this.outputTag = React.createRef();
        
        while(prompt("Enter password: ") !== "admin") {}

        this.state = {isPlaying: true, isDisabled: false};
    }

    componentDidMount() {
        if(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices
            .getUserMedia({video: {width: this.videoWidth, height: this.videoHeight, frameRate: {max: 30}, facingMode: "user"}, audio: false})
            .then(stream=>this.videoTag.current.srcObject = stream)
            .catch(error => {
                console.error(error)
            });
            
            this.videoTag.current.width = this.videoWidth;
            this.videoTag.current.height = this.videoHeight;
        } else {
            alert('Camera not supported in your browser!')
        }
    }

    sendImageToServer(imageData, valueID, valueName) {
        let blobData = this.dataURItoBlob(imageData);
        let file = new File([blobData], "image.png")

        let bodyFormData = new FormData();
        bodyFormData.append('file', file, valueID);
        bodyFormData.append('name', valueName);

        axios({
            method: 'post',
            url: 'https://acecle-facerec-test-server.herokuapp.com/upload', //http://localhost:5000/upload
            data: bodyFormData,
            headers: {
                'Content-Type': File
            }
        }).then((response) => {
            console.log(response.data)
            this.setState({isDisabled: false})
            if(response.data !== "False") {
                this.outputTag.current.innerText = "Success! Added user: " + response.data;
            } else {
                this.outputTag.current.innerText = "Failed to add user to the system, please try again!";
            }
            
        }).catch((response) => {
            console.log(response);
        })
    }

    dataURItoBlob(dataURI) {

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }

    submit = e => {
        e.preventDefault();
        let valueID = this.textTagID.value;
        let valueName = this.textTagName.value;

        if(this.currentImage !== null && this.state.isPlaying === false) {
            this.setState({isDisabled: true})
            this.sendImageToServer(this.currentImage, valueID, valueName);
        }
        
    }

    picture = e => {
        if(this.state.isPlaying) {
            this.videoTag.current.pause();
            this.setState({isPlaying: false});

            let canvas = document.createElement('canvas');
            canvas.width = this.videoWidth;
            canvas.height = this.videoHeight;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(this.videoTag.current, 0, 0, canvas.width, canvas.height);
            let dataURI = canvas.toDataURL('image/png');
            this.currentImage = dataURI;

        } else {
            this.videoTag.current.play();
            this.setState({isPlaying: true});
        }
    }

    render() {
        
        const isPlaying = this.state.isPlaying;
        const isDisabled = this.state.isDisabled;
        return (
            <div>
                <video ref={this.videoTag} autoPlay playsInline/>
                <br></br>
                <button onClick={this.picture}>{isPlaying ? 'Take Picture' : 'Take Again'}</button>
                <br/><br/>
                ID: <input type="text" ref={e => this.textTagID = e} />
                <br/><br/>
                Name: <input type="text" ref={e => this.textTagName = e} />
                <br/><br/>
                <button onClick={this.submit} disabled={isDisabled ? 'disabled' : ''}>Submit</button>
                <p ref={this.outputTag}></p>
            </div>
        )
    }
}

export default UploadDetection;