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
import MUIDataTable from 'mui-datatables';
import BranchModal from 'views/component/BranchModal';
import useApiManager from 'views/component/ApiManager';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
// import { uploadFileToS3 } from 'views/component/UploadS3';
function BranchMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [branchDetail, setBranchDetail] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setisEditData] = useState('');
  const [rendomFileNameSave, setRendomFileName] = useState('');
  const [FileChange, setFileChange] = useState('');
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => {
    fetchLedger();
    fetchBranch();
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
  const handleBranchSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertBranch', { ...formData, AddUser: userData[0]?.nid });
        setShowModal(false);
        handleFileChangeSubmit(rendomFileNameSave, FileChange);
        toast.success(response.data[0]?.EMsg);
        fetchBranch();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  const handleBranchUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('editBranch', {
          ...formData,
          UpdateUser: userData[0]?.nid,
          nid: editData?.nid
        });
        setShowModal(false);
        fetchBranch();
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactiveBranch', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        fetchBranch();
        toast.success('Status Updated Successfully.');
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
      BranchState: selectedOption.value
    });

    const districts = statesData.states.find((state) => state.state === selectedOption.value)?.districts || [];
    setDistrictOptions(
      districts.map((district) => ({
        value: district,
        label: district
      }))
    );
  };

  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      BranchDistrict: selectedOption.value
    });
  };

  const stateDataFilter = statesData?.states?.map((item) => item.state);
  const stateOptions = stateDataFilter?.map((state) => ({
    value: state,
    label: state
  }));

  const handleEdit = (user) => {
    setFormData({
      OfficeName: user.OfficeName,
      OfficeLocation: user.OfficeLocation,
      ContactName: user.ContactName,
      ContactEmail: user.ContactEmail,
      ContactMobile: user.ContactMobile,
      ContactAddress: user.ContactAddress,
      BranchState: user.BranchState,
      BranchDistrict: user.BranchDistrict,
      BranchCity: user.BranchCity,
      BranchPincode: user.BranchPincode,
      PANNo: user.PANNo,
      GSTNo: user.GSTNo,
      GSTNature: user.GSTNature,
      Label: user.LedgerName,
      LedgerID: user.LedgerID,
      Attachment: user.Attachment
    });
    const districts = statesData.states.find((state) => (state.state = user.BranchState)).districts || [];
    setDistrictOptions(
      districts.map((district) => ({
        value: district,
        label: district
      }))
    );
    setIsEdit(true);
    setShowModal(true);
    setisEditData(user);
    scrollToTop();
  };

  const handleFileChangeSubmit = (file, FileChange) => {
    // uploadFileToS3(file, FileChange);
  };
  const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    const randomFileName = generateRandomString(10);
    const fileExtensionSend = file.name.split('.').pop();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'bmp', 'doc', 'txt'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type. Please upload files with extensions: ${allowedExtensions.join(', ')}`);
      setFileChange('');
      return;
    } else {
      setFileChange(file);
    }
    setRendomFileName(randomFileName + '.' + fileExtensionSend);
    // uploadFileToS3(randomFileName + '.' + fileExtensionSend, file);
    setFormData({
      ...formData,
      BranchFile: randomFileName + '.' + fileExtensionSend
    });
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
      name: 'OfficeName',
      label: 'Branch Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'GSTNature',
      label: 'GST Nature',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'OfficeLocation',
      label: 'Branch Location',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactName',
      label: 'Contact Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactMobile',
      label: 'Contact Mobile',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ContactAddress',
      label: 'Contact Address',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BranchState',
      label: 'Branch State',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BranchCity',
      label: 'Branch City',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'BranchPincode',
      label: 'Branch Pincode',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'PANNo',
      label: 'PAN No',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'GSTNo',
      label: 'GST No',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'GSTNature',
      label: 'GST Nature',
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
          const user = branchDetail[tableMeta.rowIndex];
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
          const user = branchDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[5]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[5]?.pdelete == '0'}
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
          <strong>Branch Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[5]?.pwrite == '0'}
                onClick={() => setShowModal(!showModal)}
                color="primary"
                className="me-md-2"
              >
                Add New Branch / Site
              </CButton>
            </CCol>
          </CRow>

          <BranchModal
            districtOptions={districtOptions}
            handleStateChange={handleStateChange}
            stateOptions={stateOptions}
            handleDistricChange={handleDistricChange}
            handleFile={handleFile}
            handleBranchUpdate={handleBranchUpdate}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            ledgerOption={ledgerOption}
            handleBranchSubmit={handleBranchSubmit}
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
              data={branchDetail}
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

export default BranchMaster;
