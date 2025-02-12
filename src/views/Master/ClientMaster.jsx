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
import statesData from '../../../src/State.json';

import StationaryModal from 'views/component/StationaryModal';
import useApiManager from 'views/component/ApiManager';
import ClientModal from 'views/component/ClientModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
function ClientMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [clientDetail, setClientDetail] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setisEditData] = useState('');
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchLedger();
    fetchClient();
  }, []);

  const fetchLedger = async () => {
    try {
      const result = await getRequest('getAllLedger', formData);
      if (result.IsSuccess) {
        setLedgerOption(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const fetchClient = async () => {
    try {
      const result = await getRequest('GetallClient', formData);
      if (result.IsSuccess) {
        setClientDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const handleClientSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertClient', { ...formData, AddUser: userData[0]?.nid });
        fetchClient();
        if (response.data[0].msg == 'Mobile Number ALREADY DONE') {
          toast.error(response.data[0].msg);
        } else {
          toast.success(response.data[0].msg);
          setShowModal(false);
        }
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivetClient', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchClient();
        toast.success(result.data[0]?.msg);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleClientUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('EditClient', {
          ...formData,
          AddUser: userData[0]?.nid,
          id: editData?.nid
        });
        setShowModal(false);
        fetchClient();
        toast.success(response.data[0]?.msg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      ClintState: selectedOption.value
    });

    // Filter districts based on selected state
    const districts = statesData.states.find((state) => state.state === selectedOption.value)?.districts || [];
    console.warn('map', districts);
    setDistrictOptions(
      districts.map((district) => ({
        value: district,
        label: district
      }))
    );
  };
  const stateDataFilter = statesData?.states?.map((item) => item.state);
  const stateOptions = stateDataFilter?.map((state) => ({
    value: state,
    label: state
  }));

  console.warn('district', districtOptions);
  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      ClintDistrict: selectedOption.value
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleEdit = (user) => {
    setFormData({
      ClientName: user.ClientName,
      ClintAddress: user.ClintAddress,
      ClintState: user.ClintState,
      ClintPincode: user.ClintPincode,
      ClintEmail: user.ClintEmail,
      MobileNumber: user.MobileNumber,
      PAN: user.PAN,
      ClintDistrict: user.ClintDistrict,
      GSTNumber: user.GSTNumber,
      Label: user.LedgerName,
      LedgerID: user.LedgerID
    });
    const districts = statesData.states.find((state) => (state.state = user.ClintState)).districts || [];
    setDistrictOptions(
      districts.map((district) => ({
        value: district,
        label: district
      }))
    );
    setisEditData(user);
    setIsEdit(true);
    setShowModal(true);
    scrollToTop();
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
      name: 'ClientName',
      label: 'Service Provider Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ClintAddress',
      label: 'Service Provider Address',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ClintState',
      label: 'Service Provider State',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ClintPincode',
      label: 'Service Provider Pincode',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ClintEmail',
      label: 'Service Provider Email',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'MobileNumber',
      label: 'Mobile Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'GSTNumber',
      label: 'GST Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'LedgerName',
      label: 'Ledger Name',
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
          const user = clientDetail[tableMeta.rowIndex];
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
          const user = clientDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[7]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[7]?.pdelete == '0'}
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
          <strong>Service Provider Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[7]?.pwrite == '0'}
                onClick={() => setShowModal(!showModal)}
                color="primary"
                className="me-md-2"
              >
                Add Service Provider
              </CButton>
            </CCol>
          </CRow>
          <ClientModal
            districtOptions={districtOptions}
            stateOptions={stateOptions}
            handleStateChange={handleStateChange}
            handleDistricChange={handleDistricChange}
            handleClientUpdate={handleClientUpdate}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            ledgerOption={ledgerOption}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleClientSubmit={handleClientSubmit}
            validated={validated}
            formData={formData}
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              // title={'User Client List'}
              data={clientDetail}
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

export default ClientMaster;
