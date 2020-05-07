import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

class WebcamDetection extends Component {

    intervalID = 0;
    videoWidth = 400;
    videoHeight = 400;
    
    //TESTS
    //code = 0;

    constructor(props) {
        super(props);
        this.roomTag = React.createRef();
        this.videoTag = React.createRef();
        this.textRef = React.createRef();
        this.imageTag = React.createRef();
        this.faceTextRef = React.createRef();

        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        Promise.all(
            [
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL) //faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
            ]
        ).then(this.printLoaded())
    }

    printLoaded() {
        //load loading icon on start
        //remove loading icon
    }

    componentDidMount() {
        //TESTS
        // let variable = prompt("Enter your code: ");
        // this.code = variable;

        if(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices
            .getUserMedia({video: {width: this.videoWidth, height: this.videoHeight, frameRate: {max: 30}, facingMode: "user"}, audio: false})
            .then(stream=>this.videoTag.current.srcObject = stream)
            .catch(error => {
                console.error(error)
            });
            
            this.videoTag.current.width = this.videoWidth;
            this.videoTag.current.height = this.videoHeight;
            this.videoTag.current.addEventListener('play', this)
        } else {
            alert('Camera not supported in your browser!')
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    handleEvent(e) {
        const displaySize = {width: this.videoTag.current.width, height: this.videoTag.current.height};
        this.intervalID = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(this.videoTag.current, new faceapi.TinyFaceDetectorOptions()); //faceapi.SsdMobilenetv1Options()
            
            try {
                this.textRef.current.innerText = "Found: " + detections.length;
            } catch (error) {
                //TODO FIX THIS
            }

            if(detections.length > 0) {
                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                const box = resizedDetections[0]._box;

                const regionsToExtract = [
                    new faceapi.Rect(box.left - 50, box.top - 50, box.width + 100, box.height + 100)
                ]
                const canvases = await faceapi.extractFaces(this.videoTag.current, regionsToExtract)
                let imageData = canvases[0].toDataURL();
                this.imageTag.current.src = imageData;

                this.sendImageToServer(imageData);
            }
        }, 500)
    }

    sendImageToServer(imageData) {
        let blobData = this.dataURItoBlob(imageData);
        let file = new File([blobData], "image.png")

        let bodyFormData = new FormData();
        let name = new Date().toLocaleString() + ".png";
        let room = this.roomTag.value;
        bodyFormData.append('file', file, name);
        bodyFormData.append('room', room);

        axios({
            method: 'post',
            url: 'https://acecle-facerec-test-server.herokuapp.com/', //http://localhost:5000
            data: bodyFormData,
            headers: {
                'Content-Type': File
            }
        }).then((response) => {
            if(this.code == response.data) {
                this.faceTextRef.current.innerText = "Found " + response.data + ", Face Recognised!";
            } else {
                this.faceTextRef.current.innerText = "Found " + response.data + "";
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

    render() {
        return (
            <div>
                Room: <input type="text" ref={e => this.roomTag = e} />
                <br/><br/>
                <video ref={this.videoTag} autoPlay playsInline/>
                <p ref={this.textRef}>Found: 0</p>
                <img ref={this.imageTag} alt="face" hidden></img>
                <p ref={this.faceTextRef}>Unknown Face</p>
            </div>
        )
    }
}

export default WebcamDetection;