import React from 'react';
import Header from '../Header'; // Asegúrate de que la ruta es correcta

function HomeScreen() {
  const onAuthClick = (isAuthenticated) => {
    // Lógica de autenticación, si es necesaria
    console.log(isAuthenticated);
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center', color: 'black', minHeight: '100vh', backgroundColor: 'white' }}>
      <Header onAuthClick={onAuthClick} />
      <div style={{ padding: '50px' }}>
        <h1>Welcome to our Data Visualization Platform!</h1>
        <p>Visualize your data like never before.</p>
        <p>Simply upload an Excel or .CSV file and start exploring your KPIs.</p>
      </div>
    </div>
  );
}

export default HomeScreen;