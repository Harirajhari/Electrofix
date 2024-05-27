const express = require('express');
const router = express.Router();
const UserPostSChema = require("../Schema/userPost")
const middleware = require("../middleware/Auth");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/add', middleware, upload.single('image'), async (req, res) => {
    const { title, question } = req.body;
    const user = req.user.id;
    let tags;

    try {
        tags = JSON.parse(req.body.tags);
    } catch (e) {
        return res.status(400).json({ message: 'Tags should be a valid JSON array.' });
    }

    if (!title || !question || !tags || !Array.isArray(tags)) {
        return res.status(400).json({ message: 'Title, question, and tags are required and tags should be an array.' });
    }

    let imageUrl = '';

    if (req.file) {
        const fileContent = req.file.buffer;
        const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };

        try {
            const data = await s3Client.send(new PutObjectCommand(params));
            imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        } catch (error) {
            console.error('Error uploading image to S3:', error);
            return res.status(500).json({ message: 'Error uploading image' });
        }
    }

    try {
        const newPost = new UserPostSChema({user, title, question, image: imageUrl, tags });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update/:id', middleware, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, question, tags } = req.body;
    const image = req.file;

    if (!title || !question || !tags || !Array.isArray(tags.split(','))) {
        return res.status(400).json({ message: "Title, question, and tags are required and tags should be an array." });
    }

    try {
        const updatedPost = await UserPostSChema.findByIdAndUpdate(
            id,
            { title, question, image: image?.path, tags: tags.split(',') },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.delete('/delete/:id', middleware, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await UserPostSChema.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/filter', async (req, res) => {
    const { tag } = req.query;

    if (!tag) {
        return res.status(400).json({ message: "Tag query parameter is required" });
    }

    try {
        const posts = await UserPostSChema.find({ tags: { $regex: tag, $options: 'i' } });
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error filtering posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/all', async (req, res) => {
    try {
        const posts = await UserPostSChema.find({});
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//User post Items
router.get("/user/posts", middleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const posts = await UserPostSChema.find({ user : userId });
        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


module.exports = router;