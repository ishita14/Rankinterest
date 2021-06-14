
// User Model 

const { Model } = require('objection');

class Category extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'category';
  }
 
  static get relationMappings(){
    
    



    }

    

}

  
    
  

module.exports = Category;