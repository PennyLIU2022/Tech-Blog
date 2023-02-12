// import models
const { User, Blog, Comment } = require('../models');
// import our database connection from config.js
const sequelize = require('../config/connection');

// import data
const userData = require ('./user-seeds.json');
const blogData = require('./blog-seeds.json');
const commentData = require('./comment-seeds.json');

// seed data
const seedAllData = async ()=>{
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    for (const blog of blogData){
        await Blog.create({
            ...blog,
            user_id: users[Math.floor(math.random()*users.length)].id,
        })
    };

    for (const comment of commentData){
        await Comment.create({
            ...comment,
            user_id: users[Math.floor(math.random()*users.length)].id,
            // const blogs = Blog.bulkCreate(blogData),
            blog_id: blog[Math.floor(math.randome()*blog.length)].id //  **** need blog to be an array
        })
    };

    process.exit(0); //exist once found the correct user_id and blog_id?
};

seedAllData();