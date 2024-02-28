import React, { useRef, useEffect } from 'react';

const WebcamCapture = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        // Access the webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = {
                video: true
            };

            // Request access to the webcam
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                // Assign the stream to the video element's srcObject
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }).catch((error) => {
                console.error("Error accessing the webcam", error);
            });
        }
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline />
        </div>
    );
};

export default WebcamCapture;
