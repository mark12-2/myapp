const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const UserModel = require('./models/user-model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:4200' 
}));


mongoose.connect("mongodb+srv://mark:R8YcAnqh!Ku.BZe@cluster0.fypebjl.mongodb.net/node-angular?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, x-Requested-with, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
       return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer token"
    if (!token) {
       return res.status(401).json({ message: 'Invalid token format.' });
    }

    try {
       const decoded = jwt.verify(token, jwtSecretKey);
       req.user = decoded;
       next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }

};

   
app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl 
    });

    post.save()
       .then(savedPost => {
            console.log(savedPost);
            res.status(201).json(savedPost); 
        })
       .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Error saving post'
            });
        });
});

app.delete('/api/posts/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.use('/api/posts', (req, res, next)=> {
    Post.find().then(documents => {
     res.status(200).json({
         message: 'Posts fetched successfully',
         posts: documents
      });
     })
 });


 // authentication... login and signup

 app.post('/sign-up', (req,res) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userModel = new UserModel({
                username: req.body.username,
                password: hash
            })

            userModel.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created',
                    result: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
})


app.post('/login', async (req, res) => { 
    let userFound;

    UserModel.findOne({ username: req.body.username })
      .then(async user => { 
            if (!user) {
                return res.status(401).json({
                    message: 'User not found'
                });
            }
            userFound = user;
            const match = await bcrypt.compare(req.body.password, user.password); 
            if (!match) {
                return res.status(401).json({
                    message: 'Password is incorrect'
                });
            }

            const token = jwt.sign({ username: userFound.username, userId: userFound._id }, "secret_string");
            res.json({ token });
        })
      .catch(err => {
            return res.status(401).json({
                message: 'Error with authentication'
            });
        });
});



module.exports = app;