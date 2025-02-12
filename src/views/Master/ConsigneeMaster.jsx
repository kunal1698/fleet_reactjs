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
import useApiManager from 'views/component/ApiManager';
import ConsigneeModal from 'views/component/ConsigneeModal';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';

function ConsigneeMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [editData, setisEditData] = useState('');
  const [consigneeDetail, setConsignee] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  useEffect(() => {
    fetchConsignee();
  }, []);

  const fetchConsignee = async () => {
    try {
      const result = await getRequest('getAllConsignee', formData);
      if (result.IsSuccess) {
        setConsignee(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleConsignerSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertConsignee', { ...formData, AddUser: userData[0]?.nid });
        setShowModal(false);
        fetchConsignee();
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleConsignneeEdit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('editConsignee', { ...formData, UpdateUser: userData[0]?.nid, id: editData?.nid });
        setShowModal(false);
        fetchConsignee();
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
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
    setShowModal(true);
    setIsEdit(true);
    setFormData({
      Consignee: user.Consignee,
      ConsigneeName: user.ConsigneeName,
      ConsigneeNumber: user.ConsigneeNumber,
      ConsigneeEmail: user.ConsigneeEmail,
      ConsigneeAddress: user.ConsigneeAddress
    });
    setShowModal(true);
    setisEditData(user);
    scrollToTop();
  };

  const handleToggle = async (user) => {
    const newStatus = user.Status === 'Active' ? '0' : '1';
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('APILOgin', '831215ef-ef63-4e1b-ae95-af3125dce8f9');
    urlencoded.append('APIPASS', '5acb63e7-a3b0-4956-8314-65905bf245493ywrty$u#&');
    urlencoded.append('id', user.nid);
    urlencoded.append('status', newStatus);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactiveConsignee', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        const updatedUserList = userList.map((u) => (u.id === user.id ? { ...u, Status: newStatus === '1' ? 'Active' : 'Inactive' } : u));
        setUserList(updatedUserList);
        fetchAllUser();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
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
      name: 'Consignee',
      label: 'Consignee',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'ConsigneeName',
      label: 'Consignee Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ConsigneeNumber',
      label: 'Consignee Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ConsigneeEmail',
      label: 'Consignee Email',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ConsigneeAddress',
      label: 'Consignee Address',
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
          const user = consigneeDetail[tableMeta.rowIndex];
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
          const user = consigneeDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <div onClick={() => handleEdit(user)}>
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </div>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggle(user)}
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
          <strong>Consignee Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton onClick={() => setShowModal(!showModal)} color="primary" className="me-md-2">
                Add Consignee
              </CButton>
            </CCol>
          </CRow>

          <ConsigneeModal
            validated={validated}
            handleInputChange={handleInputChange}
            formData={formData}
            setFormData={setFormData}
            showModal={showModal}
            setShowModal={setShowModal}
            handleConsignerSubmit={handleConsignerSubmit}
            handleConsignneeEdit={handleConsignneeEdit}
            isEdit={isEdit}
          />
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              // title={'User Client List'}
              data={consigneeDetail}
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

export default ConsigneeMaster;
