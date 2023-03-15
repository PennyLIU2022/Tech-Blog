// import router from express package
const router = require('express').Router();
// import Blog and User model
const { Blog, User } = require('../../models');
// import withAuth to check whether logged in
const withAuth = require('../../utils/auth');

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
    //  const blogs = blogData.map((blog)=>blog.get({ plain: true }));

     // pass serialized data and session flag into template
    //  res.render('homepage', {
    //     blogs,
    //     logged_in: req.session.logged_in
    //  });
    res.status(200).json(blogData);

    } catch (err){
        res.status(500).json(err);
    }
});

// create a blog
router.post('/', withAuth, async (req, res)=>{
    try {
        const newBlog = await Blog.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id,
        });

        res.status(200).json(newBlog);
    } catch(err){
        res.status(500).json(err);
    }
});

// update a blog
router.put('/:id', withAuth, async (req, res)=>{
    console.log("test");
    console.log(req.session.user_id);
    try{
        const blogData = await Blog.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
                
            },
        });

        if(!blogData){
            res.status(404).json({ message: "No blog found with this id!"});
            return;
        }

        res.status(200).json(blogData);
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// delete a blog
router.delete('/:id', withAuth, async (req, res)=>{
    try{
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if(!blogData){
            res.status(404).json({ message: "No blog found with this id!"});
            return;
        }

        res.status(200).json(blogData);
    } catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;