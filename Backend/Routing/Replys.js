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

        await UserPost.findByIdAndUpdate(postId, { $push: { replies: newReply._id } });

        res.status(201).json({ message: 'Reply created successfully', reply: newReply });
    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/:replyId', middleware, async (req, res) => {
    const { replyId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        const reply = await Reply.findById(replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if the user is the author of the reply
        if (reply.user.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this reply' });
        }

        const updatedReply = await Reply.findByIdAndUpdate(replyId, { content }, { new: true });
        res.status(200).json({ message: 'Reply updated successfully', reply: updatedReply });
    } catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:replyId', middleware, async (req, res) => {
    const { replyId } = req.params;
    const userId = req.user.id;

    try {
        const reply = await Reply.findById(replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if the user is the author of the reply
        if (reply.user.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this reply' });
        }

        await reply.delete();

        // Remove the reply from the post's replies array
        await UserPost.updateMany({}, { $pull: { replies: replyId } });

        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        console.error('Error deleting reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log("hello");

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