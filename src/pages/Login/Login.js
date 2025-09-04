import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box,
  Divider, Alert, InputAdornment, IconButton, Stepper,
  Step, StepLabel, Avatar
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Person, CameraAlt
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    profileName: '', profilePicture: null, profilePreview: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [{}, dispatch] = useStateValue();

  const steps = ['Account Information', 'Profile Setup'];

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData({
            ...formData,
            profilePicture: file,
            profilePreview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError('');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call for registration
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        profileName: formData.profileName || formData.name,
        profilePicture: formData.profilePreview,
        coverPhoto: '',
        friends: [],
        posts: [],
        joined: new Date().toISOString()
      };
      
      localStorage.setItem('mostface_user', JSON.stringify(userData));
      localStorage.setItem('mostface_users', 
        JSON.stringify([...(JSON.parse(localStorage.getItem('mostface_users') || '[]')), userData])
      );
      
      dispatch({ type: 'SET_USER', payload: userData });
      setUser(userData);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    const users = JSON.parse(localStorage.getItem('mostface_users') || '[]');
    const user = users.find(u => u.email === formData.email);
    
    if (user && user.password === formData.password) {
      localStorage.setItem('mostface_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      setUser(user);
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              MostFace
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </Typography>
          </Box>

          {!isLogin && (
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={isLogin ? handleLogin : handleSubmit}>
            {isLogin ? (
              <>
                <TextField fullWidth label="Email" name="email" type="email"
                  value={formData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Password" name="password"
                  type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={handleChange} margin="normal" required />
              </>
            ) : (
              <>
                {activeStep === 0 && (
                  <>
                    <TextField fullWidth label="Full Name" name="name"
                      value={formData.name} onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Email" name="email" type="email"
                      value={formData.email} onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Password" name="password"
                      type={showPassword ? 'text' : 'password'} value={formData.password}
                      onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Confirm Password" name="confirmPassword"
                      type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                      onChange={handleChange} margin="normal" required />
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Box textAlign="center" mb={2}>
                      <Avatar src={formData.profilePreview} sx={{ width: 100, height: 100, mb: 2 }} />
                      <input accept="image/*" style={{ display: 'none' }} id="profile-picture" type="file"
                        name="profilePicture" onChange={handleChange} />
                      <label htmlFor="profile-picture">
                        <Button variant="outlined" component="span" startIcon={<CameraAlt />}>
                          Upload Photo
                        </Button>
                      </label>
                    </Box>
                    <TextField fullWidth label="Profile Name" name="profileName"
                      value={formData.profileName} onChange={handleChange} margin="normal"
                      helperText="This name will be visible to other users" />
                  </>
                )}
              </>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              {!isLogin && activeStep > 0 && (
                <Button onClick={handleBack} variant="outlined">Back</Button>
              )}
              
              {!isLogin && activeStep < steps.length - 1 ? (
                <Button onClick={handleNext} variant="contained">Next</Button>
              ) : (
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Complete Registration')}
                </Button>
              )}
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />
          <Box textAlign="center">
            <Typography variant="body2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button onClick={() => setIsLogin(!isLogin)} color="primary">
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
