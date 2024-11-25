import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import SideBar from '../SideBar';
import ProjectContent from '../ProjectContent';
import { Space } from 'antd';
import '../../App.css';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({});
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;

  useEffect(() => {
    const fetchProjectKPI = async () => {
      try {
        const response = await fetch(`${API_URL}/projects/${id}/get_kpis/`, {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setProjectData(data);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectKPI();
  }, [id]);

  const handleMenuClick = (key) => {
    navigate(`/projects/${id}${key}`);
  };

  const onAuthClick = (isAuthenticated) => {
    // Lógica de autenticación, si es necesaria
    console.log(isAuthenticated);
  };

  return (
    <>
      <Header onAuthClick={onAuthClick} />
      <Space className='SideMenuAndPageContent'>
        <SideBar onMenuClick={handleMenuClick} />
        <ProjectContent projectData={projectData} loading={loading} />
      </Space>
    </>
  );
}