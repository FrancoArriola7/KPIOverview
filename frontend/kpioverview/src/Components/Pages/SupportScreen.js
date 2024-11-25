import React, { useState } from 'react';
import { Container, Row, Col, Card, FormControl, Button, Form } from 'react-bootstrap';
import { QuestionCircleFill, EnvelopeFill, PencilSquare } from 'react-bootstrap-icons';
import Header from '../Header';
import { faqs } from '../faqs'; // Importa las FAQs
import './Styles/SupportScreen.css';

const SupportCard = ({ icon: Icon, title, text, onClick }) => (
    <Card className="support-card text-center" onClick={onClick}>
        <Card.Body>
            <Card.Title className="card-title">
                <Icon size={50} /> {title}
            </Card.Title>
            <Card.Text>{text}</Card.Text>
        </Card.Body>
    </Card>
);

const FAQCard = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCard = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`faq-card ${isOpen ? 'open' : ''}`} onClick={toggleCard}>
            <div className="faq-question">
                {question}
                <span className="faq-toggle">{isOpen ? '-' : '+'}</span>
            </div>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
};

const SupportScreen = () => {
    const [showFAQs, setShowFAQs] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [email, setEmail] = useState('');
    const [complaint, setComplaint] = useState('');

    const onAuthClick = (isAuthenticated) => {
        console.log(isAuthenticated);
    };

    const toggleFAQs = () => {
        setShowFAQs(!showFAQs);
        setShowTicketForm(false);
    };

    const handleOpenTicketClick = () => {
        setShowTicketForm(!showTicketForm);
        setShowFAQs(false);  // Oculta las FAQs al abrir el Open Ticket
    };

    const handleSubmitTicket = () => {
        // Aquí puedes manejar el envío del ticket, como llamar a una API
        console.log('Email:', email);
        console.log('Complaint:', complaint);
    };

    return (
        <div style={{ position: 'relative', textAlign: 'center', color: 'black', minHeight: '100vh', backgroundColor: 'white' }}>
            <Header onAuthClick={onAuthClick} />
            <div className="search-bar">
                <h1 className="main-heading">We're here to help you!</h1>
            </div>
            <Container>
                <Row className="justify-content-center">
                    <Col md={4}>
                        <SupportCard
                            icon={QuestionCircleFill}
                            title="FAQ"
                            text="Find answers to common questions about project management, KPIs, and more."
                            onClick={toggleFAQs}
                        />
                    </Col>
                    <Col md={4}>
                        <SupportCard
                            icon={EnvelopeFill}
                            title="Open Ticket"
                            text="Need help? Open a support ticket and we'll get back to you as soon as possible."
                            onClick={handleOpenTicketClick}
                        />
                    </Col>
                    <Col md={4}>
                        <SupportCard
                            icon={PencilSquare}
                            title="Feedback"
                            text="Your feedback is important to us! Let us know how we can improve our page."
                        />
                    </Col>
                </Row>
            </Container>
            {showTicketForm && (
                <div className="ticket-form">
                    <Card className="mt-3 p-3">
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formComplaint">
                                    <Form.Label>Complaint</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter your complaint"
                                        value={complaint}
                                        onChange={(e) => setComplaint(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleSubmitTicket}>
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )}
            {showFAQs && (
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQCard key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportScreen;