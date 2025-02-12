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
import StationaryModal from 'views/component/StationaryModal';
import useApiManager from 'views/component/ApiManager';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
function StationaryMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [editData, setisEditData] = useState('');
  const [stationaryDetail, setStationaryDetail] = useState([]);
  const [serviceProviderDetail, seServiceProviderDetail] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [branchDetail, setBranchDetail] = useState([]);
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchStationary();
    fetchBranch();
    fetchServiceProvider();
  }, []);

  const fetchServiceProvider = async () => {
    try {
      const result = await getRequest('GetallClient', formData);
      if (result.IsSuccess) {
        seServiceProviderDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
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

  const handleStationarySubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertStationary', { ...formData, AddUser: userData[0]?.nid });
        if (response.data[0].msg == 'Stationary Name Already Available') {
          toast.error(response.data[0].msg);
        } else {
          toast.success(response.data[0].msg);
          setShowModal(false);
        }
        fetchStationary();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleStationaryEdit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('UpdateStationary', { ...formData, UpdateUser: userData[0]?.nid, id: editData?.nid });
        setShowModal(false);
        fetchStationary();
        toast.success('Stationary Updated Successfully.');
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
      Bookname: user.Bookname,
      ServiceProviderId: user.ServiceProviderId,
      ServiceProviderLabel: user.ServiceProviderName,
      Booktype: user.Booktype,
      Nature: user.Nature,
      Label: user.BranchName,
      BranchId: user.BranchId,
      StationaryCode: user.StationaryCode,
      StationaryNumber: user.StationaryNumber,
      StartingPage: user.StartingPage,
      LastpageNumber: user.LastpageNumber,
      EffectiveFrom: user.EffectiveFrom,
      ExpiryDate: user.ExpiryDate
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivetStation', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchStationary();
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
      name: 'Bookname',
      label: 'Book Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Booktype',
      label: 'Book Type',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Nature',
      label: 'Nature',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'SPName',
      label: 'Service Provider Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BranchName',
      label: 'Branch Name',
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
          const user = stationaryDetail[tableMeta.rowIndex];
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
          const user = stationaryDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[11]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[11]?.pdelete == '0'}
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
    <CCard style={{ marginBottom: '10%' }}>
      <CCardHeader>
        <strong>Stationary Details</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="">
          <CCol xs="12" className="d-grid gap-2 d-md-flex">
            <CButton
              disabled={permissionRole[11]?.pwrite == '0'}
              onClick={() => setShowModal(!showModal)}
              color="primary"
              className="me-md-2"
            >
              Add Stationary
            </CButton>
          </CCol>
        </CRow>
        <StationaryModal
          serviceProviderDetail={serviceProviderDetail}
          branchDetail={branchDetail}
          handleInputChange={handleInputChange}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          handleStationarySubmit={handleStationarySubmit}
          handleStationaryEdit={handleStationaryEdit}
          validated={validated}
          formData={formData}
          setFormData={setFormData}
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <div className="custom-mui-table mt-4">
          <MUIDataTable
            // title={'User Client List'}
            data={stationaryDetail}
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

export default StationaryMaster;
