
// User Model 

const { Model } = require('objection');

class User extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'user';
  }
 
  static get relationMappings(){
    const Post=require("./postModel");
    const Category=require("./categoryModel");
    const Follow=require("./followModel");
    
    return{
     post:{
        relation:Model.HasManyRelation,
        modelClass:Post,
        join:{
          from:"user.userId",
          to:"post.userId"
        }
      },

      allCategory:{
        relation:Model.HasManyRelation,
        modelClass:Category,
        join:{
          from:"user.userId",
          to:"user.userId"
        }
      },

      Following:{
        relation:Model.HasManyRelation,
        modelClass:Follow,
        join:{
          from:"user.userId",
          to:"follow.userId"
        }
      },
      Follower:{
        relation:Model.hasManyRelation,
        modelClass:Follow,
        join:{
          from:"user.userId",
          to:"follow.followingId"
        }
      },


    }

    

}
}
  
    
  

module.exports = User;