import React, { Component } from 'react';
import * as faceapi from 'face-api.js';

class WebcamDetection extends Component {

    intervalID = 0;

    constructor(props) {
        super(props);
        this.videoTag = React.createRef();
        this.textRef = React.createRef();
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        Promise.all(
            [
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL) //faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
            ]
        ).then(this.printLoaded())
    }

    printLoaded() {
        console.log("Loaded")
    }

    componentDidMount() {
        if(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices
            .getUserMedia({video: {frameRate: {max: 30}}, audio: false})
            .then(stream=>this.videoTag.current.srcObject = stream)
            .catch(error => {
                console.error(error)
            });
            
            //this.videoTag.current.width = 800;
            //this.videoTag.current.height = 600;
            this.videoTag.current.addEventListener('play', this)
        } else {
            alert('Camera not supported in your browser!')
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    handleEvent(e) {
        //const displaySize = {width: this.videoTag.current.width, height: this.videoTag.current.height};
        this.intervalID = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(this.videoTag.current, new faceapi.TinyFaceDetectorOptions()); //faceapi.SsdMobilenetv1Options()
            this.textRef.current.innerText = "found: " + detections.length + " faces";
            //const resizedDetections = faceapi.resizeResults(detections, displaySize);
        }, 1000)
    }

    render() {
        return (
            <div>
                <video ref={this.videoTag} autoPlay/>
                <p ref={this.textRef}>found: 0 faces</p>
            </div>
        )
    }
}

export default WebcamDetection;