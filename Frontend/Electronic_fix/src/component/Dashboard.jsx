import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";


const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/item/all');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAddQuestionClick = () => {
    navigate('/ask-question');
  };

  const handlePostClick = postId => {
    navigate(`/post/${postId}`);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {showSidebar && (
        <div className="bg-blue-700 text-white w-1/4 p-4 transition-transform duration-300 transform">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 w-full transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105"
            onClick={handleProfileClick}
          >
            Profile
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105"
            onClick={handleAddQuestionClick}
          >
            Ask Question
          </button>
        </div>
      )}
      <div className={`p-4 ${showSidebar ? 'w-3/4' : 'w-full'} bg-gray-50 shadow-lg rounded-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105"
            onClick={toggleSidebar}
          >
            {showSidebar ? 'Close' : 'Profile'} {/* <CgProfile /> */}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-lg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 rounded-b-lg">
              {posts.map((post, index) => (
                <tr
                  key={post._id}
                  className={`cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-gray-100' : 'bg-purple-50'} hover:bg-purple-100`}
                  onClick={() => handlePostClick(post._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.question}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.tags && post.tags.length > 0 ? (
                      <ul className="flex flex-wrap space-x-2">
                        {post.tags.map((tag, index) => (
                          <li
                            key={`${post._id}-tag-${index}`}
                            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No tags</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
