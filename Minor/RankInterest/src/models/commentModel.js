const { Model } = require('objection');

class Comment extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'comment';
  }
 
  static get relationMappings(){
    const Post=require("./postModel");
    const User=require("./userModel");

    return{
      commentUser:{
         relation:Model.BelongsToOneRelation,
         modelClass:User,
         join:{
           from:"comment.userId",
           to:"user.userId"
         }
       },
      } 
    
    

}
}
  
    
  

module.exports = Comment;