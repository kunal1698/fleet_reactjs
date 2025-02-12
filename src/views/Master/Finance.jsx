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
import 'react-toastify/dist/ReactToastify.css';
import DriverModal from 'views/component/DriverModal';
import useApiManager from 'views/component/ApiManager';
import { toast, ToastContainer } from 'react-toastify';
function Finance() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { postRequest, formData, setFormData } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
    <>
      <CCard style={{ marginBottom: '10%' }}>
        <CCardHeader>
          <strong>Finance Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            {/* <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton color="primary" className="me-md-2">
                Add Account
              </CButton>
            </CCol> */}
          </CRow>
          <DriverModal
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            handleInputChange={handleInputChange}
            validated={validated}
            formData={formData}
            setFormData={setFormData}
            showModal={showModal}
            setShowModal={setShowModal}
          />
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
    </>
  );
}

export default Finance;
