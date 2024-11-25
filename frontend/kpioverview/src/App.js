import React from 'react';
import { RouterProvider } from 'react-router-dom';
import RouterConfig from './Router'; // Importa el RouterConfig en lugar de router
import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider

function App() {
  return (
    <AuthProvider>
      <RouterConfig />
    </AuthProvider>
  );
}

export default App;
