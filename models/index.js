// import models
const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment');

// blog belongs to user
Blog.belongsTo(User, {
  foreignKey: 'user_id',
})

// User has many blogs
User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
})

// comment belongs to blog
Comment.belongsTo(Blog, {
    foreignKey: 'blog_id',
});

// blog has many comments
Blog.hasMany(Comment, {
  foreignKey: 'blog_id',
  onDelete: 'CASCADE',
})
   
// comment belongs to user
Comment.belongsTo(User, {
 foreignKey: 'user_id',
});

// User has many blogs
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});


module.exports = {
    User,
    Blog,
    Comment,
};
