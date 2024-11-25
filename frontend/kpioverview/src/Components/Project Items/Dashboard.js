import React, { useEffect, useState } from 'react';
import { Card, DatePicker, Space, Typography, Row, Col, Skeleton, Modal, Button, Statistic } from 'antd';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { InsertChartOutlined as InsertChartIcon, CellTowerOutlined as CellTowerIcon, DriveFolderUploadOutlined as DriveFolderUploadIcon, GroupOutlined as GroupIcon, VisibilityOffOutlined as VisibilityOffIcon, FullscreenOutlined as FullscreenIcon, ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material';
import { LineChartOutlined, BarChartOutlined, AreaChartOutlined} from '@ant-design/icons';
import moment from 'moment';
import {CButton } from '@coreui/react-pro';
import '../../App.css';

const COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
  '#393b79', '#637939', '#8c6d31', '#843c39', '#7b4173', '#a55194', '#e7ba52', '#17becf', '#9c9ede', '#8ca252',
  '#bd9e39', '#ad494a', '#d6616b', '#e7969c', '#e7cb94', '#7f7f7f', '#c7c7c7', '#c5b0d5', '#8c564b', '#ffbb78',
  '#aec7e8', '#ff9896', '#98df8a', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
];

const Dashboard = ({ projectData, loading }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [kpiData, setKpiData] = useState({});
  const [visibleKpis, setVisibleKpis] = useState([]);
  const [fullscreenKpi, setFullscreenKpi] = useState(null);
  const [pointModalVisible, setPointModalVisible] = useState(false);
  const [pointModalContent, setPointModalContent] = useState({});
  const [technology, setTechnology] = useState('4G');
  const [selectedChartTypes, setSelectedChartTypes] = useState({});
  const [opacity, setOpacity] = useState({});
  const [siteVisibility, setSiteVisibility] = useState({});

  useEffect(() => {
    if (projectData.data) {
      const data = projectData.data;

      const filteredData = Object.keys(data).reduce((acc, kpi) => {
        acc[kpi] = Object.keys(data[kpi]).reduce((siteAcc, site) => {
          siteAcc[site] = data[kpi][site].filter(entry => {
            const entryDate = moment(entry.date, 'YYYY-MM-DD');
            return (!startDate || entryDate.isSameOrAfter(startDate)) && (!endDate || entryDate.isSameOrBefore(endDate));
          }).map(entry => ({
            ...entry,
            date: moment(entry.date).format('YYYY-MM-DD')
          }));
          return siteAcc;
        }, {});
        return acc;
      }, {});
      setKpiData(filteredData);
      setVisibleKpis(Object.keys(filteredData));
    }
  }, [projectData, startDate, endDate]);

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  const handleToggleKpi = (kpi) => {
    if (visibleKpis.includes(kpi)) {
      setVisibleKpis(visibleKpis.filter(visibleKpi => visibleKpi !== kpi));
    } else {
      setVisibleKpis([...visibleKpis, kpi]);
    }
  };

  const handleFullscreen = (kpi) => {
    setFullscreenKpi(kpi);
  };

  const handleCloseFullscreen = () => {
    setFullscreenKpi(null);
  };

  const handleResetKpis = () => {
    setVisibleKpis(Object.keys(kpiData));
  };

  const handleTechnologyChange = (e) => {
    setTechnology(e.target.value);
  };

  const handlePointClick = (data, lineIndex) => {
    const { date } = data;
    const site = Object.keys(kpiData)[lineIndex];
    const value = data[site];
    if (value) {
      setPointModalContent({ date, value, site });
      setPointModalVisible(true);
    }
  };

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  const onPointClick = (data, index) => {
    const { date } = data;
    const site = Object.keys(kpiData)[index];
    const value = data[site];
    if (value) {
      setPointModalContent({ date, value, site });
      setPointModalVisible(true);
    }
  };

  

  const renderFullscreenKpi = () => {
    if (!fullscreenKpi) return null;

    const currentKpiIndex = visibleKpis.indexOf(fullscreenKpi);
    const prevKpi = visibleKpis[(currentKpiIndex - 1 + visibleKpis.length) % visibleKpis.length];
    const nextKpi = visibleKpis[(currentKpiIndex + 1) % visibleKpis.length];
    const kpiDetails = kpiData[fullscreenKpi];
    const chartType = selectedChartTypes[fullscreenKpi] || 'line';

    const handleBarMouseOver = (data, index) => {
      const bars = document.querySelectorAll('.recharts-bar-rectangle');
      if (bars[index]) {
        bars[index].style.fillOpacity = '0.7';
      }
    };

    const handleBarMouseOut = (data, index) => {
      const bars = document.querySelectorAll('.recharts-bar-rectangle');
      if (bars[index]) {
        bars[index].style.fillOpacity = '1';
      }
    };

    const handleLegendMouseEnter = (o) => {
      const { value } = o;
      setOpacity({ ...opacity, [value]: 1 });
    };
  
    const handleLegendMouseLeave = () => {
      setOpacity({});
    };

    const handleToggleLegend = (o) => {
      const { value } = o.payload;
      setOpacity((prevOpacity) => {
        const newOpacity = { ...prevOpacity };
        newOpacity[value] = newOpacity[value] === 0.5 ? 1 : 0.5;
        return newOpacity;
      });
    };

    const formattedData = Object.keys(kpiDetails).reduce((acc, site) => {
      kpiDetails[site].forEach(point => {
        const date = moment(point.date).format('YYYY-MM-DD');
        if (!acc[date]) acc[date] = { date };
        acc[date][site] = point.value;
      });
      return acc;
    }, {});

    const formattedDataArray = Object.values(formattedData);

    const renderChart = () => {
      switch (chartType) {
        case 'bar':
      return (
        <BarChart data={formattedDataArray}>
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleToggleLegend}
          />
          {Object.keys(kpiDetails).map((site, index) => (
            <Bar
              key={index}
              dataKey={site}
              name={site}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={opacity[site] !== undefined ? opacity[site] : 1}
              onMouseOver={() => handleMouseEnter({ dataKey: site })}
              onMouseOut={() => handleMouseLeave({ dataKey: site })}
            />
          ))}
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={{ fill: 'rgba(128, 128, 128, 0.3)' }}
            formatter={(value) => (value != null ? value : '')}
            labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              color: 'black',
              opacity: 0.9
            }}
            wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
          />
        </BarChart>
          );
        case 'area':
          return (
            <AreaChart data={formattedDataArray}>
              <Legend onClick={(e) => handleToggleLegend(e)} />
              {Object.keys(kpiDetails).map((site, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={site}
                  name={site}
                  stroke={COLORS[index % COLORS.length]}
                  fillOpacity={opacity[site] !== undefined ? opacity[site] : 1}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                cursor={{ fill: 'rgba(128, 128, 128, 0.3)' }}
                formatter={(value) => (value != null ? value : '')}
                labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #ccc', // Agrega un borde leve
                  borderRadius: '4px', // Bordes redondeados
                  color: 'black',
                  opacity: 0.9
                }}
                wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
              />
            </AreaChart>
          );
        default:
          return (
            <LineChart data={formattedDataArray}>
              <Legend onClick={(e) => handleToggleLegend(e)} />
              {Object.keys(kpiDetails).map((site, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={site}
                  name={site}
                  stroke={COLORS[index % COLORS.length]}
                  strokeOpacity={opacity[site] !== undefined ? opacity[site] : 1}
                  onClick={(e) => onPointClick(e, index)}
                />
              ))}
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                cursor={{ fill: 'rgba(128, 128, 128, 0.3)' }}
                formatter={(value) => (value != null ? value : '')}
                labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #ccc', // Agrega un borde leve
                  borderRadius: '4px', // Bordes redondeados
                  color: 'black',
                  opacity: 0.9
                }}
                wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
              />
            </LineChart>
          );
      }
    };

    return (
      <Modal
        title={fullscreenKpi}
        open={fullscreenKpi !== null}
        onCancel={handleCloseFullscreen}
        footer={null}
        width={1000}
        styles={{ body: { height: '80vh', position: 'relative' } }}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setFullscreenKpi(prevKpi)}
            style={{ position: 'absolute', left: -50, top: '50%', zIndex: 1000 }}
          />
          <Button
            icon={<ArrowRightOutlined />}
            onClick={() => setFullscreenKpi(nextKpi)}
            style={{ position: 'absolute', right: -50, top: '50%', zIndex: 1000 }}
          />
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </Modal>
    );
  };


  const handleShowPredictions = () => {
    // Lógica para obtener y mostrar las predicciones
    console.log("Predictions will be shown!");
    // Aquí puedes hacer la llamada al backend para obtener las predicciones o habilitar la visualización
  };

  return (
    <div>
      <Typography.Title level={1}>
        {projectData.project_name ? `${projectData.project_name} - Dashboard` : 'Dashboard'}
      </Typography.Title>      <Space direction="horizontal">
        <DashboardCard icon={<InsertChartIcon />} title="KPIs" value={visibleKpis.length} />
        <DashboardCard icon={<CellTowerIcon />} title="Sites" value={projectData.num_sites} />
        <DashboardCard icon={<DriveFolderUploadIcon />} title="Files" value={projectData.num_files} />
        <DashboardCard icon={<GroupIcon />} title="Members" value={projectData.num_members} />

        <Card>
          <Space direction="vertical">
            Start Date
            <DatePicker onChange={handleStartDateChange} />
          </Space>
        </Card>
        <Card>
          <Space direction="vertical">
            End Date
            <DatePicker onChange={handleEndDateChange} />
          </Space>
        </Card>
        <Space direction="vertical">
          <CButton 
            color="light" 
            onClick={handleResetKpis} 
            style={{ width: '100%', marginBottom: '10px' }}
          >
            Reset KPIs
          </CButton>
          <CButton
            onClick={handleShowPredictions}
            color='light'
          >
          Show Predictions
          </CButton>
        </Space>
      </Space>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Col span={8} key={index} style={{ marginBottom: 16 }}>
              <Card>
                <Skeleton.Input active style={{ width: 200, height: 30, marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))
        ) : Object.keys(kpiData).length === 0 ? (
          <Typography.Title level={4} style={{ marginTop: 20 }}>No data available.</Typography.Title>
        ) : (
          visibleKpis.map((kpi, index) => (
            <Col span={8} key={index} style={{ marginBottom: 16 }}>
              <KpiCard
                title={kpi}
                data={kpiData[kpi]}
                onToggle={() => handleToggleKpi(kpi)}
                onFullscreen={() => handleFullscreen(kpi)}
                loading={loading}
                onPointClick={handlePointClick}
                selectedChartTypes={selectedChartTypes}
                setSelectedChartTypes={setSelectedChartTypes}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            </Col>
          ))
        )}
      </Row>

      {renderFullscreenKpi()}

      <Modal
        title="Point Information"
        open={pointModalVisible}
        onCancel={() => setPointModalVisible(false)}
        footer={null}
      >
        <p>Date: {pointModalContent.date}</p>
        <p>Value: {pointModalContent.value}</p>
        <p>Site: {pointModalContent.site}</p>
      </Modal>
    </div>
  );
};

