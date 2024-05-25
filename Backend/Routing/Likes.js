const express = require('express');
const router = express.Router();
const Reply = require("../Schema/ReplySchema");
const middleware = require("../middleware/Auth")


//reply likes 
router.post('/:replyId', middleware ,  async (req, res) => {
    const  userId = req.user.id;
    const { replyId } = req.params;

    try {
        // Update the Reply document to add the user to the likes array
        await Reply.findByIdAndUpdate(replyId, { $addToSet: { likes: userId } });
        res.status(200).json({ message: 'Reply liked successfully' });
    } catch (error) {
        console.error('Error liking reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router

