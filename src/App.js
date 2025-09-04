import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import Components
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Feed from './components/Feed/Feed';
import Widgets from './components/Widgets/Widgets';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import { StateProvider } from './context/StateContext';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1877f2', // Facebook-like blue
    },
    secondary: {
      main: '#42b72a', // Facebook-like green
    },
    background: {
      default: '#f0f2f5',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const loggedInUser = localStorage.getItem('mostface_user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StateProvider>
        <Router>
          <div className="app">
            {!user ? (
              <Login setUser={setUser} />
            ) : (
              <>
                <Header user={user} setUser={setUser} />
                <div className="app__body">
                  <Routes>
                    <Route 
                      path="/profile/:userId" 
                      element={
                        <>
                          <Sidebar />
                          <Profile />
                          <Widgets />
                        </>
                      } 
                    />
                    <Route 
                      path="/" 
                      element={
                        <>
                          <Sidebar />
                          <Feed />
                          <Widgets />
                        </>
                      } 
                    />
                  </Routes>
                </div>
              </>
            )}
          </div>
        </Router>
      </StateProvider>
    </ThemeProvider>
  );
}

export default App;
