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

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    // console.log(users);
    // let newBlogData=[];
    // for (const blog of blogData){
    //     newBlogData.push({...blog, user_id:users[Math.floor(Math.random()*users.length)].id})
    // };

    await Blog.bulkCreate(blogData, { 
        individualHooks: true,
        returning: true,
    });
    // console.log(blogs);

    await Comment.bulkCreate(commentData, { 
        individualHooks: true,
        returning: true,
    });
    // for (const comment of commentData){
    //     await Comment.create({
    //         ...comment,
    //         user_id: users[Math.floor(Math.random()*users.length)].id,
    //         // const blogs = Blog.bulkCreate(blogData),
    //         blog_id: blogs[Math.floor(Math.random()*blogs.length)].id //  **** need blog to be an array
    //     })
    // };

    process.exit(0);
};

seedAllData();