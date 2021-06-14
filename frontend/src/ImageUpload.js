import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import "./ImageUpload.css";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { ToastContainer, toast } from 'react-toastify';
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },

  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },

}));
const notify = () => toast("Image Uploaded");
export default function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setError("");
        setImage(file);
      } else {
        console.log("error");
        setError("error please upload a image file");
      }
    }
  };

  const handleUpload = () => {
    if (image) {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "rankinterest")
      data.append("cloud_name", "mauuu")
      fetch("https://api.cloudinary.com/v1_1/mauuu/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json())
        .then(data => {
          console.log(data.url);
          setUrl(data.url)
          fetch("/insertpost", {
            method: "Post",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              postContent: caption,
              category: category,
              image: data.url
            })
          }).then(res => res.text())
            .then(data => {
              console.log(data);
              notify();
              if (data.error) {

              }
              else {
                console.log('hello');
              }
            }).catch(err => [
              console.log(err)
            ])
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setError("Error please choose an image to upload");
    }
  };

  const classes = useStyles();

  const fileInputRef = React.createRef();


  return (
    <div className="upload">
      <ToastContainer />
      <div className="upload_first">
        {/* <Avatar
          className="post__avatar"
          alt="subhampreet"
          src="./images/avatar1.jpg"
          className={classes.large}
        /> */}
        <input
          type="text"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          className="upload_caption"
        />
        <input
          type="text"
          placeholder="Category of Post"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="upload_caption"
        />
      </div>


      <div className="upload_content">
        <Button
          onClick={() => fileInputRef.current.click()}
          startIcon={<AddAPhotoIcon />}
          className={classes.button}
          color="primary"
          variant="contained"
        >
          Upload Photo
        </Button>
        <input type="file" onChange={handleChange} hidden ref={fileInputRef} />


        <Button variant="contained" onClick={handleUpload} color="secondary" className={classes.button}
        >
          Create Post
        </Button>
      </div>

      <br />

      <p style={{ color: "red" }}>{error}</p>
      {progress > 0 ? <center><progress value={progress} max="100" /></center> : ""}
    </div>
  );
}

// export default ImageUpload;
