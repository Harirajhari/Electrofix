const express = require("express");
const router = express.Router();
const Reply = require("../Schema/ReplySchema");
const UserPost = require("../Schema/userPost");
const middleware = require("../middleware/Auth")


router.post('/:postId', middleware, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    try {
        const newReply = new Reply({ user: userId, content });
        await newReply.save();

        // Add the reply to the post's replies array
        await UserPost.findByIdAndUpdate(postId, { $push: { replies: newReply._id } });

        res.status(201).json({ message: 'Reply created successfully', reply: newReply });
    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/:replyId',middleware, async (req, res) => {
    const { replyId } = req.params;
    const { content } = req.body;

    try {
        const updatedReply = await Reply.findByIdAndUpdate(replyId, { content }, { new: true });
        if (!updatedReply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        res.status(200).json({ message: 'Reply updated successfully', reply: updatedReply });
    } catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:replyId',middleware, async (req, res) => {
    const { replyId } = req.params;

    try {
        const reply = await Reply.findByIdAndDelete(replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Remove the reply from the post's replies array
        await UserPost.updateMany({}, { $pull: { replies: replyId } });

        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        console.error('Error deleting reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/:postId/replies', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await UserPost.findById(postId).populate('replies');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ replies: post.replies });
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;