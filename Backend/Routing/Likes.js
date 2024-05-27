const express = require('express');
const router = express.Router();
const Reply = require('../Schema/ReplySchema');
const middleware = require('../middleware/Auth');

// Like a reply
router.post('/:replyId/like', middleware, async (req, res) => {
    const { replyId } = req.params;
    const userId = req.user.id;

    try {
        console.log(`Like request received for replyId: ${replyId} by userId: ${userId}`);
        const reply = await Reply.findById(replyId);
        if (!reply) {
            console.error(`Reply with ID ${replyId} not found`);
            return res.status(404).json({ message: 'Reply not found' });
        }

        if (reply.likes.includes(userId)) {
            console.log(`User ${userId} has already liked reply ${replyId}`);
            return res.status(400).json({ message: 'You have already liked this reply' });
        }

        reply.likes.push(userId);
        reply.user = userId; // Ensure the user field is set correctly
        await reply.save();
        console.log(`Reply ${replyId} liked successfully by user ${userId}`);

        res.status(200).json({ message: 'Reply liked successfully', likesCount: reply.likes.length });
    } catch (error) {
        console.error('Error liking reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Unlike a reply
router.post('/:replyId/unlike', middleware, async (req, res) => {
    const { replyId } = req.params;
    const userId = req.user.id;

    try {
        console.log(`Unlike request received for replyId: ${replyId} by userId: ${userId}`);
        const reply = await Reply.findById(replyId);
        if (!reply) {
            console.error(`Reply with ID ${replyId} not found`);
            return res.status(404).json({ message: 'Reply not found' });
        }

        if (!reply.likes.includes(userId)) {
            console.log(`User ${userId} has not liked reply ${replyId}`);
            return res.status(400).json({ message: 'You have not liked this reply' });
        }

        reply.likes = reply.likes.filter(id => id.toString() !== userId.toString());
        await reply.save();
        console.log(`Reply ${replyId} unliked successfully by user ${userId}`);

        res.status(200).json({ message: 'Reply unliked successfully', likesCount: reply.likes.length });
    } catch (error) {
        console.error('Error unliking reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
