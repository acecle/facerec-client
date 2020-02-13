import React, { Component } from 'react';
import axios from 'axios';

class UploadDetection extends Component {

    videoWidth = 400;
    videoHeight = 400;

    constructor(props) {
        super(props);
        this.videoTag = React.createRef();
        this.textTag = React.createRef();
        this.outputTag = React.createRef();
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

    sendImageToServer(imageData, value) {
        let blobData = this.dataURItoBlob(imageData);
        let file = new File([blobData], "image.png")

        let bodyFormData = new FormData();
        //let name = new Date().toLocaleString() + ".png";
        bodyFormData.append('file', file, value);

        axios({
            method: 'post',
            url: 'https://acecle-facerec-test-server.herokuapp.com/upload',
            data: bodyFormData,
            headers: {
                'Content-Type': File
            }
        }).then((response) => {
            console.log(response.data)
            this.outputTag.current.innerText = response.data;
        }).catch((response) => {
            console.log(response);
        })
    }

    dataURItoBlob(dataURI) { //https://gist.github.com/poeticninja/0e4352bc80bc34fad6f7

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }

    submit = e => {
        e.preventDefault();
        let value = this.textTag.value;
        console.log(value);

        //get image screen
        //send to server along with name

        let canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(this.videoTag.current, 0, 0, canvas.width, canvas.height);
        let dataURI = canvas.toDataURL('image/png');

        this.sendImageToServer(dataURI, value)
        
    }

    render() {
        return (
            <div>
                <video ref={this.videoTag} autoPlay/>
                <input type="text" ref={e => this.textTag = e} />
                <button onClick={this.submit}>Submit</button>
                <p ref={this.outputTag}>Click submit to send an image</p>
            </div>
        )
    }
}

export default UploadDetection;