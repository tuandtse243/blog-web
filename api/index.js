const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const { JsonWebTokenError } = require('jsonwebtoken');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const salt = bcrypt.genSaltSync(10);
const secret = 'sdgsdfgxcvsergts'

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser())

mongoose.connect('mongodb+srv://tuandtse243:tuandtse243@cluster0.3hlsjqp.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(e)
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const {username, password} = req.body;
        const userDoc = await User.findOne({username});
        const passOk = bcrypt.compareSync(password, userDoc.password);
        // res.json(passOk);
        if (passOk) {
            //logged in
            jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                }); //set token(name in cookie) : token
            })
        } else {
            res.status(400).json('wrong credentials')
        }
    } catch (error) {
        
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });
    // res.json(req.cookies)
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.listen(4000)

