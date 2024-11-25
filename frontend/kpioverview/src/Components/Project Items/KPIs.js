import React, { useState } from 'react';
import { Typography, Row, Col, Card, Checkbox } from 'antd';
import { CButton   } from '@coreui/react-pro';

const KPI = () => {
  const [selectedKPIs, setSelectedKPIs] = useState([]);
  const [displayedKPIs, setDisplayedKPIs] = useState([]);

  const kpis = [
    { title: 'RRC Attempts', key: 'rrc_attempts' },
    { title: 'RRC Setup Success Rate(%)', key: 'rrc_setup_success_rate' },
    { title: 'L.RRC.ConnReq.Att', key: 'l_rrc_connreq_att' },
    { title: 'L.RRC.ConnReq.Succ', key: 'l_rrc_connreq_succ' },
    { title: 'Average Throughput', key: 'average_throughput' },
    { title: 'Signal Power', key: 'signal_power' }
  ];

  const handleKPISelectionChange = (kpiKey) => {
    setSelectedKPIs(prevSelectedKPIs => {
      if (prevSelectedKPIs.includes(kpiKey)) {
        return prevSelectedKPIs.filter(key => key !== kpiKey);
      } else {
        return [...prevSelectedKPIs, kpiKey];
      }
    });
  };

  const applyKPISelection = () => {
    setDisplayedKPIs(selectedKPIs);
  };

  const resetKPISelection = () => {
    setDisplayedKPIs([]);
    setSelectedKPIs([]);
  };

  return (
    <div>
      <Typography.Title level={1}>KPIs</Typography.Title>
      <Row gutter={[16, 16]}>
        {kpis.map(kpi => (
          <Col span={8} key={kpi.key}>
            <Card
              title={kpi.title}
              extra={
                <Checkbox
                  checked={selectedKPIs.includes(kpi.key)}
                  onChange={() => handleKPISelectionChange(kpi.key)}
                />
              }
            >
              <p>{kpi.title}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <CButton type="primary" onClick={applyKPISelection} style={{ marginRight: '10px' }}>Apply Selection</CButton>
        <CButton type='light' onClick={resetKPISelection}>Reset Selection</CButton>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Typography.Title level={2}>Selected KPIs</Typography.Title>
        {displayedKPIs.map(kpiKey => {
          const kpi = kpis.find(item => item.key === kpiKey);
          return <div key={kpiKey}>{kpi.title}</div>;
        })}
      </div>
    </div>
  );
};

export default KPI;
