import React, { useState, useEffect } from 'react';
import { CSmartTable, CButton, CCollapse, CCardBody } from '@coreui/react-pro';
import { useParams } from 'react-router-dom';
import { Typography, Modal, Input, List, Button as AntButton } from 'antd';

const Members = () => {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [details, setDetails] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/members/`, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data.members);
      setUserRole(data.user_role);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/users/?search=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/members/add_member`, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Failed to add member');
        return;
      }
      setShowAddMember(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchMembers();  // Refresh members list
    } catch (error) {
      console.error('Error adding member:', error);
      setErrorMessage('Error adding member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/members/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (!response.ok) {
        throw new Error('Failed to remove member');
      }
      fetchMembers();  // Refresh members list
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handlePromoteMember = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/members/set_admin`, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (!response.ok) {
        throw new Error('Failed to promote member');
      }
      fetchMembers();  // Refresh members list
    } catch (error) {
      console.error('Error promoting member:', error);
    }
  };

  const handleDemoteMember = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/members/remove_admin`, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (!response.ok) {
        throw new Error('Failed to demote member');
      }
      fetchMembers();  // Refresh members list
    } catch (error) {
      console.error('Error demoting member:', error);
    }
  };

  const handleCloseErrorModal = () => {
    setErrorMessage('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <Typography.Title level={1}>Members</Typography.Title>
      {(userRole === 'Owner' || userRole === 'Administrator') && (
        <CButton
          color="primary"
          className="mb-3"
          style={{ position: 'absolute', top: '64px', right: '40px' }}
          onClick={() => setShowAddMember(true)}
        >
          Add Member
        </CButton>
      )}
      <CSmartTable
        activePage={1}
        cleaner
        clickableRows
        columns={[
          { key: 'id', label: 'User ID' },
          { key: 'username', label: 'Username' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'actions', label: 'Actions', _style: { width: '15%' } }
        ]}
        columnFilter
        columnSorter
        footer
        items={members}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        scopedColumns={{
          actions: (item) => (
            <td className="py-2">
              {(userRole === 'Owner' || userRole === 'Administrator') && (
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => toggleDetails(item.id)}
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              )}
            </td>
          ),
          details: (item) => (
            <CCollapse visible={details.includes(item.id)}>
              <CCardBody className="p-3">
                <h4>{item.username}</h4>
                <p>Email: {item.email}</p>
                <p>Role: {item.role}</p>
                {(userRole === 'Owner' || userRole === 'Administrator') && (
                  <>
                    {item.role !== 'Administrator' ? (
                      <CButton
                        size="sm"
                        color="info"
                        style={{ marginRight: '5px' }}
                        onClick={() => handlePromoteMember(item.id)}
                      >
                        Set Administrator
                      </CButton>
                    ) : (
                      <CButton
                        size="sm"
                        color="warning"
                        style={{ marginRight: '5px' }}
                        onClick={() => handleDemoteMember(item.id)}
                      >
                        Remove Administrator
                      </CButton>
                    )}
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleRemoveMember(item.id)}
                    >
                      Kick Member
                    </CButton>
                  </>
                )}
              </CCardBody>
            </CCollapse>
          ),
        }}
        tableFilter
        tableProps={{
          className: 'add-this-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle'
        }}
      />

      <Modal
        title="Add Member"
        open={showAddMember}
        onCancel={() => setShowAddMember(false)}
        footer={null}
      >
        <Input.Search
          placeholder="Search user"
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
        <List
          itemLayout="horizontal"
          dataSource={searchResults}
          renderItem={item => (
            <List.Item
              actions={[<AntButton onClick={() => handleAddMember(item.id)}>Add</AntButton>]}
            >
              <List.Item.Meta
                title={item.username}
                description={item.email}
              />
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title="Error"
        open={!!errorMessage}
        onCancel={handleCloseErrorModal}
        footer={[
          <AntButton key="close" onClick={handleCloseErrorModal}>
            Close
          </AntButton>
        ]}
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default Members;


