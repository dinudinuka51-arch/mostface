import React, { useState, useEffect } from 'react';
import {
  Paper, List, ListItem, ListItemAvatar,
  ListItemText, Avatar, Typography, Badge,
  IconButton, Box
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close, Favorite, Comment, PersonAdd
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Notifications.css';

const Notifications = () => {
  const [{ notifications }, dispatch] = useStateValue();
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
      }
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Favorite color="error" />;
      case 'comment':
        return <Comment color="primary" />;
      case 'friend_request':
        return <PersonAdd color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.senderName} liked your post`;
      case 'comment':
        return `${notification.senderName} commented on your post`;
      case 'friend_request':
        return `${notification.senderName} sent you a friend request`;
      default:
        return notification.message;
    }
  };

  return (
    <Box className="notifications-container">
      <IconButton onClick={() => setOpen(!open)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {open && (
        <Paper className="notifications-dropdown" sx={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          width: 350, 
          maxHeight: 400,
          overflow: 'auto',
          zIndex: 1000,
          mt: 1
        }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Box>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
              <IconButton size="small" onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              notifications.map(notification => (
                <ListItem
                  key={notification.id}
                  button
                  sx={{ bgcolor: notification.read ? 'transparent' : 'action.hover' }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar src={notification.senderProfilePicture}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getNotificationText(notification)}
                    secondary={new Date(notification.timestamp).toLocaleString()}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Notifications;
