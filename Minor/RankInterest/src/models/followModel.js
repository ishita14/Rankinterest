
// User Model 

const { Model } = require('objection');

class Follow extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'follow';
  }
 
  static get relationMappings(){
    
    const User=require("./userModel");
    
return{
    
    followersName:{
    relation:Model.BelongsToOneRelation,
    modelClass:User,
    join:{
      from:"follow.userId",
      to:"user.userId"
    }
  },
  followingsName:{
    relation:Model.BelongsToOneRelation,
    modelClass:User,
    join:{
      from:"follow.followerId",
      to:"user.userId"
    }
  },



}



    }

    

}

  
    
  

module.exports = Follow;