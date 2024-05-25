import React from 'react';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';

const GetStartedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600">
            <div className="bg-white p-10 rounded-lg shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
                    Welcome to{' '}
                    <span className="text-blue-500">
                        <Typewriter
                            words={['ElectroFixNics']}
                            loop={1}
                            cursor
                            cursorStyle="_"
                            typeSpeed={100}
                            deleteSpeed={80}
                            delaySpeed={1000}
                        />
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">Your community for electronics repair and maintenance. Post your doubts, and get solutions from experts in the field.</p>
                <Link to="/login">
                    <button 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full hover:from-purple-500 hover:to-blue-500 transition duration-300 shadow-lg"
                    >
                        Get Started
                    </button>
                </Link>

            </div>
        </div>
    );
}

export default GetStartedPage;
