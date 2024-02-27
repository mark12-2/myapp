const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());

app.use(cors());

app.use('/api/posts', (req, res, next)=> {
    const posts =[
        { id : 'jaegai287ag',
            title : 'from server-side post',
                content: 'coming from server side' },
        { id : 'ual8iya',
            title : 'second from server-side post',
              content: 'second coming from server side' },
    ];
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
})

module.exports = app;