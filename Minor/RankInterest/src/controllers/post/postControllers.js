const {
  okResponse,
  badRequestError,
  to,
  unverifiedError,
  loginResponse,
} = require("../../../global_functions");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Post = require("../../models/postModel");
const Like = require("../../models/likeModel");
const Comment = require("../../models/commentModel");
const util = require('util');
var cloudinary = require('cloudinary').v2;

cloudinary.config({

  cloud_name: 'nishicloud',
  api_key: '792541339391969',
  api_secret: 'ZNY1ZEg2UCzRVwf07v3MYbFK6ZY'
});


const InsertPost = async (req, res) => {
  console.log("body data" + req.body);
  let { postContent, category, image } = req.body;
  let { userId } = req.user;
  console.log("userId   " + userId);

  let postImage =
    "https://res.cloudinary.com/hmwv9zdrw/image/upload/v1600970783/user_vopbzk.png";

  // console.log("postContent "+req.body.postContent);

  // console.log("req.files"+req.files);
  // let picture= req.files.picture;
  // console.log("picture "+picture);

  // if (picture==null) {
  //   console.log("no file found");
  //   return badRequestError(res, "Upload an Image");
  // } 

  // let imageurl= await cloudinary.uploader.upload(picture.path, function(error, result) 
  // {
  //     console.log(result.url);


  // });


  let [Posterror, post_inserted] = await to(
    Post.query()
      .insert({ userId: userId, postContent: postContent, category: category, image: image })
      .returning("*")
  );
  if (Posterror) badRequestError(res, Posterror, "unable to insert post");


  else {
    console.log("post's detail ", post_inserted.postId + " Category details" + post_inserted);

    return okResponse(res, { postDetails: post_inserted }, "post inserted successfully");
  }
};

const InsertLike = async (req, res) => {
  console.log("body data" + req.body);
  let postId = req.params.id;
  let { userId } = req.user;
  console.log("userId   " + userId);



  let [Likerror, like_inserted] = await to(
    Like.query()
      .insert({ userId: userId, postId: postId, isLike: true })
      .returning("*")
  );
  if (Likerror) badRequestError(res, Likerror, "unable to insert like");


  else {
    console.log("like's detail ", like_inserted.postId + " Category details" + like_inserted);

    return okResponse(res, { likeDetails: like_inserted }, "like inserted successfully");
  }
};

const InsertComment = async (req, res) => {
  console.log("body data" + req.body);
  // let { postId, commentText } = req.body;
  const postId = req.params.id
  const commentText = req.params.text
  let { userId } = req.user;
  console.log("userId   " + userId);
  console.log("hellllooooooo" + postId, commentText)


  let [Commenterror, comment_inserted] = await to(
    Comment.query()
      .insert({ userId: userId, postId: postId, commentText: commentText })
      .returning("*")
  );
  if (Commenterror) {
    console.log("Commenterror  " + Commenterror);

    badRequestError(res, Commenterror, "unable to insert comment");

  }
  else {
    console.log("comment's detail ", comment_inserted.commentId + " comment details" + comment_inserted.commentText);

    return okResponse(res, { commentDetails: comment_inserted }, "comment inserted successfully");
  }
};

const SearchUser = async (req, res) => {
  let { name } = req.body;

  var array = new Array();

  let [cat_postfetchingerror, posts_fetched] = await to(

    User.query()
      .select('fullName', 'userId', 'image', 'userName')

  );
  if (cat_postfetchingerror) badRequestError(res, cat_postfetchingerror, "unable to fetch post");


  else {
    console.log("user  detail ", posts_fetched);
    var length = name.length;
    console.log("length of name ", length);

    for (let item of posts_fetched) {
      var result = item.fullName.substring(0, length)
      console.log(" outside    " + result + " " + name);

      if (result.toUpperCase() === name.toUpperCase()) {
        console.log(result + " " + name);
        array.push(item);

      }

    }
    return okResponse(res, array, "user posts detail ");
  }
};



const profilePosts = async (req, res) => {
  //  console.log("body data"+req.body);
  //let { postId,isLike } = req.body;
  let { userId } = req.user;
  console.log("userId   " + userId);



  let [postfetchingerror, posts_fetched] = await to(
    User.query().select('userName', 'fullName', 'image').where('userId', userId)
      .withGraphFetched('post(recentPost).[postLikes(Likes) as like, postComments(selectCommentText).commentUser(selectName)]')
      .modifiers({
        recentPost(builder) {
          builder.orderBy('created_at')

        }
      })

      .modifiers({
        Likes(builder) {
          builder.groupBy('postId').count('isLike')

        }
      })
      .modifiers({
        selectCommentText(builder) {
          builder.select('commentText');
        }
      })
      .modifiers({
        selectName(builder) {
          builder.select('userName', "created_at");
        }
      })


  );
  if (postfetchingerror) badRequestError(res, postfetchingerror, "unable to fetch post");


  else {
    console.log("user posts detail ", posts_fetched);

    return okResponse(res, { profilePosts: posts_fetched }, "user posts detail ");
  }
};

