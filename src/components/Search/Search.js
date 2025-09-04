import React, { useState, useEffect } from 'react';
import {
  Paper, Box, TextField, List, ListItem, ListItemAvatar,
  ListItemText, Avatar, Typography, Divider
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [{ users, posts }] = useStateValue();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ users: [], posts: [] });
      return;
    }

    const filteredUsers = users.filter(user =>
      user.profileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPosts = posts.filter(post =>
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.profileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults({
      users: filteredUsers,
      posts: filteredPosts
    });
  }, [searchTerm, users, posts]);

  return (
    <Box className="search" sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        placeholder="Search MostFace..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />

      {searchTerm && (
        <Paper className="search-results" sx={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          mt: 1,
          maxHeight: 400,
          overflow: 'auto'
        }}>
          {searchResults.users.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ p: 2, pb: 1 }}>People</Typography>
              <List>
                {searchResults.users.map(user => (
                  <ListItem key={user.id} button>
                    <ListItemAvatar>
                      <Avatar src={user.profilePicture} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.profileName || user.name}
                      secondary={user.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {searchResults.posts.length > 0 && (
            <Box>
              <Divider />
              <Typography variant="subtitle2" sx={{ p: 2, pb: 1 }}>Posts</Typography>
              <List>
                {searchResults.posts.map(post => (
                  <ListItem key={post.id} button>
                    <ListItemText
                      primary={post.content?.substring(0, 100) + '...'}
                      secondary={`By ${post.user?.profileName || post.user?.name}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {searchResults.users.length === 0 && searchResults.posts.length === 0 && searchTerm && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="textSecondary">No results found</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Search;
