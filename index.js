const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');

// connect to mongo
mongoose.connect('mongodb://localhost:27017/authentication-demo')
.then(() => {
    console.log('Mongo connection open.');
})
.catch(err => {
    console.log('Mongo error:')
    console.log(err);
});


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended:true}));
app.use(session({secret: 'notagoodsecret'}));

// middleware to require login / protect routes
const requireLogin = (req,res,next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}


app.get('/', (req,res) => {
    res.send('This is the home page.')
})

app.get('/register', (req,res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const user = new User({username, password})
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    }
    else {
        res.redirect('/login');
    }
})

// hide this unless user is authenticated
app.get('/secret', requireLogin, (req,res) => {
    res.render('secret');
})

app.post('/logout', (req,res) => {
    req.session.user_id = null;
    //could also do req.session.destroy();
    res.redirect('/login');
})

app.listen(3000, () => {
    console.log('Serving authentication-demo app at http://localhost:3000/')
})