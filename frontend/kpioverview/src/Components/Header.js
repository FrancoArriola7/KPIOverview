import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, Dropdown, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HuaweiLogo from '../assets/Huawei.png';
import './Header.css';
import { useAuth } from '../context/AuthContext';

// Asignar variables de entorno a constantes
const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;

function Header({ onAuthClick }) {
  const { isAuthenticated, logout } = useAuth();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: 'path_to_avatar_steve',
      message: 'Steve sent you a message',
      description: 'Bro, We raised $1M 🎉. Let\'s party tonight 🥳',
      time: '3 minutes ago',
      read: false
    },
    {
      id: 2,
      avatar: 'path_to_photo_thumbnail',
      message: 'Your photo is getting popular 🎉',
      description: 'Your photo was liked by 1000+ people in the last one hour!',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 3,
      avatar: 'path_to_avatar_jack',
      message: 'Jack commented on your photo',
      description: 'Wow, you look so pretty! 😍',
      time: '13 minutes ago',
      read: false
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    onAuthClick(!!token);
  }, [isAuthenticated, onAuthClick]);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!refreshToken || !accessToken) {
        console.error('Tokens not found');
        return;
      }

      await axios.post(
        `${API_URL}/logout/`,
        { refresh_token: refreshToken },
        {
          headers: {
            'Authorization': `JWT ${accessToken}`
          }
        }
      );

      // Llamar a la función logout del contexto de autenticación
      logout();

      // Redirigir a la página de login usando useNavigate
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error.response?.data || error.message);
    }
  };

  const handleNotificationsClick = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  return (
    <>
      <Navbar className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          <LinkContainer to='/'>
            <Nav.Link className="navbar-brand">
              <img src={HuaweiLogo} alt="Huawei Logo" style={{ height: '40px' }} />
            </Nav.Link>
          </LinkContainer>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor02">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <LinkContainer to='/home'>
                  <Nav.Link className="navbar-link-active">Home</Nav.Link>
                </LinkContainer>
              </li>
              <li className="nav-item">
                <LinkContainer to='/projects'>
                  <Nav.Link className="nav-link">Projects</Nav.Link>
                </LinkContainer>
              </li>
              <li className="nav-item">
                <LinkContainer to='/settings'>
                  <Nav.Link className="nav-link">Settings</Nav.Link>
                </LinkContainer>
              </li>
              <li className="nav-item">
                <LinkContainer to='/support'>
                  <Nav.Link className="nav-link">Support</Nav.Link>
                </LinkContainer>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Dropdown show={showNotificationsDropdown} onToggle={handleNotificationsClick}>
                  <Dropdown.Toggle as={CustomToggle}>
                    <Badge badgeContent={unreadNotificationsCount} color="secondary">
                      <NotificationsIcon style={{ color: 'white' }} />
                    </Badge>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" className="notifications-dropdown">
                    <Dropdown.Header>
                      Notifications
                      <Button variant="link" onClick={handleMarkAllAsRead}>
                        Mark all as read
                      </Button>
                    </Dropdown.Header>
                    {notifications.length === 0 ? (
                      <Dropdown.Item className="text-center">No notifications</Dropdown.Item>
                    ) : (
                      notifications.map(notification => (
                        <Dropdown.Item key={notification.id}>
                          <div className={`notification-item ${notification.read ? 'read' : ''}`}>
                            <img src={notification.avatar} alt="Avatar" className="avatar" />
                            <div className="notification-content">
                              <strong>{notification.message}</strong>
                              <p>{notification.description}</p>
                              <small>{notification.time}</small>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li className="nav-item">
                <a className="nav-link btn btn-outline-light text-light" href="/login" onClick={handleLogout}>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Navbar>
    </>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
  >
    {children}
  </div>
));

export default Header;
