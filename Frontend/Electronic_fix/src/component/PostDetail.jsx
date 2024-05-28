import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/item/${postId}`);
        setPost(response.data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Error fetching post. Please try again later.');
      }
    };
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/reply/${postId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment('');
      setCommentError('');

      // Fetch the updated post to include the new comment
      const response = await axios.get(`http://localhost:3000/item/${postId}`);
      setPost(response.data.post);
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Error adding comment. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      {error && <p className="text-red-100 bg-red-700 p-2 rounded">{error}</p>}
      {post && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-gradient-to-r from-blue-500 to-purple-500">{post.title}</h1>
          <p className="text-gray-700 mb-6">{post.question}</p>
          {post.image && (
            <img src={post.image} alt={post.title} className="mb-6 w-full rounded-lg shadow-md" />
          )}
          <div className="mb-6">
            {post.tags && post.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <li
                    key={`${post._id}-tag-${index}`}
                    className="bg-gradient-to-r from-green-400 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <span>No tags</span>
            )}
          </div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4 text-gradient-to-r from-green-400 to-blue-600">Comments</h2>
            {post.replies && post.replies.length > 0 ? (
              <ul>
                {post.replies.map(reply => (
                  <li key={reply._id} className="mb-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                      <p className="text-gray-700">{reply.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No comments yet</p>
            )}
          </div>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <textarea
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
            </div>
            {commentError && <p className="text-red-500 mb-4">{commentError}</p>}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-red-500 text-white px-4 py-2 rounded shadow-lg transition-transform duration-300 transform hover:scale-105"
            >
              Add Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
