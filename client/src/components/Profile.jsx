import { Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
//import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const Profile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploadError(false);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(Math.round(progress));
      },
      (error) => {
        setImageUploadError(true);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFile(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    try {
      dispatch(updateStart());
      const res = await axios.post(`/api/user/update/${currentUser._id}`, formData, config);
      dispatch(updateSuccess(res.data));
      setUpdateUser(true);
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
      console.log(error);
      setUpdateUser(false);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {/* {imageFileUploadingProgress && (
            <CircularProgressbar value={imageFileUploadingProgress || 0}
            text={`${imageFileUploadingProgress}%`}
            strokeWidth={5}
            styles ={{
              root :{
                width : '100%',
                height : '100%',
                position : 'absolute',
                top : 0,
                top : 0,
              },
              path : {
                stroke : `rgba(62, 152, 199, ${imageFileUploadingProgress/100})`,
              }
            }}
            />
          )} */}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile picture"
            className="rounded-full w-full h-full object-cover border-8 border-[gray]"
          />
        </div>
        <div className="text-sm self-center">
          <p>
            {imageUploadError ? (
              <span className="text-red-700">
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imageFileUploadingProgress > 0 &&
              imageFileUploadingProgress < 100 ? (
              <span className="text-slate-700 dark:text-white">{`Uploading: ${imageFileUploadingProgress}`}</span>
            ) : imageFileUploadingProgress === 100 ? (
              <span className="text-green-700">
                Image uploaded successfully
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleInputChange}
        />
        <TextInput
          type="email"
          id="emai"
          defaultValue={currentUser.email}
          onChange={handleInputChange}
        />
        {/* <TextInput
          type="passord"
          id="password"
          placeholder="password"
          onChange={handleInputChange}
        /> */}
        <Button type="submit" gradientDuoTone="greenToBlue" outline>
          Update
        </Button>
        <div className="text-sm self-center"><p className="text-red-700 mt-5">{error &&(<>
          {error}
        </>) }
        </p>
        <p className="text-green-700">{updateUser && 'User was updated successfully!'}</p>
      </div>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
