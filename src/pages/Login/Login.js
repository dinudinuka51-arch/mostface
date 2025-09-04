import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Email,
  Person
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [{}, dispatch] = useStateValue();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      // Simulate API call
      setTimeout(() => {
        if (isLogin) {
          // Login logic
          const userData = {
            id: 1,
            name: 'John Doe',
            email: formData.email,
            profilePicture: '',
            coverPhoto: '',
            friends: [],
            posts: []
          };
          
          localStorage.setItem('mostface_user', JSON.stringify(userData));
          dispatch({ type: 'SET_USER', payload: userData });
          setUser(userData);
        } else {
          // Signup logic
          const userData = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            profilePicture: '',
            coverPhoto: '',
            friends: [],
            posts: []
          };
          
          localStorage.setItem('mostface_user', JSON.stringify(userData));
          dispatch({ type: 'SET_USER', payload: userData });
          setUser(userData);
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Box textAlign="center" mb={3}>
            <Facebook 
              sx={{ 
                fontSize: 48, 
                color: '#1877f2',
                mb: 2
              }} 
            />
            <Typography variant="h4" component="h1" gutterBottom>
              MostFace
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {!isLogin && (
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#1877f2',
                '&:hover': {
                  backgroundColor: '#166fe5'
                }
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                color="primary"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
                sx={{ textTransform: 'none' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
