// import router from express package
const router = require('express').Router();
// import User model
const { User } = require('../../models');

// create a new client
router.post('/', async(req, res) => {
    try{
        const userData = await User.create(req.body);
        console.log(userData);

        req.session.save(()=>{
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json( {message: "You are registered!"})
        });
        // res.render('dashboard');
        
        
    }catch(err){
        res.status(400).json(err)
    }
});

// login
router.post('/login', async(req, res)=>{
    try{
        const userData = await User.findOne({ 
            where: {username: req.body.username}
        });
    
        if (!userData){
            res.status(400).json( {message: "Incorrect username or password, please try again!"});
            return;
        }

        req.session.save(()=>{
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json( {message: "You are now logged in!"})
        });
        
    } catch (err){
        res.status(400).json(err);
    }
});

// logout
router.post('/logout', (req, res)=>{
    if (req.session.logged_in){
        req.session.destroy(()=>{
            res.status(204).end();
        });
    } else{
        res.status(404).end();
    }
});

module.exports = router;