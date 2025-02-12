import React, { useEffect, useMemo, useState } from 'react';
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
// import { cilPencil } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
import statesData from '../../../src/State.json';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MUIDataTable from 'mui-datatables';
import { Container } from '@mui/material';
import { Col } from 'react-bootstrap';
import TransportModal from 'views/component/TransportModal';
import LedgerModal from 'views/component/LedgerModal';
import useApiManager from 'views/component/ApiManager';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { REACT_LOGIN, REACT_PASS } from 'Variable';

// import useApiManager from 'src/ApiManager'

function TransportMaster() {
  const [userClientList, setUserClientList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ledgerModal, setLedgerModal] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [transportlist, setTransportlist] = useState([]);
  const [GSTDetail, setGSTDetail] = useState([]);
  const [isGst, setIsGST] = useState(false);
  const [isPAn, setIsPAN] = useState(false);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [validated, setValidated] = useState(false);
  const [bankButton, setBankButton] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setisEditData] = useState('');
  const [ValidateBtn, setValidateBtn] = useState(false);
  const [ValidatePan, setValidatePAN] = useState(false);
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchLedger();
    fetchTransport();
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

  const fetchTransport = async () => {
    try {
      const result = await getRequest('getAllTransporter', formData);
      if (result.IsSuccess) {
        setTransportlist(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchPAN = (PanNumber) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2NTU1NzE2MiwianRpIjoiZTFhYzdmNzMtOTQ3Ni00YmVlLTgzNWQtM2Y1OTk3YmZhZTMxIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnN2Z2pwckBzdXJlcGFzcy5pbyIsIm5iZiI6MTY2NTU1NzE2MiwiZXhwIjoxOTgwOTE3MTYyLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsid2FsbGV0Il19fQ.8QXkfAjZsa8QOV7DoRgXC9PnGYOrDlR-xTWiIx66k3A'
    );
    const raw = JSON.stringify({
      id_number: PanNumber
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch('https://kyc-api.aadhaarkyc.io/api/v1/pan/pan-comprehensive', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == false) {
          toast.error(result.message);
        } else {
          toast.success(result.message_code);
        }
        setIsPAN(true);
        setValidatePAN(false);
      })
      .catch((error) => toast.error(error.message));
  };

  const fetchGST = (PanNumber) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2NTU1NzE2MiwianRpIjoiZTFhYzdmNzMtOTQ3Ni00YmVlLTgzNWQtM2Y1OTk3YmZhZTMxIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnN2Z2pwckBzdXJlcGFzcy5pbyIsIm5iZiI6MTY2NTU1NzE2MiwiZXhwIjoxOTgwOTE3MTYyLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsid2FsbGV0Il19fQ.8QXkfAjZsa8QOV7DoRgXC9PnGYOrDlR-xTWiIx66k3A'
    );
    const raw = JSON.stringify({
      id_number: PanNumber,
      filing_status_get: true
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const extractJurisdictionDetails = (jurisdiction) => {
      // Split the string into parts based on commas
      const parts = jurisdiction.split(',');

      // Initialize variables to store extracted values
      let state = '';
      let district = '';
      let city = '';

      // Loop through the parts and assign values to the variables based on their labels
      parts.forEach((part) => {
        if (part.includes('State -')) {
          state = part.split('State - ')[1].trim();
        } else if (part.includes('Division -')) {
          district = part.split('Division - ')[1].trim();
        } else if (part.includes('Circle -')) {
          city = part.split('Circle - ')[1].trim().split(' ')[0]; // Get the first part before '('
        }
      });

      return { state, district, city };
    };
    fetch('https://kyc-api.aadhaarkyc.io/api/v1/corporate/gstin', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == false) {
          toast.error(result.message);
        } else {
          toast.success(result.message_code);
          setGSTDetail(result.data);
          const { state, city, district } = extractJurisdictionDetails(result?.data?.state_jurisdiction);
          console.warn('dd', district);
          const address = result?.data?.address;
          const pincodeRegex = /(\d{6})$/;
          const match = address.match(pincodeRegex);
          const pincode = match ? match[0] : null;
          setFormData({
            ...formData,
            TransporterName: result.data?.business_name,
            ContactPerson: result?.data?.legal_name,
            ContactPersonAddress: result?.data?.address,
            BillingPAN: result?.data?.pan_number,
            BusinessNatureLabel: result?.data?.constitution_of_business,
            BusinessNatureLabel: result?.data?.constitution_of_business,
            BillingState: state,
            BillingDistrict: city,
            BillingCity: city,
            BillingPincode: pincode,
            BillingAddress: result?.data?.address
          });
        }
        setIsGST(true);
        setValidateBtn(false);
      })
      .catch((error) => toast.error(error.message));
  };

  const handleTransportSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      if (isGst && isPAn) {
        try {
          const response = await postRequest('InsertTransporter', {
            ...formData,
            AddUser: userData[0]?.nid,
            OtherImg: formData.OtherImg ? formData.OtherImg : ''
          });
          setShowModal(false);
          toast.success(response.message);
          fetchTransport();
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      } else {
        toast.error('Please Validate GST And PAN');
      }
    }
  };

  const handleTransportUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      if (!ValidateBtn && !ValidatePan) {
        try {
          const response = await postRequest('editTransporter', {
            ...formData,
            AddUser: userData[0]?.nid,
            id: editData?.nid,
            OtherImg: formData.OtherImg ? formData.OtherImg : ''
          });
          toast.success('Transporter Updated Successfully.');
          setShowModal(false);
          fetchTransport();
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      } else {
        toast.error('Please Validate GST And PAN');
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const stateDataFilter = statesData?.states?.map((item) => item.state);
  const stateOptions = stateDataFilter?.map((state) => ({
    value: state,
    label: state
  }));

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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivetTransporter', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        const updatedUserList = userClientList.map((u) =>
          u.id === user.id ? { ...u, Status: newStatus === '1' ? 'Active' : 'Inactive' } : u
        );
        setUserClientList(updatedUserList);
        toast.success('Status Updated Successfully.');
        fetchTransport();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleMobileChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      ContactNumber: newValue
    }));
  };
  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      BillingState: selectedOption.value
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
  console.warn('district', districtOptions);
  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      BillingDistrict: selectedOption.value
    });
  };
  const handleEdit = (user) => {
    setFormData({
      OtherImg: user.OtherImg,
      BusinessNatureLabel: user.BusinessNature,
      BusinessNature: user.BusinessNature,
      TDSDeclaration: user.TDSDeclaration,
      AadharNo: user.Aadhaar,
      TransporterName: user.TransporterName,
      ContactPerson: user.ContactPerson,
      ContactEmail: user.ContactEmail,
      ContactNumber: user.ContactNumber,
      ContactPersonAddress: user.ContactPersonAddress,
      Rate: user.Rate,
      BillingAddress: user.BillingAddress,
      BillingState: user.BillingState,
      BillingDistrict: user.BillingDistrict,
      BillingCity: user.BillingCity,
      BillingPincode: user.BillingPincode,
      BillingPAN: user.BillingPAN,
      BillingGST: user.BillingGST,
      Label: user.LedgerName,
      LedgerID: user.LedgerID
    });
    const districts = statesData.states.find((state) => (state.state = user.BillingState)).districts || [];
    console.warn('districts', districts);
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
      name: 'TransporterName',
      label: 'Transporter Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactPerson',
      label: 'Contact Person',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactPersonAddress',
      label: 'Person Address',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactPerson',
      label: 'Contact Person',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactNumber',
      label: 'Contact Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactEmail',
      label: 'Contact Email',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BillingState',
      label: 'Billing State',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BillingCity',
      label: 'Billing City',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BillingDistrict',
      label: 'Billing District',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BillingPincode',
      label: 'Billing Pincode',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BillingPAN',
      label: 'Billing PAN',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BillingGST',
      label: 'Billing GST',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Rate',
      label: 'Rate',
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
          const user = transportlist[tableMeta.rowIndex];
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
          const user = transportlist[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[4]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[4]?.pdelete == '0'}
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
          <strong>Transporter Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[4]?.pwrite == '0'}
                onClick={() => setShowModal(!showModal)}
                color="primary"
                className="me-md-2"
              >
                Add Transporter
              </CButton>
            </CCol>
          </CRow>
          <TransportModal
            GSTDetail={GSTDetail}
            ValidateBtn={ValidateBtn}
            setValidateBtn={setValidateBtn}
            ValidatePan={ValidatePan}
            setValidatePAN={setValidatePAN}
            fetchPAN={fetchPAN}
            setIsGST={setIsGST}
            setIsPAN={setIsPAN}
            fetchGST={fetchGST}
            editData={editData}
            stateOptions={stateOptions}
            setIsEdit={setIsEdit}
            handleTransportUpdate={handleTransportUpdate}
            ledgerOption={ledgerOption}
            handleTransportSubmit={handleTransportSubmit}
            handleDistricChange={handleDistricChange}
            districtOptions={districtOptions}
            formData={formData}
            setFormData={setFormData}
            showModal={showModal}
            setShowModal={setShowModal}
            handleInputChange={handleInputChange}
            handleMobileChange={handleMobileChange}
            handleStateChange={handleStateChange}
            isEdit={isEdit}
            validated={validated}
            setLedgerModal={setLedgerModal}
          />
          <LedgerModal
            fetchLedger={fetchLedger}
            fetchTransport={fetchTransport}
            handleTransportSubmit={handleTransportSubmit}
            handleDistricChange={handleDistricChange}
            districtOptions={districtOptions}
            bankButton={bankButton}
            setBankButton={setBankButton}
            handleInputChange={handleInputChange}
            handleMobileChange={handleMobileChange}
            handleStateChange={handleStateChange}
            formData={formData}
            setFormData={setFormData}
            ledgerModal={ledgerModal}
            setLedgerModal={setLedgerModal}
            isEdit={isEdit}
            validated={validated}
          />
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              // title={'User Client List'}
              data={transportlist}
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

export default TransportMaster;
