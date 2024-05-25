const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required:true },

    content: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    
}, { timestamps: true });

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;