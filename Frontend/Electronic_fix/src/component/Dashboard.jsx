import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [newComment, setNewComment] = useState({});
  const [commentError, setCommentError] = useState('');
  const [likedReplies, setLikedReplies] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/item/all');
        setPosts(response.data.posts);
    
        // Initialize likedReplies with the replies the user has already liked
        const userLikedReplies = new Set();
        response.data.posts.forEach(post => {
          // Check if post.replies is defined before accessing its properties
          if (post.replies) {
            post.replies.forEach(reply => {
              // Check if reply.likes is defined before accessing its properties
              if (reply.likes && reply.likes.includes(response.data.userId)) {
                userLikedReplies.add(reply._id);
              }
            });
          }
        });
        setLikedReplies(userLikedReplies);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const handlePostClick = async postId => {
    setPosts(posts =>
      posts.map(post =>
        post._id === postId ? { ...post, showReplies: !post.showReplies } : post
      )
    );

    try {
      const response = await axios.get(`http://localhost:3000/reply/${postId}`);
      setPosts(posts =>
        posts.map(post =>
          post._id === postId ? { ...post, replies: response.data.replies } : post
        )
      );
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentsError('Error fetching comments. Please try again later.');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAddQuestionClick = () => {
    navigate('/ask-question');
  };

  const handleCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
  };

  const handleCommentSubmit = async (postId, event) => {
    event.stopPropagation();
    if (!newComment[postId]) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/reply/${postId}`,
        { content: newComment[postId] },
        { withCredentials: true }
      );
      setNewComment({ ...newComment, [postId]: '' });
      handlePostClick(postId); // Refresh comments
      setCommentError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Error adding comment. Please try again later.');
    }
  };
  const handleLikeReply = async replyId => {
    try {
      await axios.post(
        `http://localhost:3000/like/${replyId}/like`,
        {},
        { withCredentials: true }
      );
      setPosts(posts =>
        posts.map(post => ({
          ...post,
          replies: post.replies.map(reply =>
            reply._id === replyId
              ? { ...reply, likes: reply.likes + 1 }
              : reply
          )
        }))
      );
      setLikedReplies(new Set([...likedReplies, replyId]));
    } catch (error) {
      console.error('Error liking reply:', error);
      setError('Error liking reply. Please try again later.');
    }
  };
  
  const handleUnlikeReply = async replyId => {
    try {
      await axios.post(
        `http://localhost:3000/like/${replyId}/unlike`,
        {},
        { withCredentials: true }
      );
      setPosts(posts =>
        posts.map(post => ({
          ...post,
          replies: post.replies.map(reply =>
            reply._id === replyId
              ? { ...reply, likes: Math.max(0, reply.likes - 1) }
              : reply
          )
        }))
      );
      setLikedReplies(new Set([...likedReplies].filter(id => id !== replyId)));
    } catch (error) {
      console.error('Error unliking reply:', error);
      setError('Error unliking reply. Please try again later.');
    }
  };
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddQuestionClick}>
          Add Question
        </button>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleProfileClick}>
          Profile
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div
            key={post._id}
            className="bg-white p-4 rounded shadow cursor-pointer"
            onClick={() => handlePostClick(post._id)}
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2">{post.question}</p>
            {post.image && <img src={post.image} alt={post.title} className="mt-2 rounded" />}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Tags:</h3>
                <ul className="flex flex-wrap space-x-2">
                  {post.tags.map((tag, index) => (
                    <li key={`${post._id}-tag-${index}`} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {post.showReplies && (
              <div className="mt-4">
                <h3 className="font-semibold">Comments:</h3>
                {commentsError && <p className="text-red-500">{commentsError}</p>}
                <div className="space-y-4">
                  {post.replies &&
                    post.replies.map(reply => (
                      <div key={reply._id} className="bg-gray-100 p-4 rounded">
                        <p>{reply.content}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              likedReplies.has(reply._id)
                                ? handleUnlikeReply(reply._id)
                                : handleLikeReply(reply._id);
                            }}
                            className={`mr-2 ${likedReplies.has(reply._id) ? 'text-blue-500' : 'text-gray-500'}`}
                          >
                            👍
                          </button>
                          <span>{reply.likes && reply.likes.length ? reply.likes.length : 0}</span>
                        </div>
                      </div>
                    ))}
                  {!post.replies && <p>Loading comments...</p>}
                </div>
                <div className="mt-4">
                  <textarea
                    value={newComment[post._id] || ''}
                    onChange={e => handleCommentChange(post._id, e.target.value)}
                    placeholder="Add a comment"
                    className="border p-2 w-full rounded"
                    onClick={e => e.stopPropagation()} // Prevent click event from propagating
                  />
                  <button
                    onClick={e => handleCommentSubmit(post._id, e)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                  {commentError && <p className="text-red-500">{commentError}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
