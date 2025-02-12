import MUIDataTable from 'mui-datatables';
import React, { useEffect, useState } from 'react';
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
import { FaPencilAlt } from 'react-icons/fa';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import { useSelector } from 'react-redux';
function DriverMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [driverOption, setDriverOption] = useState([]);
  const [editData, setisEditData] = useState('');
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  const handleDriverSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertDriver', { ...formData, AddUser: userData[0]?.nid });
        setShowModal(false);
        fetchDriver();
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  const handleToggle = async (user) => {
    const newStatus = user.Status === 'Active' ? '0' : '1';
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('APILOgin', REACT_LOGIN);
    urlencoded.append('APIPASS', REACT_PASS);
    urlencoded.append('id', user.nid);
    urlencoded.append('status', newStatus);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactiveDriver', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchDriver();
        toast.success(result.data[0]?.EMsg);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  const handleDriverUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('EditDriver', {
          ...formData,
          AddUser: userData[0]?.nid,
          id: editData?.nid
        });
        toast.success(response.data[0].EMsg);
        setShowModal(false);
        fetchDriver();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      const result = await getRequest('getAllDriver', formData);
      if (result.IsSuccess) {
        setDriverOption(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = (user) => {
    console.warn('ff', user);
    setFormData({
      DriverFirstName: user.DriverFirstName,
      DriverLastName: user.DriverLastName,
      DriverMobile: user.DriverMobile
    });
    setisEditData(user);
    setIsEdit(true);
    setShowModal(true);
  };

  const columns = [
    {
      name: 'index',
      label: 'Sr No.',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (index) => {
          return <span>{index + 1}</span>;
        }
      }
    },

    {
      name: 'DriverFirstName',
      label: 'Driver  Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'DriverLastName',
      label: 'License Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'DriverMobile',
      label: 'Driver Mobile Number',
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
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const user = driverOption[tableMeta.rowIndex];
          const badgeStyle = {
            color: user.Status === 'Active' ? '#5cb85c' : '#dc3545',
            fontWeight: 'bold'
          };
          return <div style={badgeStyle}>{user.Status}</div>;
        }
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
          const user = driverOption[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[12]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggle(user)}
                  disabled={permissionRole[12]?.pdelete == '0'}
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
          <strong>Driver Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[12]?.pwrite == '0'}
                onClick={() => setShowModal(!showModal)}
                color="primary"
                className="me-md-2"
              >
                Add Driver
              </CButton>
            </CCol>
          </CRow>
          <DriverModal
            handleDriverSubmit={handleDriverSubmit}
            handleDriverUpdate={handleDriverUpdate}
            driverOption={driverOption}
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
              data={driverOption}
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

export default DriverMaster;
