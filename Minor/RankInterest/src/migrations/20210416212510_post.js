
exports.up = function(knex) {
    return knex.schema.createTable("post",function(table){
        table.uuid("postId").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.text("postContent");
        table.string("category");

        table.timestamps(false, true);

    }).createTable("like",function(table){
        table.uuid("postId").references("postId").inTable("post").onDelete("CASCADE");
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.boolean("isLike").defaultTo(false);
       // table.string('userName').references('userName').inTable('user').onDelete("CASCADE");

        table.timestamps(false,true);
    }).createTable("comment",function(table){
        table.uuid("commentId").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.uuid("postId").references("postId").inTable("post").onDelete("CASCADE");
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.text("commentText");
        //table.string('userName').references('userName').inTable('user').onDelete("CASCADE");

        table.timestamps(false,true);
    }).createTable("reply",function(table){
        table.uuid("replyId").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.uuid("postId").references("postId").inTable("post").onDelete("CASCADE");
        table.uuid("commentId").references("commentId").inTable("comment").onDelete("CASCADE");
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.text("replyText");
        //table.string('userName').references('userName').inTable('user').onDelete("CASCADE");
        table.timestamps(false,true);

    }).createTable("forum",function(table){
        table.text("category");
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.text("messageBody");
        //table.string('userName').references('userName').inTable('user').onDelete("CASCADE");
        table.timestamps(false,true);


    }).createTable("conversation",function(table){
        table.uuid("conversationId").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.text("messageBody");
        table.uuid("user1Id").references("userId").inTable("user").onDelete("CASCADE");
        table.uuid("user2Id").references("userId").inTable("user").onDelete("CASCADE");
        table.timestamps(false,true);
    }).createTable("follow",function(table){
        table.uuid("userId").references("userId").inTable("user").onDelete("CASCADE");
        table.uuid("followingId").references("userId").inTable("user").onDelete("CASCADE");
        table.timestamps(false,true);
    })
  
  
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("post");
};

