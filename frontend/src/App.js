import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
// import Story from "./Story";
// import SearchIcon from "@material-ui/icons/Search";
import "./Story.css";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import M from 'materialize-css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstaEmbed from "./InstaEmbed";
import Suggested from "./Suggested";
import Profile from './Profile'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { Avatar } from "@material-ui/core";
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import CategoryIcon from '@material-ui/icons/Category';
import Category from './Category'
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 280,
    height: 360,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    storyroot: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },

    large: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  const [userName, setUsername] = useState("");
  const [fullName, setfullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState('Home')
  const [categorydata, setCategoryData] = useState([])

  useEffect(() => {


    fetch('/allposts', {

      // headers: {
      //   "Authorization": "Bearer " + localStorage.getItem("jwt")
      // }
    }).then(res => res.json())
      .then(result => {

        setPosts(result.data.categoryPosts)
        console.log(result)
      })
    if (localStorage.getItem('jwt')) {
      fetch('/usercategories', {

        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
      }).then(res => res.json())
        .then(result => {
          // console.log(result.data.UserCategories);
          // setCategoryData(result.data.UserCategories)


        })
    }




  }, []
  );


  const renderpost = (value) => {
    console.log(value);
    fetch(`/categoryposts/${value}`, {
      method: "Post",
      headers: {
        "authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setPosts(result.data.categoryPosts)

      }).catch(err => {
        console.log(err);
      })

    console.log(value);
  }

  const signUp = (event) => {
    event.preventDefault();
    fetch("/signup", {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName,
        fullName,
        email,
        password,

      })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {


          notify();
          // history.push('/signin')
        }
      }).catch(err => [
        console.log(err)
      ])

  };
  const notify = () => toast("Wow so easy!");
  const signIn = (event) => {
    event.preventDefault();
    fetch("/login", {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {
          localStorage.setItem("jwt", data.data.token)
          localStorage.setItem("user", JSON.stringify(data.data.user.userId))
          localStorage.setItem("userName", JSON.stringify(data.data.user.userName))
          notify();
          // history.push('/')
        }
      }).catch(err => {
        console.log(err)
      })

  };
  const renderHome = () => {
    return (
      <div>
        <Suggested />
        {categorydata ? <div className="story">
          {
            categorydata.map((cat) => {
              const a = cat.category?.charAt(0);
              return (<div className="story__item">
                <Avatar
                  className="avatar"
                  alt="subhampreet"
                  src={cat.catImage}
                  className={classes.large}
                  onClick={() => {

                    renderpost(cat.category)
                  }}
                >{a}</Avatar>
                <h6>{cat.category}</h6>
              </div>)

            })
          }
        </div> :
          <div className="story">
            {
              <div className="story__item">
                <Avatar
                  className="avatar"
                  alt="subhampreet"
                  src='all'
                  className={classes.large}

                />
                <h6>all</h6>
              </div>


            }
          </div>
        }




        {/* ------------------------------------------------------------------------------ */}
        {localStorage.getItem('user') ? (
          <ImageUpload username={localStorage.getItem('user')} />
        ) : (
          <div className="upload_message" >
            <h3>Login to Create a Post 🚀 !!! </h3>
            <p><b>Welcome to RankInterest!</b> To Create a new Post, the user has to sign up for the apllication first using any mail ID (Works with an Invalid Mail ID too). For example : "xyz@gmail.com". User can Sign-In using the same credentials again and again. <br /><br />
              <b>For Creating a Post</b> you need to sign-in first. Then click the "UPLOAD PHOTO" Button. Select a Photo from your device, add a suitable caption to the Post, and then click "CREATE POST" Button. Wait till the photo gets uploaded. And then BOOM!!! Your Post has been created(Scroll a bit if you don't find your post at the top).
              <br /><br />
              <b>Hope you have a Great time exploring the Application 💖 !!!</b>
            </p>
            <Button onClick={() => setOpenSignIn(true)} className="upload_signInButton" color="secondary" variant="contained" >Sign In</Button>

          </div>

        )}


        {
          // console.log(posts),
          posts.map((post) => (
            <Post
              // key={id}
              postId={post.postId}
              // username={post.fullName}
              caption={post.postContent}
              imageUrl={post.image}
              avatar={post.avatar}
              // user={post.}
              comments={post.postComments}
              like={post.like}
            />
          ))}


      </div>

    )
  }

  return (
    <div className="App">
      <ToastContainer />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              {/* <img
                className="modal__headerImage"
                src="/images/logo.png"
                alt="instagram"
              /> */}
              <h2 className="modal__headerImage">RankInterest</h2>
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              className="signup_input"
            />
            <Input
              type="text"
              placeholder="FullName"
              value={fullName}
              onChange={(e) => setfullname(e.target.value)}
              className="signup_input"
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup_input"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup_input"
            />



            <Button type="submit" onClick={signUp} variant="contained" color="secondary">
              Sign Up
            </Button>

            <div className="signInLabel">
              {/* <img
                className="modal__headerImage"
                src="https://i.pinimg.com/originals/8a/77/05/8a770507298d728a1e3e039a0507dd8e.png"
                alt="instagram"
                className="signInLabelImg"
              />
              <p className="signInLabelText">Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error ut perspiciatis unde omnis iste natus error </p> */}
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              {/* <img
                className="modal__headerImage"
                src="/images/logo.png"
                alt="instagram"
              /> */}
              <h2 className="modal__headerImage">RankInterest</h2>

            </center>

            <Input
              type="text"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup_input"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup_input"
            />

            <Button type="submit" onClick={signIn} variant="contained" color="secondary">
              Sign In
            </Button>

            <div className="signInLabel">
              {/* <img
                className="modal__headerImage"
                src="https://i.pinimg.com/originals/8a/77/05/8a770507298d728a1e3e039a0507dd8e.png"
                alt="instagram"
                className="signInLabelImg"
              />
              <p className="signInLabelText">Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error ut perspiciatis unde omnis iste natus error </p> */}
            </div>


          </form>

        </div>
      </Modal>

      <div className="app__header">
        {/* <img
          className="app__headerImage"
          src="/images/logo.png"
          alt="instagram"
        /> */}
        <h1 className="app__headerImage">RankInterest</h1>

        <div className="searchForm">
          <form>
            {/* <SearchIcon className="searchIcon" fontSize="small" />
            <input type="text" id="filter" placeholder="Search" className="searchBarInput" /> */}
          </form>
        </div>

        <div className="header_icons">
          <HomeOutlinedIcon fontSize="large" onClick={() => setState('Home')} className="header_icon" />
          <PersonOutlinedIcon fontSize="large" onClick={() => setState('Profile')} className="header_icon" />
          <CategoryIcon fontSize="large" onClick={() => setState('Category')} className="header_icon" />
        </div>

        <div className="signupButton" >
          {localStorage.getItem('user') ? (
            <Button onClick={() => localStorage.clear()}
              variant="contained" color="secondary" className="signOutButton">Logout</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)} className="signInButton">Sign In</Button>
              <Button onClick={() => setOpen(true)} variant="contained" color="secondary">Sign Up</Button>
            </div>
          )}
        </div>

      </div>


      {/* {state === 'Profile' ? <Profile /> : renderHome()} */}
      {state === 'Category' ? <Category /> : state === 'Profile' ? <Profile /> : renderHome()}
      {/* <InstaEmbed /> */}



    </div>
  );
}

export default App;
