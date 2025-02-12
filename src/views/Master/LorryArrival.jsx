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
import LorryArrivalModal from 'views/component/LorryArrivalModal';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
function LorryArrival() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [VehicleAllDetal, setVehicleAllDetal] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [autoFillDetail, setAutoFillDetail] = useState('');
  const [consignmentDetail, setConsignmentDetail] = useState([]);
  const [lorryArrival, setLorryArrival] = useState([]);
  const [iseEditData, setisEditData] = useState('');
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchVehcile();
    fetchConsignmentDetail();
    fetchLorryArrivalDetail();
  }, []);

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

  const fetchLorryArrivalDetail = async () => {
    try {
      const result = await getRequest('GetallLorryArrival', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setLorryArrival(result.data);
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

  const handleLorrySubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertLorri', {
          ...formData,
          AddUser: userData[0]?.nid,
          CNNumber: iseEditData?.CNNumber
        });
        fetchLorryArrivalDetail();
        setShowModal(false);
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
        toast.success('Driver Creted Successfully.');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleEdit = (lorryDetail) => {
    console.warn('f', lorryDetail);
    setShowModal(true);
    setIsEdit(true);
    setFormData({
      TransporterName: lorryDetail.TransporterName,
      DriverFirstName: lorryDetail.DriverFirstName,
      DriverMobile: lorryDetail.DriverMobile,
      Rermark: lorryDetail.Rermark,
      VehicleLabel: lorryDetail.VehicleNumber,
      vehicle: lorryDetail.Vehicle,
      ArrivalDate: lorryDetail.CNDate,
      CNDate: lorryDetail.CNDate,
      UnloadingAddress: lorryDetail.DeliveryPoint,
      NTPCChallanDoc: lorryDetail.NTPCChallanDoc,
      KataDoc: lorryDetail.KataDoc,
      BuiltyDoc: lorryDetail.BuiltyDoc,
      VehicleDoc: lorryDetail.VehicleDoc,
      GpsLocationDoc: lorryDetail.GpsLocationDoc
    });
    setShowModal(true);
    setisEditData(lorryDetail);
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
      name: 'CNNumber',
      label: 'CN Number',
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
      name: 'CNDate',
      label: 'Date Of Dispatch',
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
      name: 'ActualQty',
      label: 'Quantity',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'DriverFirstName',
      label: 'Driver Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'DriverMobile',
      label: 'Driver number',
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
          const lorryDetail = lorryArrival[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <CCol className="d-grid  d-md-flex justify-content-start">
                <CButton
                  onClick={() => handleEdit(lorryDetail)}
                  disabled={permissionRole[16]?.pwrite == '0'}
                  style={{ color: 'white', backgroundColor: '#5FA9FF', fontWeight: 'bold' }}
                >
                  Received
                </CButton>
              </CCol>
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
          <strong>Lorry Arrival Details</strong>
        </CCardHeader>
        <CCardBody>
          <LorryArrivalModal
            handleLorrySubmit={handleLorrySubmit}
            iseEditData={iseEditData}
            VehicleAllDetal={VehicleAllDetal}
            handleDriverSubmit={handleDriverSubmit}
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
              data={lorryArrival}
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

export default LorryArrival;
