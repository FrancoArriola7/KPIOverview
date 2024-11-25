import React from 'react';
import ProjectsTable from '../ProjectsTable'; // Asegúrate de que el nombre esté en PascalCase
import Header from '../Header';
import Footer from '../Footer';

function ViewProjects() {
  // Define los datos para la tabla
  const onAuthClick = (isAuthenticated) => {
    // Lógica de autenticación, si es necesaria
    console.log(isAuthenticated);
  };

  return (
    <>
      <Header onAuthClick={onAuthClick} />
      <div className="container">
        <div className="projects-container"> {/* Contenedor blanco redondeado */}
          {/* Pasa los datos como una prop al componente ProjectsTable */}
          <ProjectsTable />
        </div>
      </div>
    </>

  );
}

export default ViewProjects;
