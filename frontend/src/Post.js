import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import "./Post.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import NearMeOutlinedIcon from "@material-ui/icons/NearMeOutlined";


import TurnedInNotOutlinedIcon from "@material-ui/icons/TurnedInNotOutlined";

import Button from "@material-ui/core/Button";

import firebase from "firebase";

function Post({ username, caption, imageUrl, postId, user, comments, like }) {
  // const [comments, setComments] = useState(commentss)
  // const [comment, setComment] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {

  });
  const likes = () => {
    fetch(`/insertlike/${postId}`, {
      method: "Post",
      headers: {
        "authorization": "Bearer " + localStorage.getItem("jwt")
      },
    }).then(res => res.json())
      .then(result => {
        // setPosts(result.data.categoryPosts)
        // alert(result.code)
      }).catch(err => {
        console.log(err);
      })


  }
  const postComment = (id, comment) => {
    // alert(postId);
    fetch(`/insertcomment/${postId}/${comment}`, {
      method: "Post",
      headers: {
        "authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        commentText: comment

      })
    })
      .then(res => res.json())
      .then(result => {
        // setPosts(result.data.categoryPosts)
        // alert(result.code)
      }).catch(err => {
        console.log(err);
      })

  };

  const avatars = [
    {
      ava:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      ava:
        "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      ava:
        "https://meetanentrepreneur.lu/wp-content/uploads/2019/08/profil-linkedin.jpg",
    },
    {
      ava:
        "https://i.pinimg.com/originals/76/80/4f/76804f67ba38f85e4802d250e5b15504.jpg",
    },
    {
      ava:
        "https://i.pinimg.com/originals/34/f2/50/34f250635ed02218356595ea6d730518.jpg",
    },
  ];

  const [avatar, setAvatar] = useState(0);

  const randomAvatar = (e) => {
    const len = avatars.length;
    setAvatar(Math.floor(Math.random() * len));
  };

  return (
    <div className="post">
      {/* header => avatar + username */}
      <div className="post__header">
        {/* <Avatar
          className="post__avatar"
          alt="subhampreet"
          src={avatars[avatar].ava}
        /> */}

        <h3>{username}</h3>
        <div className="MoreHorizIcon">
          <MoreHorizIcon />
        </div>
      </div>

      {/* Image */}
      <img className="post__image" src={imageUrl} />

      {/* POST ICONS */}

      <div className="likeShare">
        <FavoriteBorderIcon onClick={() => { likes() }} className="likeShare-item" fontSize="medium" /><h1>{like[0]?.count}</h1>
        {/* <ModeCommentOutlinedIcon className="likeShare-item" fontSize="medium" />
        <NearMeOutlinedIcon className="likeShare-item" fontSize="medium" />
        <TurnedInNotOutlinedIcon
          className="likeShare-item-save"
          fontSize="medium"
        /> */}
      </div>

      {/* username + caption */}
      <h5 className="post__text">
        {" "}
        <strong>{username} </strong>
        {caption}
      </h5>

      {/* COMMENTS */}

      <div className="post_comments">
        {comments.map((comment) => (
          <h5 className="comment">
            <strong>{comment.commentUser.userName}</strong> {comment.commentText}
          </h5>
        ))}
      </div>

      {/* POST CAPTIONS */}

      {(
        <form className="postComment_Box">
          <input
            className="comment_input"
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            color="secondary"
            className="comment_button"
            disabled={!text}
            type="submit"
            onClick={() => { postComment(postId, text) }}
          >
            Post
          </Button>
        </form>
      )}
    </div>
  );
}

export default Post;
