const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // image url is optional
    imageUrl: {
        type: String,
        required: false 
    }
});

module.exports = mongoose.model('Post', postSchema);

//R8YcAnqh!Ku.BZe  pw