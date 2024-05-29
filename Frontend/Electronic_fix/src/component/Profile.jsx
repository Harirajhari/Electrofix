import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState('');
  const [postsError, setPostsError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [editedTags, setEditedTags] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/details', { withCredentials: true });
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Error fetching user details. Please try again later.');
      }
    };



    const fetchUserPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/item/user/posts', { withCredentials: true });
        setUserPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setPostsError('Error fetching user posts. Please try again later.');
      }
    };

    fetchUserDetails();
    fetchUserPosts();
  }, []);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedQuestion(post.question);
    setEditedImage(post.image);
    setEditedTags(post.tags.join(', ')); // Assuming tags are stored as an array
  };

  const handleUpdatePost = async (postId) => {
    try {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('question', editedQuestion);
      if (editedImage) {
        formData.append('image', editedImage);
      }
      formData.append('tags', editedTags.split(',').map(tag => tag.trim())); // Convert tags string to array

      const response = await axios.put(`http://localhost:3000/item/update/${postId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUserPosts(userPosts.map(post => post._id === postId ? response.data.post : post));
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      setPostsError('Error updating post. Please try again later.');
    }
  };

  const handleDeleteClick = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/item/delete/${postId}`, { withCredentials: true });
      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setPostsError('Error deleting post. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-1/2 relative">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        {error && <p className="text-red-500">{error}</p>}
        {userDetails ? (
          <div>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Mobile:</strong> {userDetails.mobile}</p>
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
        <h3 className="text-lg font-bold mt-4">Your Questions</h3>
        {postsError && <p className="text-red-500">{postsError}</p>}
        <div className="space-y-4 mt-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post._id} className="bg-gray-100 p-4 rounded relative">
                {editingPost && editingPost._id === post._id ? (
                  <div>
                    <input
                      className="border p-2 mb-2 w-full"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <textarea
                      className="border p-2 mb-2 w-full"
                      value={editedQuestion}
                      onChange={(e) => setEditedQuestion(e.target.value)}
                    />
                    <input
                      type="file"
                      className="border p-2 mb-2 w-full"
                      onChange={(e) => setEditedImage(e.target.files[0])}
                    />
                    <input
                      className="border p-2 mb-2 w-full"
                      value={editedTags}
                      onChange={(e) => setEditedTags(e.target.value)}
                      placeholder="Comma-separated tags"
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleUpdatePost(post._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={() => setEditingPost(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold">{post.title}</h4>
                    <p>{post.question}</p>
                    <button
                      className="absolute top-4 right-28 bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => handleEditClick(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDeleteClick(post._id)}
                    >
                      Delete
                    </button>
                    <button className='absolute top-16 right-6 bg-grey  text-white px-4 py-2 rounded'>
                      <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="Gemini AI" width="24" height="24" />
                    </button>



                    <h5 className="font-semibold mt-4">Replies</h5>
                    {post.replies && post.replies.length > 0 ? (
                      <ul className="ml-4">
                        {post.replies.map(reply => (
                          <li key={reply._id} className="bg-white p-2 rounded mb-2">
                            <p className="text-gray-700"> Experts : {reply.content}</p>                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No replies yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            !postsError && <p>No posts found.</p>
          )}
        </div>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded absolute top-2 left-2" onClick={handleBackClick}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default Profile;
