import React, { useState } from 'react';
import {
  Paper, Box, TextField, Button, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import {
  PhotoCamera, VideoCameraBack, EmojiEmotions, Close
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './CreatePost.css';

const CreatePost = () => {
  const [{ user }, dispatch] = useStateValue();
  const [postText, setPostText] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [openMediaDialog, setOpenMediaDialog] = useState(false);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.includes('image') ? 'image' : 'video');
      
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
      
      setOpenMediaDialog(true);
    }
  };

  const handlePostSubmit = () => {
    if (!postText.trim() && !mediaFile) return;

    const newPost = {
      id: Date.now(),
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        profileName: user.profileName,
        profilePicture: user.profilePicture
      },
      content: postText,
      media: mediaPreview,
      mediaType: mediaType,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_POST', payload: newPost });
    
    // Reset form
    setPostText('');
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('');
    setOpenMediaDialog(false);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('');
    setOpenMediaDialog(false);
  };

  return (
    <Paper className="create-post" sx={{ p: 2, mb: 2 }}>
      <Box className="create-post__input" sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <img src={user.profilePicture} alt={user.name} className="create-post__avatar" />
        <TextField
          fullWidth
          placeholder={`What's on your mind, ${user.profileName || user.name}?`}
          variant="outlined"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          multiline
          maxRows={4}
        />
      </Box>

      <Box className="create-post__actions" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <input
            accept="image/*,video/*"
            style={{ display: 'none' }}
            id="media-upload"
            type="file"
            onChange={handleMediaUpload}
          />
          <label htmlFor="media-upload">
            <IconButton component="span">
              <PhotoCamera color="primary" />
            </IconButton>
          </label>
          <IconButton>
            <VideoCameraBack color="secondary" />
          </IconButton>
          <IconButton>
            <EmojiEmotions color="warning" />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          onClick={handlePostSubmit}
          disabled={!postText.trim() && !mediaFile}
        >
          Post
        </Button>
      </Box>

      <Dialog open={openMediaDialog} onClose={() => setOpenMediaDialog(false)} maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Preview Media
            <IconButton onClick={removeMedia}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {mediaType === 'image' ? (
            <img src={mediaPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          ) : (
            <video src={mediaPreview} controls style={{ maxWidth: '100%', maxHeight: '400px' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={removeMedia}>Remove</Button>
          <Button onClick={() => setOpenMediaDialog(false)}>Cancel</Button>
          <Button onClick={handlePostSubmit} variant="contained">Post</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CreatePost;
