    const mongoose = require("mongoose");

    const UserPost = new mongoose.Schema({
        user: String,
        title: String,
        question:String,
        image:String,
        tags:{
            type: [String],
            required: true
        },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    })

    const PostItem = mongoose.model("userPost", UserPost);

    module.exports = PostItem;