// import router from express package
const router = require('express').Router();
// import Blog, User and Comment model
const { Blog, User, Comment } = require('../models');
// import withAuth to check whether logged in
const withAuth = require('../utils/auth');

// get all blogs
router.get('/', async (req, res) => {
    try{
     const blogData = await Blog.findAll({
        attributes: ['id','title','content','date_created'],
        include: [
            {
                model: Comment,
                attributes: ['id','comment','date_created','user_id','blog_id'],
                include: [{
                    model: User,
                    attributes: ['username'],
                }]
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
     });

     // serialize data so the template can read it
     const blogs = blogData.map((blog)=>blog.get({ plain: true }));
     console.log(blogs);

     // pass serialized data and session flag into template
     res.render('homepage', {
        blogs,
        logged_in: req.session.logged_in
     });

    } catch (err){
        res.status(500).json(err);
    }
});

// login
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// signup
// router.get('/signup', (req, res) => {
//     res.render('signup');
// });

// get blog by user id value
router.get('/blog/:id', async (req, res) => {
    try {
      const blogData = await Blog.findOne({
        where: { id: req.params.id }, 
        attributes: ['id','title','content','date_created'],
        include: [
            {
                model: Comment,
                attributes: ['id','comment','date_created','user_id','blog_id'],
                include: [{
                    model: User,
                    attributes: ['username'],
                }]
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
      });

      if(!blogData){
        res.status(404).json({ message: "No blog found with this id!"});
        return;
      };
      
      // serialize data so the template can read it
      const blog = blogData.get({ plain: true });
  
      res.render('single-post', {
        blog,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

// get comments by user id value
router.get('/posts-comments', withAuth, async (req, res) => {
    try {
      const blogData = await Blog.findOne({
        where: { id: req.params.id }, 
        attributes: ['id','title','content','date_created'],
        include: [
            {
                model: Comment,
                attributes: ['id','comment','date_created','user_id','blog_id'],
                include: [{
                    model: User,
                    attributes: ['username'],
                }]
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
      }); 

      if(!blogData){
        res.status(404).json({ message: "No blog found with this id!"});
        return;
      };
      
      // serialize data so the template can read it
      const blog = blogData.get({ plain: true });
  
      res.render('posts-comments', {
        blog,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router