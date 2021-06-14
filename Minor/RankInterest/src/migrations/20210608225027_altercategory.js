exports.up = function(knex) {
    return knex.schema.alterTable("category",function(table){
        table.string("catImage");
        //.defaultTo("https://www.securityindustry.org/wp-content/uploads/sites/3/2018/05/noimage.png");
        
    })
  };
  
  exports.down = function(knex) {
    
  };