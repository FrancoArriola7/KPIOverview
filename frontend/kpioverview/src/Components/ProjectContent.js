import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Dashboard from './Project Items/Dashboard';
import Files from './Project Items/Files';
import Sites from './Project Items/Sites';
import Members from './Project Items/Members';
import KPIs from './Project Items/KPIs';


const ProjectContent = ({ projectData, loading }) => {
  const { id } = useParams();
  const location = useLocation();

  let content;

  switch (location.pathname) {
    case `/projects/${id}/dashboard`:
      content = <Dashboard projectData={projectData} loading={loading} />;
      break;
    case `/projects/${id}/files`:
      content = <Files projectData={projectData} loading={loading} />;
      break;
    case `/projects/${id}/sites`:
      content = <Sites projectData={projectData} loading={loading} />;
      break;
    case `/projects/${id}/members`:
      content = <Members projectData={projectData} loading={loading} />;
      break;
    case `/projects/${id}/kpis`:
      content = <KPIs projectData={projectData} loading={loading} />;
      break;
    default:
      content = <div>Welcome! Select an option from the menu.</div>;
  }

  return (
    <div className="ProjectContent">
      {content}
    </div>
  );
};

export default ProjectContent;