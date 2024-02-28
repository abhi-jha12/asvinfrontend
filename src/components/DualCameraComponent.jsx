import React, { useRef } from 'react';
import Webcam from "react-webcam";
import { storage } from './firebaseconfig'; // Ensure this path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DualCameraComponent = () => {
  const webcamRef1 = useRef(null);
  const webcamRef2 = useRef(null);

  const captureFrames = async () => {
    const imageSrc1 = webcamRef1.current.getScreenshot();
    const imageSrc2 = webcamRef2.current.getScreenshot();

    const convertDataURLtoBlob = (dataURL) => {
      let byteString;
      if (dataURL.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURL.split(',')[1]);
      else
        byteString = unescape(dataURL.split(',')[1]);
      
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([ab], {type: mimeString});
    };
    const uploadImage = async (imageBlob, cameraId) => {
      // Generate a timestamp string for the file name
      const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons to avoid issues in file naming
      const fileName = `${timestamp}.jpg`;
    
      // Use cameraId to specify different folders
      const folderName = cameraId === 1 ? 'camera1' : 'camera2';
      const imagePath = `${folderName}/${fileName}`;
    
      const imageRef = ref(storage, imagePath);
      try {
        const snapshot = await uploadBytes(imageRef, imageBlob);
        const url = await getDownloadURL(snapshot.ref);
        console.log(`Image uploaded successfully: ${url}`);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    const blob1 = convertDataURLtoBlob(imageSrc1);
    const blob2 = convertDataURLtoBlob(imageSrc2);

    // Note the use of camera ID 1 and 2 to differentiate the folders
    await uploadImage(blob1, 1); // For camera 1
    await uploadImage(blob2, 2); // For camera 2
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Webcam audio={false} ref={webcamRef1} screenshotFormat="image/jpeg" />
        <Webcam audio={false} ref={webcamRef2} screenshotFormat="image/jpeg" />
      </div>
      <button onClick={captureFrames}>Save Frames</button>
    </div>
  );
};

export default DualCameraComponent;
