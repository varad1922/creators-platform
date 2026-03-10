import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Please provide title and content' });
        }

        const post = await Post.create({
            title,
            content,
            author: req.user.id // From protect middleware
        });

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all posts for logged in user (with pagination)
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Count total posts for this user
        const total = await Post.countDocuments({ author: req.user.id });

        // Fetch paginated posts
        const posts = await Post.find({ author: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: posts.length,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            },
            data: posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorize: Check if post belongs to user
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this post' });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorize: Check if post belongs to user
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorize: Check if post belongs to user
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post removed'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
