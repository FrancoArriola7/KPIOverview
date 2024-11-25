import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Message from '../Message';
import axios from 'axios';
import './Styles/LoginScreen2.css'; // Utilizando el mismo estilo que LoginScreen2
import { FaUser, FaLock, FaRegEye, FaRegEyeSlash, FaEnvelope } from "react-icons/fa";

const SignupScreen2 = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  function isPasswordValid(password) {
    if (password.length < 8) {
      return false;
    }

    if (!/[a-z]/.test(password)) {
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      return false;
    }

    if (!/\d/.test(password)) {
      return false;
    }

    if (!/[@$!%*?&]/.test(password)) {
      return false;
    }

    return true;
  }

  function validateForm() {
    if (!fname || !lname || !email || !pass1 || !pass2) {
      setError('Please fill in all fields');
      return false;
    }

    if (!isPasswordValid(pass1)) {
      setError('Password must meet the requirements!');
      return false;
    }

    if (pass1 !== pass2) {
      setError('Passwords don\'t match!');
      return false;
    }

    return true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const username = email.split('@')[0];

    try {
      const response = await axios.post(`${API_URL}/signup/`, { fname, lname, email, password: pass1, username });
      if (response.status === 200) {
        console.log('Registration successful!');
        navigate('/login');
        return;
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const handlePass1Click = () => {
    setShowPasswordCriteria(true);
    setPasswordFocused(true);
  };

  const handlePass2Click = () => {
    setShowPasswordCriteria(true);
    setPasswordFocused(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePassBlur = () => {
    setShowPasswordCriteria(false);
    setPasswordFocused(false);
  };

  return (
    <div className='loginScreen2'>
      <div className='wrapper'>
        <form onSubmit={submitHandler}>
          <h1>Register</h1>
          <div className='input-box'>
            <input
              type='text'
              placeholder='Enter First Name'
              required
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input
              type='text'
              placeholder='Enter Last Name'
              required
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
            <FaUser className='icon' />
          </div>
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
          <div className='input-box'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              required
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
              onClick={handlePass1Click}
              onBlur={handlePassBlur}
            />
            <FaLock className='icon' />
            <div className='icon eye-icon' onClick={togglePasswordVisibility}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
          </div>
          <div className='input-box'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Repeat your password'
              required
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              onClick={handlePass2Click}
              onBlur={handlePassBlur}
            />
            <FaLock className='icon' />
            <div className='icon eye-icon' onClick={togglePasswordVisibility}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
          </div>
          {showPasswordCriteria && (
            <div className="password-criteria mt-2">
              <ul>
                <li>At least 8 characters</li>
                <li>At least one lowercase letter</li>
                <li>At least one uppercase letter</li>
                <li>At least one digit</li>
                <li>At least one special character (@$!%*?&)</li>
              </ul>
            </div>
          )}
          {error && <Message variant='danger'>{error}</Message>}
          <button type='submit' disabled={loading}>Register</button>

          <div className='login-link'>
            <p>Already have an account? <a href='/login'>Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen2;
