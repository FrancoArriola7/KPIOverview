import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Message from '../Message';
import axios from 'axios';
import Footer from '../Footer';

function SignupScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState('');
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
    <>
      <Container style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <Card>
              <Card.Header as='h1' className='text-center bg-black text-light'>
                Signup
              </Card.Header>
              <Card.Body>
                {error && <Message variant='danger'>{error}</Message>}
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="fname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter First Name" name="fname" value={fname} onChange={(e) => setFname(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="lname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Last Name" name="lname" value={lname} onChange={(e) => setLname(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="pass1">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={pass1}
                        onChange={(e) => setPass1(e.target.value)}
                        onClick={handlePass1Click}
                        onBlur={handlePassBlur}
                        required
                      />
                      <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                        <RemoveRedEyeOutlinedIcon />
                      </Button>
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
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="pass2">
                    <Form.Label>Confirm Password</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        name="password"
                        value={pass2}
                        onChange={(e) => setPass2(e.target.value)}
                        onClick={handlePass2Click}
                        onBlur={handlePassBlur}
                        required />
                    </div>
                  </Form.Group>

                  <br />
                  <div className="d-grid gap-2">
                    <Button className='btn btn-md btn-dark' type='submit'>Register</Button>
                  </div>
                </Form>

                <Row className='py-3'>
                  <Col>
                    Already Have an Account?
                    <Link to='/login'>Login</Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SignupScreen;
