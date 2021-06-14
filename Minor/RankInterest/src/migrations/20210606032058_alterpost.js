exports.up = function(knex) {
    return knex.schema.alterTable("post",function(table){
        table.string("image");
        //.defaultTo("https://www.securityindustry.org/wp-content/uploads/sites/3/2018/05/noimage.png");
        
    })
  };
  
  exports.down = function(knex) {
    
  };