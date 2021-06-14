import React, { useState, useEffect } from 'react'
import './Profile.css'
// import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from "@material-ui/core/styles";
// import { Grid, Image } from 'semantic-ui-react'
import Greed from './greed'
// import { PowerOffOutlined } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles((theme) => ({

    media: {
        height: '55px',
        // maxHeight: '300px',
        paddingTop: '56.25%', // 16:9
    }
}));


function Profile() {
    const [profile, setProfile] = useState([])
    const [image, setImage] = useState("")

    useEffect(() => {
        fetch('/profileposts', {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result.data);
                setProfile(result.data.profilePosts[0])
                setImage(result.data.profilePosts[0].image)


            })



    }, [])


    const uploadImage = (image) => {
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

                    console.log(data)
                    // localStorage.setItem("user", JSON.stringify({ ...state, pic: data.url }))
                    // dispatch({ type: "UPDATEPIC", payload: data.url })
                    fetch('/uploadimage', {
                        method: "Post",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            image: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result)
                            // localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            // dispatch({ type: "UPDATEPIC", payload: result.pic })
                            // window.location.reload()
                        })

                })
                .catch(err => {
                    console.log(err)
                })

        }

    }



    const classes = useStyles();
    return (
        <div>
            <div style={{ marginLeft: '10%' }}>
                <main class="profile">
                    <div class="profile-bg"></div>
                    <section class="container">
                        <aside class="profile-image">
                            {/* <a class="camera" href="">
                                <i class="fas fa-camera"></i>
                            </a> */}
                            <img style={{}} alt={<i class="fas fa-camera"></i>} src={image}></img>
                        </aside>
                        <section class="profile-info">
                            <h1 class="first-name">{profile.fullName}</h1>
                            <h1 class="second-name">Yadav</h1>
                            <h2>ABOUT</h2>
                            <p>
                                {/* hello hello, I'm angela, artist and developer 🌼 student at stanford; intern at zynga 🌱 happy to be here! 🌿 let's code the best we can! */}
                            </p>
                            {/* <Button variant="contained" color="secondary">
                                <span>Upload Pic</span>
                                <input
                                    // style={{ display: 'none' }}
                                    type="file"
                                    onChange={(e) => uploadImage(e.target.files[0])}
                                />
                            </Button> */}
                        </section>
                    </section>
                    <section class="statistics">
                        <button class="icon arrow left"></button>
                        <button class="icon arrow right"></button>

                        <p><strong>{profile.post?.length}</strong> Posts</p>
                    </section>
                    <button class="icon close"></button>
                </main>
            </div >
            <div>
                <Greed post={profile.post} />
            </div>
        </div>)
}


export default Profile
