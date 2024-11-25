// Sites.js
import React, { useState } from 'react';
import { Typography } from 'antd';
import { CSmartTable, CButton, CCollapse, CCardBody } from '@coreui/react-pro';

const Sites = ({ projectData, loading }) => {
  const [details, setDetails] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

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

  const applyFilter = () => {
    const selectedSiteNumbers = selectedSites.map(item => item.siteNumber);
    setFilteredItems(usersData.filter(data => selectedSiteNumbers.includes(data.siteNumber)));
  };

  const resetFilter = () => {
    setFilteredItems([]);
    setSelectedSites([]);
  };

  const handleSelectionChange = (selectedItems) => {
    setSelectedSites(selectedItems);
  };

  const extractSiteNames = (data) => {
    let siteNames = [];
    for (let kpiGroup in data) {
      for (let siteName in data[kpiGroup]) {
        if (!siteNames.includes(siteName)) {
          siteNames.push(siteName);
        }
      }
    }
    return siteNames;
  };

  const siteNames = extractSiteNames(projectData.data);

  const usersData = siteNames.map((site, index) => ({
    id: index,
    siteNumber: index + 1,
    eNodeBName: site,
    cellFddTddIndication: 'FDD', // Placeholder
    cellName: `Cell ${index + 1}`,
    localCellId: `LC0${index + 1}`,
    status: 'Active', // Placeholder
    registered: '2024-04-01', // Placeholder
  }));

  const columns = [
    { key: 'siteNumber', label: 'Site Number' },
    { key: 'eNodeBName', label: 'eNodeB Name' },
    { key: 'cellFddTddIndication', label: 'Cell FDD TDD Indication' },
    { key: 'cellName', label: 'Cell Name' },
    { key: 'localCellId', label: 'LocalCell Id' },
    { key: 'show_details', label: 'Actions', _style: { width: '1%' }, sorter: false, filter: false },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <>
        <Typography.Title level={1}>Sites</Typography.Title>
        <CButton color="primary" onClick={applyFilter} style={{ position: 'absolute', top: '64px', right: '180px' }}>Apply Selection</CButton>
        <CButton color='light' onClick={resetFilter} style={{ position: 'absolute', top: '64px', right: '40px' }}>Reset Selection</CButton>
        <CSmartTable
          activePage={2}
          cleaner
          columns={columns}
          columnFilter
          columnSorter
          footer
          items={filteredItems.length > 0 ? filteredItems : usersData}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          onFilteredItemsChange={(items) => {
            console.log(items);
          }}
          onSelectedItemsChange={handleSelectionChange}
          scopedColumns={{
            show_details: (item) => {
              return (
                <td className="py-2">
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
                </td>
              );
            },
            details: (item) => {
              return (
                <CCollapse visible={details.includes(item.id)}>
                  <CCardBody className="p-3">
                    <h4>{item.eNodeBName}</h4>
                    <p className="text-muted">User since: {item.registered}</p>
                    <CButton size="sm" color="info">
                      Show Data
                    </CButton>
                    <CButton size="sm" color="danger">
                      Hide Data
                    </CButton>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
          selectable
          sorterValue={{ column: 'status', state: 'asc' }}
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
      </>
    </div>
  );
};

export default Sites;
