
// User Model 

const { Model } = require('objection');

class Post extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'post';
  }
 
  static get relationMappings(){
    //const Posts=require("../models/postModel");
    const User=require("./userModel");
    const Like=require("./likeModel");
    const Comment=require("./commentModel");
    
    return{
     userDetails:{
        relation:Model.HasManyRelation,
        modelClass:User,
        join:{
          from:"post.userId",
          to:"user.userId"
        }
      },

      postLikes:{
        relation:Model.HasManyRelation,
        modelClass:Like,
        join:{
          from:"post.postId",
          to:"like.postId"
        }
      },
      postComments:{
        relation:Model.HasManyRelation,
        modelClass:Comment,
        join:{
          from:"post.postId",
          to:"comment.postId"
        }
      },

    



    }

    

}
}
  
    
  

module.exports = Post;