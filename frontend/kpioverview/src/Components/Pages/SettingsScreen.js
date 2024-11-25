import React from 'react';
import Header from '../Header';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const onAuthClick = (isAuthenticated) => {
  // Lógica de autenticación, si es necesaria
  console.log(isAuthenticated);
};
function SettingsScreen() {
  return (
    <div style={{ position: 'relative', textAlign: 'center', color: 'black', minHeight: '100vh', backgroundColor: 'white' }}>
      <Header onAuthClick={onAuthClick} />

      <div style={{ padding: '50px' }}>
        <h1>Settings</h1>
        <p>This wont be finished</p>
      </div>
    </div>
  );
}

export default SettingsScreen;