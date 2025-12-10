import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      const hash = window.location.hash;
      const sessionId = hash.split('session_id=')[1]?.split('&')[0];

      if (!sessionId) {
        console.log('No session_id found, redirecting to login');
        navigate('/', { replace: true });
        return;
      }

      try {
        console.log('Processing session_id:', sessionId.substring(0, 10) + '...');
        const response = await axios.post(
          `${API}/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        console.log('Authentication successful, user:', response.data.user.email);
        setUser(response.data.user);
        sessionStorage.setItem('just_authenticated', 'true');
        
        // Clear hash to prevent re-processing
        window.location.hash = '';
        
        navigate('/dashboard', { replace: true, state: { user: response.data.user } });
      } catch (error) {
        console.error('Auth error:', error.response?.data || error.message);
        alert('Authentication failed. Please try again.');
        navigate('/', { replace: true });
      }
    };

    processAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
