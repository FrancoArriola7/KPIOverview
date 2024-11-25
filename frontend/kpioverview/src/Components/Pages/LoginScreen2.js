import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Message from '../Message';
import axios from 'axios';
import './Styles/LoginScreen2.css';
import { FaUser, FaLock, FaRegEye, FaRegEyeSlash, FaEnvelope } from "react-icons/fa";

const LoginScreen2 = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const errRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('login'); // 'login' o 'forgotPassword'

  const API_URL = process.env.REACT_APP_API_URL;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/token/`, { username, password });
      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        login();
        navigate('/home');
      } else {
        setError('Invalid username or password');
        if (errRef.current) {
          errRef.current.focus();
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Username or Password is incorrect.');
      } else if (error.response && error.response.status === 401) {
        setError('Authentication failed. Please check your username and password.');
      } else {
        setError('An unexpected error occurred while logging in. Please try again later.');
      }
      if (errRef.current) {
        errRef.current.focus();
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.post(`${API_URL}/dj-rest-auth/password/reset/`, {
            email: email  // Asegúrate de que esta variable refleja el estado actual del correo electrónico ingresado
        });
        if (response.data.detail) {
            // Mensaje de éxito de Django rest auth que puedes mostrar
            setError(response.data.detail);
        } else {
            // Manejo por si acaso la respuesta no es como esperabas
            setError("An unexpected response was received. Please try again.");
        }
    } catch (error) {
        if (error.response && error.response.data) {
            setError(error.response.data.error || "Failed to send password reset email.");
        } else {
            setError("Network error. Please check your internet connection and try again.");
        }
        console.error("Forgot Password Error:", error);
    } finally {
        setLoading(false);
    }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='loginScreen2'>
      <div className='wrapper'>
        {view === 'login' ? (
          <form onSubmit={submitHandler}>
            <h1>Login</h1>
            <div className='input-box'>
              <input
                type='text'
                placeholder='Enter username'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className='icon' />
            </div>
            <div className='input-box'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className='icon' />
              <div className='icon eye-icon' onClick={togglePasswordVisibility}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
            {error && <Message>{error}</Message>}
            <div className='remember-forgot'>
              <label><input type='checkbox' />Remember Me</label>
              <a href='#' onClick={() => setView('forgotPassword')}>Forgot Password</a>
            </div>
            <button type='submit' disabled={loading}>Login</button>

            <div className='register-link'>
              <p>Don't have an account? <a href='/signup'>Register</a></p>
            </div>
          </form>

        ) : (
          <form onSubmit={forgotPasswordHandler}>
            <h1>Reset Password</h1>
            <div className='input-box'>
              <input
                type='email'
                placeholder='Enter your email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className='icon' />
            </div>
            <button type='submit' disabled={loading}>Send Reset Link</button>
            <a href='#' className='back-to-login' onClick={() => setView('login')}>Back to Login</a>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen2;