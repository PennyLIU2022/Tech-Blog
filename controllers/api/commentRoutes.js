// import router from express package
const router = require('express').Router();
// import Blog, User and Comment model
const { Blog, User, Comment } = require('../../models');
// import withAuth to check whether logged in
const withAuth = require('../../utils/auth');

// get all comments
router.get('/', withAuth, async (req, res)=>{
    try{
        const commentData = await Comment.findAll({
            attributes: ["comment"],
            include: [
                {
                    model: User,
                    attributes: ["id", "username"],
                },
                {
                    model: Blog,
                    attributes: ["id", "title", "content"],
                }
            ]
        });

        res.status(200).json(commentData);
    } catch(err){
        res.status(500).json(err);
    }
}); 

// create a new comment
router.post('/', withAuth, async (req, res)=>{
    try {
        // {... req.body} -> 
        // {
        //     blog_id:req.body.blog_id, 
        //     comment:req.body.comment
        // }
        const newComment = await Comment.create({
            comment:req.body.comment,
            blog_id:req.body.blog_id,
            user_id: req.session.user_id,
        });

        res.status(200).json(newComment);

    } catch(err){
        res.status(500).json(err);
    }
});

// update a comment
router.put('/:id', withAuth, async (req, res)=>{
    try {
        const commentData = await Comment.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
                blog_id: req.session.blog_id,
            },
        });

        if(!commentData){
            res.status(404).json({ message: "No comment found with this id!"});
            return;
        }

        res.status(200).json(commentData);

    } catch(err){
        res.status(500).json(err);
    }
});

// delete a comment
router.delete('/:id', withAuth, async (req, res)=>{
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
                blog_id: req.session.blog_id,
            },
        });

        if(!commentData){
            res.status(404).json({ message: "No comment found with this id!"});
            return;
        }

        res.status(200).json(commentData);

    } catch(err){
        res.status(500).json(err);
    };
});

module.exports = router;