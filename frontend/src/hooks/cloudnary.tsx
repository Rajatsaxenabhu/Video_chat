import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
// Importing Font Awesome icons (for modern UI design)
import { FaUpload } from "react-icons/fa";
import { setUserImage } from "../redux/slice/authslice";

// Define the UploadApp component and accept the user_id prop
interface UploadAppProps {
  user_id: string;
}

const UploadApp: React.FC<UploadAppProps> = ({ user_id }) => {
  const [img, setImg] = useState<File | null>(null);
  const disp=useDispatch();

  // Function to handle image upload
  const submitImage = async () => {
    if (!img) {
      alert("Please select an image first.");
      return;
    }

    // Create FormData to send the image
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "chatupload");
    data.append("cloud_name", "nony12ka4");

    try {
      // Upload to Cloudinary
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/nony12ka4/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      // Post the image URL and user_id to your server
      const uploadResponse = await axios.post('http://localhost:8000/auth/images', {
        images: result.url,
        id: user_id,
      });

      if (uploadResponse.status === 200) {
        console.log(result.url);
        disp(setUserImage({user_image:result.url}));
        
        alert("Image uploaded successfully!");
      } else {
        alert("Error uploading image to the server.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-menu">
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            style={{ display: "none" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setImg(e.target.files ? e.target.files[0] : null)
            }
          />
          <label htmlFor="image-upload" className="upload-button">
            <FaUpload size={24} />
          </label>
          <button
            className="upload-button ml-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={submitImage}
          >
            Upload
          </button>
        </div>
      </nav>
    </div>
  );
};

export default UploadApp;
