import React, { useState, useEffect } from 'react';
import { CSmartTable, CButton, CCollapse, CCardBody } from '@coreui/react-pro';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import ReactFlagsSelect from 'react-flags-select';
import { COUNTRIES } from '../lib/Countries';
import './Pages/Styles/SupportScreen.css'; // Importa el archivo CSS aquí

const ProjectsTable = () => {
  const [details, setDetails] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Estado para el proyecto seleccionado
  const [projectName, setProjectName] = useState('');
  const [country, setCountry] = useState('');
  const [owner, setOwner] = useState(''); // Nuevo estado para el propietario
  const [members, setMembers] = useState([]); // Nuevo estado para los miembros
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;
  const CREATE_PROJECT_ENDPOINT = process.env.REACT_APP_CREATE_PROJECT_ENDPOINT;

  useEffect(() => {
    fetchProjects();
    fetchMembers(); // Llamada para obtener los miembros al cargar el componente
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/`, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      });
      const data = response.data;
      const mappedData = data.map((project) => ({
        id: project.project_id,
        name: project.project_name,
        registered: project.creation_date,
        role: project.role,
      }));
      setProjectsData(mappedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchMembers = async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/members/`, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleCountryChange = (code) => {
    setCountry(code);
  };

  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };

  const validateForm = () => {
    if (!projectName || !country) {
      setError('Please fill in all fields');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post(
        `${CREATE_PROJECT_ENDPOINT}`,
        {
          project_name: projectName,
          country: country,
          owner: owner, // Incluye el propietario en la solicitud de creación de proyecto
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 201) {
        throw new Error('Failed to create project');
      }
      setSuccessMessage('Your project has been created successfully!');
      setProjectName('');
      setCountry('');
      setOwner(''); // Restablece el propietario después de la creación
      fetchProjects(); // Refresh projects list
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again later.');
    }
  };

  const toggleDetails = (id) => {
    const position = details.indexOf(id);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [id];
    }
    setDetails(newDetails);
  };

  const deleteProject = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/projects/${id}/delete_project/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      });
      if (response.status === 204) {
        setProjectsData(projectsData.filter((project) => project.id !== id));
        alert('Project successfully deleted');
      } else {
        throw new Error('Failed to delete the project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again later.');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Project Name',
      _style: { width: '20%' },
    },
    {
      key: 'registered',
      label: 'Created On',
    },
    {
      key: 'role',
      _style: { width: '20%' },
    },
    {
      key: 'show_details',
      label: 'Actions',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
  };

  const openConfirmModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProject(selectedProjectId);
    setIsConfirmModalOpen(false);
  };

  const handleOpenSettingsModal = (projectId) => {
    console.log('Selected Project ID:', projectId); // Depuración
    fetchMembers(projectId); // Obtener los miembros del proyecto cuando se abre el modal de configuración
    setSelectedProjectId(projectId); // Establecer el ID del proyecto seleccionado
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => setIsSettingsModalOpen(false); // Función para cerrar modal de configuración

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/projects/${selectedProjectId}/update/`, // Asegúrate de que esta URL sea correcta
        {
          project_name: projectName,
          country: country,
          owner: owner,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 200) {
        throw new Error('Failed to update project');
      }
      setSuccessMessage('Project updated successfully!');
      fetchProjects(); // Refrescar la lista de proyectos
      handleCloseSettingsModal(); // Cerrar el modal después de una actualización exitosa
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project. Please try again later.');
    }
  };


  return (
    <div style={{ position: 'relative' }}>
      <CButton
        color="primary"
        className="mb-3"
        style={{ position: 'absolute', top: '0px', right: '0px' }}
        onClick={handleOpenModal}
      >
        New Project
      </CButton>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: 'none',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px',
            outline: 'none',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="px-4">
            <div className="mb-4">
              <label htmlFor="project-name" className="block text-gray-700 font-bold mb-1">
                Project Name:
              </label>
              <input
                type="text"
                id="project-name"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
                value={projectName}
                onChange={handleNameChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700 font-bold mb-1">
                Country:
              </label>
              <ReactFlagsSelect
                countries={COUNTRIES.map((country) => country.value)}
                selected={country}
                onSelect={handleCountryChange}
                placeholder="Select Country"
                searchable
                searchPlaceholder="Search Countries"
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <CButton color="dark" type="submit">
              Create Project
            </CButton>
          </form>
        </Box>
      </Modal>

      <CSmartTable
        activePage={2}
        cleaner
        columns={columns}
        columnFilter
        columnSorter
        footer
        items={projectsData}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        onFilteredItemsChange={(items) => {
          console.log(items);
        }}
        onSelectedItemsChange={(items) => {
          console.log(items);
        }}
        scopedColumns={{
          name: (item) => (
            <td>
              <Link to={`/projects/${item.id}/dashboard`} className="custom-link">
                {item.name}
              </Link>
            </td>
          ),
          show_details: (item) => {
            return (
              <td className="py-2">
                {item.role === 'Owner' && (
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    {details.includes(item.id) ? 'Hide' : 'Show'}
                  </CButton>
                )}
              </td>
            );
          },
          details: (item) => {
            return (
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody className="p-3">
                  <h4>{item.eNodeBName}</h4>
                  <CButton size="sm" color="info" onClick={() => handleOpenSettingsModal(item.id)}>
                    Project Settings
                  </CButton>
                  <CButton size="sm" color="danger" onClick={() => openConfirmModal(item.id)}>
                    Delete Project
                  </CButton>
                </CCardBody>
              </CCollapse>
            );
          },
        }}
        tableFilter
        tableProps={{
          className: 'add-this-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
      />
      {/* Modal de Configuración */}
      <Modal
        open={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
        aria-labelledby="settings-modal-title"
        aria-describedby="settings-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: 'none',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px',
            outline: 'none',
          }}
        >
          <h2 id="settings-modal-title" className="text-2xl font-bold mb-4">
            Project Settings
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Cambiar el nombre del proyecto */}
            <div className="mb-4">
              <label htmlFor="project-name" className="block text-gray-700 font-bold mb-1">
                Project Name:
              </label>
              <input
                type="text"
                id="project-name"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
                value={projectName}
                onChange={handleNameChange}
              />
            </div>

            {/* Cambiar el país */}
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700 font-bold mb-1">
                Country:
              </label>
              <ReactFlagsSelect
                selected={country}
                onSelect={handleCountryChange}
                placeholder="Select Country"
                searchable
                searchPlaceholder="Search Countries"
                className="w-full"
              />
            </div>

            {/* Transferir la propiedad */}
            <div className="mb-4">
              <label htmlFor="owner" className="block text-gray-700 font-bold mb-1">
                Transfer Ownership:
              </label>
              <select
                id="owner"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
                value={owner}
                onChange={handleOwnerChange}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de guardar */}
            <div className="flex justify-end">
              <CButton color="primary" type="submit">
                Save Changes
              </CButton>
              <CButton color="secondary" onClick={handleCloseSettingsModal} style={{ marginLeft: '10px' }}>
                Cancel
              </CButton>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: 'none',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px',
            outline: 'none',
          }}
        >
          <h2 id="confirm-modal-title" className="text-2xl font-bold mb-4">
            Are you sure you want to delete this project?
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center', // Centra los botones horizontalmente
              gap: '10px', // Agrega separación entre los botones
              marginTop: '20px' // Agrega un margen superior para separar los botones del texto
            }}
          >
            <CButton color="danger" onClick={handleConfirmDelete}>
              Yes
            </CButton>
            <CButton color="secondary" onClick={() => setIsConfirmModalOpen(false)}>
              No
            </CButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ProjectsTable;
