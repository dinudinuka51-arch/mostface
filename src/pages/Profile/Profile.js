import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Typography, Avatar, Button,
  Tabs, Tab, Paper, IconButton
} from '@mui/material';
import {
  CameraAlt, Edit, Message
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import Post from '../../components/Post/Post';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [{ user, posts }, dispatch] = useStateValue();
  const [profileUser, setProfileUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile user data
    const users = JSON.parse(localStorage.getItem('mostface_users') || '[]');
    const foundUser = users.find(u => u.id === parseInt(userId)) || user;
    setProfileUser(foundUser);
  }, [userId, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMessageClick = () => {
    // Open chat with this user
    dispatch({ type: 'OPEN_CHAT', payload: profileUser });
  };

  if (!profileUser) return <div>Loading...</div>;

  const userPosts = posts.filter(post => post.userId === profileUser.id);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Cover Photo */}
      <Paper sx={{ height: 200, bgcolor: 'grey.300', position: 'relative', mb: 8 }}>
        {user.id === profileUser.id && (
          <IconButton sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CameraAlt />
          </IconButton>
        )}
      </Paper>

      {/* Profile Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar src={profileUser.profilePicture} sx={{ width: 120, height: 120, mb: 2 }} />
        <Typography variant="h4">{profileUser.profileName || profileUser.name}</Typography>
        <Typography color="textSecondary">@{profileUser.email.split('@')[0]}</Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {user.id !== profileUser.id && (
            <Button variant="contained" startIcon={<Message />} onClick={handleMessageClick}>
              Message
            </Button>
          )}
          {user.id === profileUser.id && (
            <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Posts" />
          <Tab label="Photos" />
          <Tab label="Friends" />
          <Tab label="About" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {userPosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Profile;