const DashboardCard = ({ icon, title, value }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object') {
      return 'N/A'; // Or any other appropriate message
    }
    return value;
  };

  const formattedValue = formatValue(value);

  return (
    <Card style={{ width: 130, height: 111 }}>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={formattedValue} />
      </Space>
    </Card>
  );
};

const KpiCard = ({ title, data, onToggle, onFullscreen, loading, onPointClick, selectedChartTypes, setSelectedChartTypes, handleMouseEnter, handleMouseLeave }) => {
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const selectedChartType = selectedChartTypes[title] || 'line';

  const handleChartSelect = (type) => {
    setSelectedChartTypes({ ...selectedChartTypes, [title]: type });
    setChartModalVisible(false);
  };

  const handleBarMouseOver = (data, index) => {
    const bars = document.querySelectorAll('.recharts-bar-rectangle');
    if (bars[index]) {
      bars[index].style.fillOpacity = '0.7';
    }
  };

  const handleBarMouseOut = (data, index) => {
    const bars = document.querySelectorAll('.recharts-bar-rectangle');
    if (bars[index]) {
      bars[index].style.fillOpacity = '1';
    }
  };

  const renderChart = () => {
    const formattedData = Object.keys(data).reduce((acc, site) => {
      data[site].forEach(point => {
        const date = moment(point.date).format('YYYY-MM-DD');
        if (!acc[date]) acc[date] = {};
        acc[date][site] = point.value;
      });
      return acc;
    }, {});

    const chartData = Object.entries(formattedData).map(([date, sites]) => ({ date, ...sites }));

    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            {Object.keys(data).map((site, index) => (
              <Bar
                key={index}
                dataKey={site}
                name={site}
                fill={COLORS[index % COLORS.length]}
                onMouseOver={(data, index) => handleBarMouseOver(index)}
                onMouseOut={(data, index) => handleBarMouseOut(index)}
              />
            ))}
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              cursor={{ fill: 'rgba(128, 128, 128, 0.3)' }}
              formatter={(value) => (value != null ? value : '')}
              labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc', // Agrega un borde leve
                borderRadius: '4px', // Bordes redondeados
                color: 'black',
                opacity: 0.9
              }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            {Object.keys(data).map((site, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={site}
                name={site}
                stroke={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              cursor={{ fill: 'rgba(128, 128, 128, 0.3)' }}
              formatter={(value) => (value != null ? value : '')}
              labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc', // Agrega un borde leve
                borderRadius: '4px', // Bordes redondeados
                color: 'black',
                opacity: 0.9
              }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={chartData}>
            {Object.keys(data).map((site, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={site}
                name={site}
                stroke={COLORS[index % COLORS.length]}
                onClick={(e) => onPointClick(e, index)}
              />
            ))}
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              cursor={{ fill: 'rgba(128, 128, 128, 0.3)' }}
              formatter={(value) => (value != null ? value : '')}
              labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc', // Agrega un borde leve
                borderRadius: '4px', // Bordes redondeados
                color: 'black',
                opacity: 0.9
              }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Card
      title={loading ? <Skeleton.Input active size="default" style={{ width: 200 }} /> : title}
      extra={
        <Space>
          <Button icon={<VisibilityOffIcon />} onClick={onToggle} />
          <Button icon={<FullscreenIcon />} onClick={onFullscreen} />
          <Button icon={<InsertChartIcon />} onClick={() => setChartModalVisible(true)} />
        </Space>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      )}
      <Modal
        title="Select Chart Type"
        open={chartModalVisible}
        onCancel={() => setChartModalVisible(false)}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Button type="primary" icon={<LineChartOutlined />} onClick={() => handleChartSelect('line')} block>
              Line Chart
            </Button>
          </Col>
          <Col span={8}>
            <Button type="primary" icon={<BarChartOutlined />} onClick={() => handleChartSelect('bar')} block>
              Bar Chart
            </Button>
          </Col>
          <Col span={8}>
            <Button type="primary" icon={<AreaChartOutlined />} onClick={() => handleChartSelect('area')} block>
              Area Chart
            </Button>
          </Col>
        </Row>
      </Modal>
    </Card>
  );
};

export default Dashboard;