// import router from express package
const router = require('express').Router();
// import Blog, User and Comment model
const { Blog, User, Comment } = require('../models');
// import withAuth to check whether logged in
const withAuth = require('../utils/auth');

// get all blogs and comments under the user
router.get('/', withAuth, async (req, res) => {
    try{
     const blogData = await Blog.findAll({
        where: { user_id: req.session.user_id },
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


     // pass serialized data and session flag into template
     res.render('dashboard', {
        blogs,
        logged_in: true
     });

    } catch (err){
        res.status(500).json(err);
    }
});

// edit the blog under this user
router.get('/edit/:id', withAuth, async (req, res) => {
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
      const blogs = blogData.get({ plain: true });
      console.log(blogs);
  
      res.render('edit-post', {
        blogs,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

// post a new blog
router.get('/new', (req, res) => {
    res.render('new-post')
});

module.exports = router;