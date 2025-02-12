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
// import statesData from '../../state.json'
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MUIDataTable from 'mui-datatables';
import { Container } from '@mui/material';
import { Col } from 'react-bootstrap';
import TransportModal from 'views/component/TransportModal';
import LedgerModal from 'views/component/LedgerModal';
import useApiManager from 'views/component/ApiManager';
import ConsignorAndConsigneeModal from 'views/component/ConsignorAndConsigneeModal';
import DriverModal from 'views/component/DriverModal';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
// import useApiManager from 'src/ApiManager'

function ConsignorAndConsignee() {
  const [userClientList, setUserClientList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ledgerModal, setLedgerModal] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [consignorAndConsignee, setConsignorAndConsignee] = useState([]);
  const [driverModal, setDriverModal] = useState(false);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const [validated, setValidated] = useState(false);
  const [bankButton, setBankButton] = useState(false);
  const [PoDetail, setPoDetail] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setisEditData] = useState('');
  const [pofetchingData, setPofetchingData] = useState([]);
  const [stationaryDetail, setStationaryDetail] = useState([]);
  const [VehicleAllDetal, setVehicleAllDetal] = useState([]);
  const [driverOption, setDriverOption] = useState([]);
  const [consignmentDetail, setConsignmentDetail] = useState([]);
  const [transportlist, setTransportlist] = useState([]);
  const [routeList, setRouteList] = useState([]);
  const permissionRole = useSelector((state) => state.value);
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  useEffect(() => {
    fetchConsignorAndConsignee();
    fetchPO();
    fetchStationary();
    fetchVehcile();
    fetchDriver();
    fetchRoute();
    fetchConsignmentDetail();
  }, []);

  const fetchRoute = async () => {
    try {
      const result = await getRequest('getAllRoute', { ...formData, userid: userData[0].nid });
      if (result.IsSuccess) {
        setRouteList(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchTransport = async () => {
    try {
      const result = await getRequest('getTransporterByRouteID', { ...formData, RouteID: PoDetail[0].RouteID });
      if (result.IsSuccess) {
        setTransportlist(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

  const fetchVehcile = async () => {
    try {
      const result = await getRequest('getAllVehicle', formData);
      if (result.IsSuccess) {
        setVehicleAllDetal(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchStationary = async () => {
    try {
      const result = await getRequest('GetallStationarytab', formData);
      if (result.IsSuccess) {
        setStationaryDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchPoDetailing = async (poNumber) => {
    try {
      const result = await getRequest('getPOBYPoNumber', { ...formData, PoNumber: poNumber, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setPofetchingData(result.data);
        fetchTransport();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchPO = async () => {
    try {
      const result = await getRequest('GetallPO', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setPoDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchConsignorAndConsignee = async () => {
    try {
      const result = await getRequest('getAllParty', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setConsignorAndConsignee(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchConsignmentDetail = async () => {
    try {
      const result = await getRequest('GetallConsignment', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setConsignmentDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleConsignmentSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertConsignment', {
          ...formData,
          AddUser: userData[0]?.nid,
          RouteId: pofetchingData[0]?.RouteID
        });
        setShowModal(false);
        fetchConsignmentDetail();
        toast.success(response.data[0]?.msg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleConsignmentUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('UpdateConsignment', {
          ...formData,
          UpdateUser: userData[0]?.nid,
          id: editData?.nid,
          RouteId: pofetchingData[0]?.RouteID
        });
        fetchConsignmentDetail();
        setShowModal(false);
        toast.success(response.data[0]?.msg);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivetConsignment', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchConsignmentDetail();
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
      MobileNo: newValue
    }));
  };
  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      State: selectedOption.value
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
  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      country: selectedOption.value
    });
  };
  const handleMobileAlternateChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      AltMobileNo: newValue
    }));
  };

  // const stateDataFilter = statesData.states.map((item) => item.state)
  // const stateOptions = stateDataFilter.map((state) => ({
  //   value: state,
  //   label: state,
  // }))

  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      City: selectedOption.value
    });
  };
  const handleEdit = (user) => {
    // pofetchingData[0]
    const formattedDate = user.CNDate ? new Date(user.CNDate).toISOString().split('T')[0] : null;
    const formattedEtDate = user.CNDate ? new Date(user.EtaDelivery).toISOString().split('T')[0] : null;
    setFormData({
      DeliveryPoint: user.DeliveryPoint,
      Label: user.PoNumber,
      Attimg: user.Attimg,
      RouteLabel: user.RouteName,
      BookLabel: user.BookName,
      BookName: user.BookID,
      DriverID: user.DriverID,
      Vehicle: user.Vehicle,
      VehicleLabel: user.VehicleNumber,
      PoNumber: user.PoNumber,
      DriverLabel: user.DriverFirstName,
      TransportLabel: user.TransporterName,
      TranspoterID: user.TranspoterID,
      Distance: user.Distance,
      CNDate: formattedDate,
      CNNumber: user.CNNumber,
      ActualQty: user.ActualQty,
      EtaDelivery: formattedEtDate,
      Rermark: user.Rermark,
      DeliveryPoint: user.DeliveryPoint,
      ChainageNumber: user.ChainageNumber,
      UnitLabel: user.UnitType,
      UnitType: user.UnitType,
      FrieghtType: user.FrieghtType,
      FrieghtLabel: user.FrieghtType,
      AdvanceType: user.AdvanceType,
      AdvanceLabel: user.AdvanceType,
      AdvanceAmount: user.AdvanceAmount
    });
    fetchPoDetailing(user.PoNumber);
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
      name: 'CNDate',
      label: 'CN Date',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          const dateObj = new Date(value);
          const day = dateObj.getDate();
          const monthIndex = dateObj.getMonth();
          const year = dateObj.getFullYear();
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];
          const monthName = monthNames[monthIndex];
          const formattedDate = `${day}-${monthName}-${year}`;
          return formattedDate;
        }
      }
    },
    {
      name: 'CNNumber',
      label: 'CN Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ActualQty',
      label: 'Loading Quantity',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'VehicleNumber',
      label: 'Vehicle Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'TransporterName',
      label: 'Transporter',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'RouteName',
      label: 'Route',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'PoNumber',
      label: 'Po',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'EtaDelivery',
      label: 'ETA Delivery',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          const dateObj = new Date(value);
          const day = dateObj.getDate();
          const monthIndex = dateObj.getMonth();
          const year = dateObj.getFullYear();
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];
          const monthName = monthNames[monthIndex];
          const formattedDate = `${day}-${monthName}-${year}`;
          return formattedDate;
        }
      }
    },
    {
      name: 'MaterialName',
      label: 'Material',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'AdvanceAmount',
      label: 'Advance Amount',
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
          const user = consignmentDetail[tableMeta.rowIndex];
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
          const user = consignmentDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[15]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggle(user)}
                  disabled={permissionRole[15]?.pdelete == '0'}
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

  const handleTransportInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const options = {
    filterType: 'text',
    selectableRows: 'none'
  };

  return (
    <CCard style={{ marginBottom: '10%' }}>
      <CCardHeader>
        <strong>Consignment Details</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="">
          <CCol xs="12" className="d-grid gap-2 d-md-flex">
            <CButton
              disabled={permissionRole[14]?.pwrite == '0'}
              onClick={() => setShowModal(!showModal)}
              color="primary"
              className="me-md-2"
            >
              Create Consignment
            </CButton>
          </CCol>
        </CRow>
        <ConsignorAndConsigneeModal
          setPofetchingData={setPofetchingData}
          editData={editData}
          handleConsignmentUpdate={handleConsignmentUpdate}
          routeList={routeList}
          handleConsignmentSubmit={handleConsignmentSubmit}
          transportlist={transportlist}
          driverOption={driverOption}
          stationaryDetail={stationaryDetail}
          VehicleAllDetal={VehicleAllDetal}
          pofetchingData={pofetchingData}
          fetchPoDetailing={fetchPoDetailing}
          PoDetail={PoDetail}
          consignorAndConsignee={consignorAndConsignee}
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
          setIsEdit={setIsEdit}
          validated={validated}
          setLedgerModal={setLedgerModal}
          driverModal={driverModal}
          setDriverModal={setDriverModal}
        />
        <LedgerModal
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
          driverModal={driverModal}
          setDriverModal={setDriverModal}
        />
        <DriverModal
          fetchDriver={fetchDriver}
          handleInputChange={handleTransportInputChange}
          validated={validated}
          formData={formData}
          setFormData={setFormData}
          showModal={driverModal}
          setShowModal={setDriverModal}
        />
        <div className="custom-mui-table mt-4">
          <MUIDataTable
            // title={'User Client List'}
            data={consignmentDetail}
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

export default ConsignorAndConsignee;
