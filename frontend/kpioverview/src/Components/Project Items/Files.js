import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Modal, Button, Table, Card, Select, Space, Typography, message, Progress } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { CButton } from '@coreui/react-pro';
import './Files.css';

const Files = ({ projectRAT, currentUser }) => {
  const [fileList, setFileList] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRAT, setSelectedRAT] = useState('5G');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Dragger } = Upload;
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;
  const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;

  useEffect(() => {
    fetchProjectFiles();
  }, [id]);  // Added dependency on 'id' to refetch if it changes

  const fetchProjectFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/get_files/`, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
        }
      });
      const formattedFiles = response.data.files.map((file, index) => ({
        number: index + 1,
        name: file.file_name,
        uploadedBy: file.uploaded_by__username,
        date: moment(file.upload_date).format('YYYY-MM-DD'),
        RAT: file.RAT,
        uid: `${index}`
      }));
      setFileList(formattedFiles);
      setUserRole(response.data.user_role);
    } catch (error) {
      console.error('Error fetching project files:', error);
      message.error('Failed to fetch files.');
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', id);
    formData.append('RAT', selectedRAT);


    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/projects/${id}/upload_file/`, formData, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }
      });

      if (response.data.success) {
        const newFile = {
          uid: file.uid,
          name: file.name,
          status: 'done',
          uploadedBy: currentUser,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          RAT: selectedRAT,
        };
        setFileList(currentFiles => [...currentFiles, newFile]);
        onSuccess();
        message.success('File uploaded successfully');
      } else {
        onError(response.data.message);
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      onError(error);
      message.error('Error uploading file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async (file) => {
    try {
      const response = await axios.delete(`${API_URL}/projects/${id}/delete_file/`, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
        data: { file_name: file.name }
      });
      setFileList(currentFiles => currentFiles.filter(item => item.uid !== file.uid));
      message.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      message.error('Error deleting file');
    }
  };

  const handleDownload = async (file) => {
    const fileName = encodeURIComponent(file.name);
    try {
      const response = await axios.get(`${API_URL}/projects/${id}/download_file/${fileName}/`, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('Error downloading file');
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = `${API_URL}/media/Templates/Template_4G.xlsx`;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleRATChange = (value) => {
    setSelectedRAT(value);
  }

  const showModal = () => {
    setIsModalVisible(true);
  }

  const handleModalOk = () => {
    setIsModalVisible(false);
  }

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const uploadProps = {
    beforeUpload: file => {
      const isValid = file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'text/csv';
      if (!isValid) {
        message.error('You can only upload .xlsx, .xls, or .csv files!');
      }
      return isValid || Upload.LIST_IGNORE;
    },
    onRemove: handleRemove,
    customRequest: handleUpload,
    showUploadList: false
  };

  const columns = [
    {
      title: 'File Number',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number - b.number,
      sortOrder: sortedInfo.columnKey === 'number' && sortedInfo.order,
    },
    {
      title: 'Filename',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    },
    {
      title: 'RAT',
      dataIndex: 'RAT',
      key: 'RAT',
      sorter: (a, b) => a.RAT.localeCompare(b.RAT),
      sortOrder: sortedInfo.columnKey === 'RAT' && sortedInfo.order,
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
      sorter: (a, b) => a.uploadedBy.localeCompare(b.uploadedBy),
      sortOrder: sortedInfo.columnKey === 'uploadedBy' && sortedInfo.order,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>Download</Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleRemove(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  // Configuración de rowSelection para Ant Design Table
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const dataSource = fileList.map((file, index) => ({
    ...file,
    number: index + 1,
  }));

  return (
    <div>
      <Typography.Title level={1}>Files</Typography.Title>
      <Space>
        {(userRole === 'Owner' || userRole === 'Administrator') && (
          <>
            <CButton color='primary' icon={<UploadOutlined />} onClick={showModal}>
              Upload Files
            </CButton>
            <Modal
              title="Upload File"
              visible={isModalVisible}
              onOk={handleModalOk}
              onCancel={handleModalCancel}
              footer={null}  // Quitamos el footer por defecto
            >
              <Select
                defaultValue={selectedRAT}
                className="rat-select"
                onChange={handleRATChange}
              >
                <Select.Option value="1G">1G</Select.Option>
                <Select.Option value="2G">2G</Select.Option>
                <Select.Option value="3G">3G</Select.Option>
                <Select.Option value="4G">4G</Select.Option>
                <Select.Option value="5G">5G</Select.Option>
              </Select>
              <Dragger {...uploadProps} className="file-dragger">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Drag and Drop here</p>
                <p className="ant-upload-hint">or <a href="#">Browse files</a></p>
              </Dragger>
            </Modal>
          </>
        )}
        <CButton color='secondary' icon={<FileExcelOutlined />} onClick={handleDownloadTemplate}>
          Download {projectRAT} Template
        </CButton>
        <CButton color='light' icon={<FileExcelOutlined />} >
          Show Selection
        </CButton>
      </Space>
      {uploading && <Progress percent={uploadProgress} />}
      <Card className="file-card">
        <Table
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          rowKey="uid"
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Files;