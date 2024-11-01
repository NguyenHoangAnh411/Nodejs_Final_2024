import React, { useState } from 'react';
import { storage } from './firebaseService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const imageRef = ref(storage, `images/${image.name}`);
    try {
      await uploadBytes(imageRef, image);
      const downloadUrl = await getDownloadURL(imageRef);
      setUrl(downloadUrl);
      alert('Uploaded successfully!');
    } catch (error) {
      alert('An error has occurred: ' + error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {url && <img src={url} alt="Uploaded" style={{ width: '100px', height: '100px' }} />}
    </div>
  );
}

export default ImageUpload;
