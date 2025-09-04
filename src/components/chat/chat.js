import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, TextField, Button, IconButton,
  Avatar, Typography, List, ListItem, ListItemAvatar,
  ListItemText, Badge
} from '@mui/material';
import {
  Send, Close, Image as ImageIcon
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Chat.css';

const Chat = () => {
  const [{ user, chats, activeChat }, dispatch] = useStateValue();
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChat) {
      setSelectedChat(activeChat);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      receiverId: selectedChat.userId,
      text: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    dispatch({
      type: 'SEND_MESSAGE',
      payload: {
        chatId: selectedChat.id,
        message: newMessage
      }
    });

    setMessage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedChat) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageMessage = {
          id: Date.now(),
          senderId: user.id,
          receiverId: selectedChat.userId,
          image: e.target.result,
          timestamp: new Date().toISOString(),
          read: false
        };

        dispatch({
          type: 'SEND_MESSAGE',
          payload: {
            chatId: selectedChat.id,
            message: imageMessage
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const openChat = (chatUser) => {
    setSelectedChat(chatUser);
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatUser });
  };

  const closeChat = () => {
    setSelectedChat(null);
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: null });
  };

  if (!user) return null;

  return (
    <Box className="chat-container">
      {/* Chat List */}
      <Paper className="chat-list" sx={{ width: 300, mr: 2 }}>
        <Box className="chat-list-header" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Messages</Typography>
        </Box>
        <List>
          {chats.map(chat => (
            <ListItem
              key={chat.id}
              button
              selected={selectedChat?.id === chat.id}
              onClick={() => openChat(chat)}
            >
              <ListItemAvatar>
                <Badge
                  color="error"
                  variant="dot"
                  invisible={!chat.unreadCount || chat.unreadCount === 0}
                >
                  <Avatar src={chat.profilePicture} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={chat.profileName || chat.name}
                secondary={chat.lastMessage?.substring(0, 30) + '...'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Window */}
      {selectedChat && (
        <Paper className="chat-window" sx={{ flex: 1 }}>
          <Box className="chat-header" sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={selectedChat.profilePicture} />
              <Typography variant="h6">{selectedChat.profileName || selectedChat.name}</Typography>
            </Box>
            <IconButton onClick={closeChat}>
              <Close />
            </IconButton>
          </Box>

          <Box className="chat-messages" sx={{ p: 2, height: 400, overflow: 'auto' }}>
            {selectedChat.messages?.map(msg => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.senderId === user.id ? 'primary.main' : 'grey.100',
                    color: msg.senderId === user.id ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                    maxWidth: '70%'
                  }}
                >
                  {msg.image ? (
                    <img src={msg.image} alt="Sent image" style={{ maxWidth: 200, maxHeight: 200 }} />
                  ) : (
                    <Typography>{msg.text}</Typography>
                  )}
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box className="chat-input" sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="chat-image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="chat-image-upload">
                <IconButton component="span">
                  <ImageIcon />
                </IconButton>
              </label>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton onClick={handleSendMessage} disabled={!message.trim()}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Chat;
