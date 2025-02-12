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

import BillingOfcModal from 'views/component/BillingOfcModal';
import useApiManager from 'views/component/ApiManager';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { FaPencilAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from 'react-redux';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
function BillingOfficeMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [BillingOfcDetail, setBillingOfcDetail] = useState([]);
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
      const result = await getRequest('GetallParentCompany', formData);
      if (result.IsSuccess) {
        setBillingOfcDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const handleBillingSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertParentCompany', {
          ...formData,
          AddUser: userData[0]?.nid,
          BillingType: ''
        });
        setShowModal(false);
        fetchClient();
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleBillingUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('UpdateParentCompany', {
          ...formData,
          UpdateUser: userData[0]?.nid,
          id: editData?.nid,
          BillingType: ''
        });
        console.warn('dd', response);

        setShowModal(false);
        fetchClient();
        toast.success(response.data[0]?.msg);
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivetParentCompany', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchClient();
        toast.success(result.data[0]?.EMsg);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      CompanyState: selectedOption.value
    });

    // Filter districts based on selected state
    const districts = statesData.states.find((state) => state.state === selectedOption.value)?.districts || [];
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

  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      CompanyDistrict: selectedOption.value
    });
  };

  const handleEdit = (user) => {
    setFormData({
      CompanyName: user.CompanyName,
      CompanyAddress: user.CompanyAddress,
      CompanyState: user.CompanyState,
      CompanyPincode: user.CompanyPincode,
      PAN: user.PAN,
      CompanyEmail: user.CompanyEmail,
      CompanyDistrict: user.CompanyDistrict,
      MobileNumber: user.MobileNumber,
      GSTNumber: user.GSTNumber,
      Label: user.LedgerName,
      LedgerID: user.LedgerID
    });
    const districts = statesData.states.find((state) => (state.state = user.CompanyState)).districts || [];
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
      name: 'CompanyName',
      label: 'Office Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'CompanyAddress',
      label: 'Company Address',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'CompanyState',
      label: 'Company State',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'CompanyPincode',
      label: 'Company Pincode',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'CompanyEmail',
      label: 'Company Email',
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
      name: 'PAN',
      label: 'PAN Number',
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
          const user = BillingOfcDetail[tableMeta.rowIndex];
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
          const user = BillingOfcDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[8]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[8]?.pdelete == '0'}
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
          <strong>Parental Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[8]?.pwrite == '0'}
                onClick={() => setShowModal(!showModal)}
                color="primary"
                className="me-md-2"
              >
                Add Parental
              </CButton>
            </CCol>
          </CRow>
          <BillingOfcModal
            districtOptions={districtOptions}
            stateOptions={stateOptions}
            handleStateChange={handleStateChange}
            handleDistricChange={handleDistricChange}
            handleBillingSubmit={handleBillingSubmit}
            handleBillingUpdate={handleBillingUpdate}
            isEdit={isEdit}
            handleInputChange={handleInputChange}
            ledgerOption={ledgerOption}
            setIsEdit={setIsEdit}
            formData={formData}
            setFormData={setFormData}
            showModal={showModal}
            setShowModal={setShowModal}
          />
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
              data={BillingOfcDetail}
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

export default BillingOfficeMaster;
