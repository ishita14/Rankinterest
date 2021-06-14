
exports.up = function(knex) {
    return knex.schema.createTable("user",function(table){
        table.uuid("userId").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.string("fullName");

        table.string("userName")
        //.primary();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        //table.string("categoryId").references("userId").inTable("user").onDelete("CASCADE");
        table.string("image").defaultTo("https://www.securityindustry.org/wp-content/uploads/sites/3/2018/05/noimage.png");
         
        table.timestamps(false, true);
    })
    .createTable("category",function(table){
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.string("category");
        //table.uuid("categoryId").defaultTo(knex.raw("uuid_generate_v4()")).primary();
         
        table.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("user");
};
