import React, { Component } from 'react';
import * as faceapi from 'face-api.js';

class WebcamDetection extends Component {

    intervalID = 0;

    constructor(props) {
        super(props);
        this.videoTag = React.createRef();
        this.textRef = React.createRef();
        this.imageTag = React.createRef();
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
            
            this.videoTag.current.width = 640;
            this.videoTag.current.height = 480;
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
            this.textRef.current.innerText = "found: " + detections.length + " faces";

            if(detections.length > 0) {
                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                const box = resizedDetections[0]._box;

                const regionsToExtract = [
                    new faceapi.Rect(box.left - 50, box.top - 50, box.width + 100, box.height + 100)
                ]
                const canvases = await faceapi.extractFaces(this.videoTag.current, regionsToExtract)
                this.imageTag.current.src = canvases[0].toDataURL();
            }
            
        }, 200)
    }

    render() {
        return (
            <div>
                <video ref={this.videoTag} autoPlay/>
                <p ref={this.textRef}>found: 0 faces</p>
                <img ref={this.imageTag}></img>
            </div>
        )
    }
}

export default WebcamDetection;