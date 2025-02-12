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
import ConsignorModal from 'views/component/ConsignorModal';
import useApiManager from 'views/component/ApiManager';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
function Consignor() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [consignorDetail, setConsignor] = useState([]);
  const [editData, setisEditData] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [branchDetail, setBranchDetail] = useState([]);
  const [branchName, setBranchName] = useState('');

  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchConsignor();
    fetchBranch();
  }, []);
  const fetchBranch = async () => {
    try {
      const result = await getRequest('getAllBranch', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setBranchDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchConsignor = async () => {
    try {
      const result = await getRequest('getAllParty', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setConsignor(result.data);
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
        const response = await postRequest('InsertParty', { ...formData, AddUser: userData[0]?.nid });
        console.warn('result', response);
        if (response.data[0].EMsg == 'Consignee Name Already Available') {
          toast.error(response.data[0].EMsg);
        } else {
          toast.success(response.data[0].EMsg);
          setShowModal(false);
        }
        fetchConsignor();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleConsignerEdit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('editParty', { ...formData, UpdateUser: userData[0]?.nid, id: editData?.nid });
        setShowModal(false);
        toast.success('Consignor Updated Successfully.');
        fetchConsignor();
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
      PartyType: user.PartyType,
      PartyName: user.PartyName,
      PartyNumber: user.PartyNumber,
      PartyEmail: user.PartyEmail,
      PartyAddress: user.PartyAddress,
      BranchIDs: user.BranchIDs
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactiveParty', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchConsignor();
        toast.success('Status Updated Successfully.');
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
      name: 'PartyType',
      label: 'Type',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'PartyName',
      label: 'Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'PartyNumber',
      label: 'Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'PartyEmail',
      label: 'Email',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'PartyAddress',
      label: 'Address',
      options: {
        filter: true,
        sort: false
      }
    },
    // {
    //   name: 'BranchIDs',
    //   label: 'Branch IDs',
    //   options: {
    //     filter: true,
    //     sort: false
    //   }
    // },

    {
      name: 'Status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const user = consignorDetail[tableMeta.rowIndex];
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
          const user = consignorDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[6]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[6]?.pdelete == '0'}
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
      {' '}
      <CCard style={{ marginBottom: '10%' }}>
        <CCardHeader>
          <strong>Consignor / Consignee Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[6]?.pwrite == '0'}
                onClick={() => setShowModal(!showModal)}
                color="primary"
                className="me-md-2"
              >
                {!isEdit ? ' Add Consignor / Consignee' : ' Update Consignor / Consignee'}
              </CButton>
            </CCol>
          </CRow>

          <ConsignorModal
            setBranchName={setBranchName}
            branchDetail={branchDetail}
            handleInputChange={handleInputChange}
            handleConsignerSubmit={handleConsignerSubmit}
            validated={validated}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            handleConsignerEdit={handleConsignerEdit}
            formData={formData}
            setFormData={setFormData}
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              // title={'User Client List'}
              data={consignorDetail}
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

export default Consignor;