const CategoryPosts = async (req, res) => {
  console.log(req.params.id);
  let category = req.params.id;
  console.log(category)
  let { userId } = req.user;
  console.log("userId   " + userId);

  let [cat_postfetchingerror, posts_fetched] = await to(

    Post.query()
      .select('postContent', 'postId', 'image')
      .where('category', category)
      .withGraphFetched('[postLikes(Likes) as like, postComments(selectCommentText).commentUser(selectName)]')

      .modifiers({
        Likes(builder) {
          builder.groupBy('postId').count('isLike')

        }
      })
      .modifiers({
        selectCommentText(builder) {
          builder.select('commentText');
        }
      })
      .modifiers({
        selectName(builder) {
          builder.select('userName', "created_at");
        }
      })


  );
  if (cat_postfetchingerror) badRequestError(res, cat_postfetchingerror, "unable to fetch post");


  else {
    console.log("user posts detail ", posts_fetched);
    var result = posts_fetched.filter(item => {
      if (item.like.length >= 1) return item;
    })

    var result1 = result.sort((a, b) => { return b.like[0].count - a.like[0].count })

    var result2 = posts_fetched.filter(item => {
      if (item.like.length < 1) return item;
    })
    var final = result1.concat(result2);
    return okResponse(res, { categoryPosts: final }, "user posts detail ");
  }
};

const AllPosts = async (req, res) => {
  //  console.log("body data"+req.body);
  let { category } = req.body;
  // let {userId}= req.user;
  // console.log("userId   "+userId);



  let [cat_postfetchingerror, posts_fetched] = await to(

    Post.query()
      .select('postContent', 'postId', 'image')
      //.where('category', category)
      .withGraphFetched('[postLikes(Likes) as like, postComments(selectCommentText).commentUser(selectName)]')

      .modifiers({
        Likes(builder) {
          builder.groupBy('postId').count('isLike')

        }
      })
      .modifiers({
        selectCommentText(builder) {
          builder.select('commentText');
        }
      })
      .modifiers({
        selectName(builder) {
          builder.select('userName', "created_at");
        }
      })


  );
  if (cat_postfetchingerror) badRequestError(res, cat_postfetchingerror, "unable to fetch post");


  else {
    console.log("user posts detail ", posts_fetched);
    var result = posts_fetched.filter(item => {
      if (item.like.length >= 1) return item;
    })

    var result1 = result.sort((a, b) => { return b.like[0].count - a.like[0].count })

    var result2 = posts_fetched.filter(item => {
      if (item.like.length < 1) return item;
    })
    var final = result1.concat(result2);
    return okResponse(res, { categoryPosts: final }, "user posts detail ");
  }
};

const AddCategory = async (req, res) => {
  console.log("body data" + req.body);
  const category = req.params.id;
  // const image = req.body.image
  let { userId } = req.user;
  console.log(`${util.inspect(req.body, false, null)}`);
  console.log(category)


  let [errorCat, cat_inserted] = await to(
    Category.query()
      .insert({ userId: userId, category: category })
      .returning("*")
  );
  if (errorCat) badRequestError(res, errorCat, "unable to add category");

  else {
    console.log(" Category details" + cat_inserted);

    return okResponse(res, { categories: cat_inserted }, "category added successfully");
  }
};

const UserCategories = async (req, res) => {
  let { userId } = req.user;
  console.log("userId   " + userId);



  let [cat_postfetchingerror, posts_fetched] = await to(
    Category.query()
      .where('userId', userId)


  );
  if (cat_postfetchingerror) badRequestError(res, cat_postfetchingerror, "unable to fetch post");


  else {
    console.log("user posts detail ", posts_fetched);
    return okResponse(res, { UserCategories: posts_fetched }, "user posts detail ");
  }
};


// const uploadImage = async (req, res) => {
//   let picUrl = req.file;
//   let id = req.user.id;
//   //  var imageurl;
//   if (picUrl == undefined) {
//     //return res.send(`You must select a file.`); 
//     console.log("no file found");
//     return badRequestError(res, "Upload an Image");

//   }

//   let imageurl = await cloudinary.uploader.upload(picUrl.path, function (error, result) {
//     console.log(result.url);


//   });
//   console.log("image details" + JSON.stringify(imageurl));
//   console.log("imageurl URL" + imageurl.url);
//   //  const URL="http://res.cloudinary.com/nishicloud/image/upload/v1609014137/y38hjkrzdoydazw0lm1x.jpg"
//   const [error, imageUpload] = await to(
//     Users.query().update({ image: imageurl.url }).where("id", id)
//       .returning("*")

//   )
//   console.log(imageUpload);


//   console.log("ERROR IS " + JSON.stringify(error));
//   if (error) { return badRequestError(res, "Error while Uploading "); }
//   else {
//     return okResponse(res, imageUpload, "Succesfully image uploaded");

//   }
// }

module.exports = {
  InsertPost,
  InsertLike,
  InsertComment,
  profilePosts,
  CategoryPosts,
  AddCategory,
  UserCategories,
  AllPosts,
  SearchUser

}
