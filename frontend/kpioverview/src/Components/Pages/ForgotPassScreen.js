import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { EnvelopeFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ForgotPassScreen = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el email de recuperación
    // Por ahora, simulemos un error para demostrar el mensaje de error
    setError('We cannot find your email.');
    setMessage('');
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <EnvelopeFill size={50} className="text-primary" />
                <h3 className="mt-2">Password Recovery</h3>
                <p>Enter your email and we'll send you a link to reset your password.</p>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">
                  Submit
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button variant="link" onClick={() => navigate('/login')}>
                  &larr; Back to Login
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassScreen;
