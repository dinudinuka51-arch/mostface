import React, { useState } from 'react';
import {
  Grid, Card, CardMedia, CardContent,
  CardActions, Typography, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import {
  Add, CameraAlt, Close
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Marketplace.css';

const Marketplace = () => {
  const [{ user, marketplaceItems }, dispatch] = useStateValue();
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    imagePreview: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItem({
          ...newItem,
          image: file,
          imagePreview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateItem = () => {
    if (!newItem.title || !newItem.price || !newItem.image) return;

    const item = {
      id: Date.now(),
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        profileName: user.profileName,
        profilePicture: user.profilePicture
      },
      title: newItem.title,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: newItem.imagePreview,
      timestamp: new Date().toISOString(),
      location: 'Colombo, Sri Lanka',
      condition: 'Excellent'
    };

    dispatch({ type: 'ADD_MARKETPLACE_ITEM', payload: item });
    
    setNewItem({
      title: '',
      description: '',
      price: '',
      image: null,
      imagePreview: ''
    });
    setOpenDialog(false);
  };

  return (
    <Box className="marketplace" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Marketplace</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Sell Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {marketplaceItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  Rs. {item.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {item.location} • {item.condition}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Message Seller
                </Button>
                <Button size="small" color="primary">
                  Save
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Sell Item
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="item-image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="item-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CameraAlt />}
                fullWidth
                sx={{ height: 100 }}
              >
                {newItem.imagePreview ? (
                  <img src={newItem.imagePreview} alt="Preview" style={{ maxHeight: 80, maxWidth: '100%' }} />
                ) : (
                  'Upload Item Image'
                )}
              </Button>
            </label>

            <TextField
              label="Item Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Price (LKR)"
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateItem} variant="contained" disabled={!newItem.title || !newItem.price || !newItem.image}>
            List Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Marketplace;
