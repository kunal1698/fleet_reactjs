import MUIDataTable from 'mui-datatables';
import React, { useState } from 'react';
import {
  CForm,
  CFormInput,
  CCol,
  CRow,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardFooter
} from '@coreui/react';
import { useSelector } from 'react-redux';
function BillingPartyMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const permissionRole = useSelector((state) => state.value);
  const columns = [
    {
      name: 'index',
      label: 'Sr No.',
      options: {
        filter: true,
        sort: true
      },
      customBodyRenderLite: (index) => {
        return <span>{index + 1}</span>;
      }
    },

    {
      name: 'ClinetName',
      label: 'Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'MobileNo',
      label: 'Mobile',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'City',
      label: 'District',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Pancard',
      label: 'PAN No',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'Status',
      label: 'Status',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        selectableRowsHideCheckboxes: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const user = userClientList[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <div onClick={() => (filteredUserMaster[0].pwrite != '0' ? handleEdit(user) : '')}>
                <CIcon icon={cilPencil} className="me-2" />
              </div>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggle(user)}
                  disabled={filteredUserMaster[0]?.pdelete == '0'}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={`switch-${user.nid}`}
                  checked={user.Status === 'Active'}
                  readOnly
                />
              </div>
            </div>
          );
        }
      }
    }
  ];

  const options = {
    filterType: 'text',
    selectableRows: 'none'
  };
  return (
    <CCard style={{ marginBottom: '10%' }}>
      <CCardHeader>
        <strong>Billing Party Details</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="">
          <CCol xs="12" className="d-grid gap-2 d-md-flex">
            <CButton onClick={() => setShowModal(!showModal)} color="primary" className="me-md-2">
              Add Billing Party
            </CButton>
          </CCol>
        </CRow>
        {/* <DriverModal
          handleInputChange={handleInputChange}
          validated={validated}
          formData={formData}
          setFormData={setFormData}
          showModal={showModal}
          setShowModal={setShowModal}
        /> */}
        <div className="custom-mui-table mt-4">
          <MUIDataTable
            // title={'User Client List'}
            // data={userClientList}
            columns={columns}
            options={{
              ...options,
              responsive: 'standard' // Adjust responsiveness as needed
              // Additional options can be added here
            }}
            className="custom-mui-datatable"
          />
        </div>
      </CCardBody>
    </CCard>
  );
}

export default BillingPartyMaster;
