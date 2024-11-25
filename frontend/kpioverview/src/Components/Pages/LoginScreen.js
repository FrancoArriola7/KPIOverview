import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Message from '../Message';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const errRef = useRef(null);

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
        login();  // Llamada a la función login del contexto
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Container style={{ marginTop: '20px' }}>
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <Card>
              <Card.Header as='h3' className='text-center bg-black text-light'>
                Login
              </Card.Header>
              <Card.Body>
                {error && <Message variant='danger'>{error}</Message>}
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                        <RemoveRedEyeOutlinedIcon />
                      </Button>
                      </div>
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button className='btn btn-md btn-dark' type='submit' disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
    </>
  );
}

export default LoginScreen;