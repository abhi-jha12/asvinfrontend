import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { storage } from './firebaseconfig'; // Make sure this path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DualCameraComponent = () => {
  const webcamRef1 = useRef(null);
  const webcamRef2 = useRef(null);
  const [videoConstraints1, setVideoConstraints1] = useState({});
  const [videoConstraints2, setVideoConstraints2] = useState({});
  const [camera1Available, setCamera1Available] = useState(false);
  const [camera2Available, setCamera2Available] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length >= 1) {
          setCamera1Available(true);
          setVideoConstraints1({ deviceId: { exact: videoDevices[0].deviceId } });
          if (videoDevices.length >= 2) {
            setCamera2Available(true);
            setVideoConstraints2({ deviceId: { exact: videoDevices[1].deviceId } });
          } else {
            setCamera2Available(false);
          }
        } else {
          setCamera1Available(false);
          setCamera2Available(false);
        }
      } catch (error) {
        console.error('Error enumerating devices:', error);
        setCamera1Available(false);
        setCamera2Available(false);
      }
    };

    getDevices();
  }, []);

  const captureFrames = async () => {
    const imageSrc1 = webcamRef1.current.getScreenshot();
    const imageSrc2 = webcamRef2.current.getScreenshot();
  
    // Existing function unchanged
    const convertDataURLtoBlob = (dataURL) => {
      let byteString;
      if (dataURL.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURL.split(',')[1]);
      } else {
        byteString = unescape(dataURL.split(',')[1]);
      }
  
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
  
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
  
      return new Blob([ab], { type: mimeString });
    };
  
    // Function to rotate image blob
    const rotateImage = async (imageBlob) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;
          // Rotate the image
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(Math.PI); // 180 degrees
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          // Convert canvas to blob
          canvas.toBlob(resolve, 'image/jpeg');
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(imageBlob);
      });
    };
  
    const blob1 = convertDataURLtoBlob(imageSrc1);
    const blob2 = await rotateImage(convertDataURLtoBlob(imageSrc2)); // Rotate image from camera 2
  
    await uploadImage(blob1, 1); // For camera 1
    await uploadImage(blob2, 2); // Upload rotated image for camera 2
  };
  

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {camera1Available ? (
          <Webcam
            audio={false}
            ref={webcamRef1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints1}
          />
        ) : (
          <div>No Camera 1 Detected</div>
        )}
        {camera2Available ? (
          <Webcam
            audio={false}
            ref={webcamRef2}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints2}
            style={{ transform: 'rotate(180deg)' }} // Apply rotation here
          />
        ) : (
          <div>No Camera 2 Detected</div>
        )}
      </div>
      <button onClick={captureFrames} disabled={!camera1Available && !camera2Available}>Save Frames</button>
    </div>
  );
};

export default DualCameraComponent;
