const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');

app.use(bodyParser.json());

app.use(cors());

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
    "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

app.post("/api/posts", (req, res, next)=> {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save()
    .then(savedPost => {
        console.log(savedPost);
        res.status(201).json({
            message: 'post added successfully'
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Error saving post'
        });
    });
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
       const post = await Post.findByIdAndDelete(req.params.id);
       if (!post) {
         return res.status(404).json({ message: 'Post not found' });
       }
       res.json({ message: 'Post deleted successfully' });
    } catch (error) {
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

 
module.exports = app;