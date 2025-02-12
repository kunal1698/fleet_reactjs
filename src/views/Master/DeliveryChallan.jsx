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
import DcModal from 'views/component/DcModal';
import { useSelector } from 'react-redux';
function DeliveryChallan() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [DCDetaiil, SetDc] = useState([]);

  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchDC();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('UpdateDcReceiving', {
          ...formData,
          ReceivingUpdateUser: userData[0]?.nid,
          DCRecivingStatus: 'Received'
        });
        setShowModal(false);
        toast.success(response.message);
        fetchDC();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const fetchDC = async () => {
    try {
      const result = await getRequest('GetallDCReceiving', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        SetDc(result.data);
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

  const handleEdit = (lorryDetail) => {
    console.warn('f', lorryDetail);
    setShowModal(true);
    setIsEdit(true);
    setFormData({
      ReceiverName: lorryDetail.TransporterName,
      CNNumber: lorryDetail.CNNumber,
      DriverFirstName: lorryDetail.DriverFirstName,
      ReceiverMobile: lorryDetail.DriverMobile,
      ReceivingRemark: lorryDetail.Rermark,
      VehicleLabel: lorryDetail.VehicleNumber,
      vehicle: lorryDetail.Vehicle,
      ReceivingUpdateDate: lorryDetail.AddDate,
      UnloadingAddress: lorryDetail.DeliveryPoint,
      NTPCChallanDoc: lorryDetail.NTPCChallanDoc,
      KataDoc: lorryDetail.KataDoc,
      BuiltyDoc: lorryDetail.BuiltyDoc,
      VehicleDoc: lorryDetail.VehicleDoc,
      GpsLocationDoc: lorryDetail.GpsLocationDoc
    });
    setShowModal(true);
    // setisEditData(lorryDetail);
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
      name: 'ArrivalStatus',
      label: 'Receiving Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const user = DCDetaiil[tableMeta.rowIndex];
          const badgeStyle = {
            color: user.ArrivalStatus === 'Received' ? '#5cb85c' : '#dc3545',
            fontWeight: 'bold'
          };
          return <div style={badgeStyle}>{user.ArrivalStatus}</div>;
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
          const lorryDetail = DCDetaiil[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <CCol className="d-grid  d-md-flex justify-content-start">
                <CButton
                  disabled={permissionRole[18]?.pwrite == '0'}
                  onClick={() => handleEdit(lorryDetail)}
                  style={{ color: 'white', backgroundColor: '#5FA9FF', fontWeight: 'bold' }}
                >
                  Modify
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
          <strong>DC Received Details</strong>
        </CCardHeader>
        <CCardBody>
          <DcModal
            handleSubmit={handleSubmit}
            // handleLorrySubmit={handleLorrySubmit}
            // iseEditData={iseEditData}
            // VehicleAllDetal={VehicleAllDetal}
            // handleDriverSubmit={handleDriverSubmit}
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
              data={DCDetaiil}
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

export default DeliveryChallan;
