import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useStateValue } from '../../context/StateContext';
import CreatePost from '../Post/CreatePost';
import Post from '../Post/Post';
import './Feed.css';

const Feed = () => {
  const [{ posts, user }] = useStateValue();
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    // Sort posts by timestamp (newest first)
    const sortedPosts = [...posts].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    setFilteredPosts(sortedPosts);
  }, [posts]);

  return (
    <Box className="feed" sx={{ flex: 1, p: 2 }}>
      <CreatePost />
      
      {filteredPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      
      {filteredPosts.length === 0 && (
        <Box className="feed__empty" sx={{ textAlign: 'center', mt: 4 }}>
          <h3>No posts yet</h3>
          <p>Be the first to share something!</p>
        </Box>
      )}
    </Box>
  );
};

export default Feed;
