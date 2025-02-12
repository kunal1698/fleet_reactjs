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
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CModalBody
} from '@coreui/react';
import CommonForm from './CommonForm';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import useApiManager from 'views/component/ApiManager';
import Select from 'react-select';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeOff from '../../../src/assets/images/eyeOff.png';
import eyeOn from '../../../src/assets/images/eyeOn.png';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function UserMaster() {
  const [inputValue, setInputValue] = useState('');
  const [userList, setUserList] = useState([]);
  const [userTypeList, setUsertypeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setisEditData] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalTypeMaster, setShowModalTypeMaster] = useState(false);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchUserType();
    fetchAllUser();
    fetchBranch();
  }, []);

  const [branchDetail, setBranchDetail] = useState([]);

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

  const fetchUserType = async () => {
    try {
      const result = await getRequest('getalluserType', formData);
      if (result.IsSuccess) {
        const activeUsers = result.data.filter((user) => user.Status === 'Active');
        setUsertypeList(activeUsers);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const fetchAllUser = async () => {
    try {
      const result = await getRequest('getalluser', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setUserList(result.data);
        // Extract headers from the keys of the first object
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const handleUserMasterSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertuser', { ...formData, AddStamp: userData[0]?.nid });
        fetchAllUser();
        setShowModal(false);
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  const handleUserMasterUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('edittuser', {
          ...formData,
          AddStamp: userData[0]?.nid,
          id: editData?.nid
        });
        fetchAllUser();
        setShowModal(false);
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
    urlencoded.append('istatus', newStatus);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactiveuser', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        toast.success('Status Updated Successfully.');
        fetchAllUser();
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
      mobile: newValue
    }));
  };
  console.warn('sdfdfs', formData);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    form.classList.add('was-validated');

    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertuserType', { ...formData, AddStamp: userData[0]?.nid });
        fetchUserType();
        setShowModalTypeMaster(false);
        toast.success('User Role Created Successfully.');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMultiChange = (selectedOptions) => {
    const selectedBranches = selectedOptions.map((option) => option.value).join(',');
    setFormData({
      ...formData,
      Company_id: selectedBranches,
      Label: selectedOptions.map((option) => option.label).join(', ')
    });
  };
  const userMasterModal = () => {
    return (
      <div className="modal-dialog modal-lg">
        <CModal
          className="modal-lg"
          alignment="center"
          visible={showModal}
          onClose={() => {
            setShowModal(false);
            setFormData({
              ...formData,
              LoginId: '',
              UserName: '',
              pass: '',
              UserType: '',
              AddStamp: '1',
              mobile: '',
              emailid: '',
              Company_id: ''
            });
            setIsEdit(false);
          }}
          aria-labelledby={isEdit ? 'UpdateForm' : 'VerticallyCenteredExample'}
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">{!isEdit ? 'Add User' : 'Update User'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CommonForm
              validated={validated}
              onSubmit={!isEdit ? handleUserMasterSubmit : handleUserMasterUpdate}
              type="text"
              id="exampleFormControlInput1"
              placeholder="Enter User Role"
              className="form-control"
              // isEdit={isEdit}
              // btnText="Submit"
              inputs={
                <>
                  <CRow className="mt-3">
                    <CCol xs="6">
                      <CFormInput
                        type="text"
                        id="UserName"
                        label={
                          <span>
                            Name{' '}
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        placeholder="Name"
                        value={formData.UserName}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                    <CCol xs="6">
                      <CFormInput
                        type="number"
                        id="mobile"
                        label={
                          <span>
                            Mobile Number{' '}
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        required
                      />
                    </CCol>
                    <CCol className="mt-3" xs="6">
                      <CFormInput
                        type="text"
                        id="LoginId"
                        label={
                          <span>
                            Login Id{' '}
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        placeholder="Login Id"
                        value={formData.LoginId}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                    <CCol className="mt-3" xs="6">
                      <div className="password-input-container">
                        <div className="input-with-icon">
                          <CFormInput
                            type={showPassword ? 'text' : 'password'}
                            id="pass"
                            label={
                              <span>
                                Password{' '}
                                <span className="ms-1" style={{ color: 'red' }}>
                                  *
                                </span>
                              </span>
                            }
                            placeholder="Password"
                            value={formData.pass}
                            onChange={handleChange}
                            required
                          />
                          {formData.pass && (
                            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                              <img src={showPassword ? eyeOn : eyeOff} alt="Toggle Password Visibility" />
                            </span>
                          )}
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs="6">
                      <CFormInput
                        type="email"
                        id="emailid"
                        label={
                          <span>
                            Email Id{' '}
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        placeholder="Email Id"
                        value={formData.emailid}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                    <CCol xs="6">
                      <CFormSelect
                        id="UserType"
                        placeholder="Select User Role"
                        label={<span>User Role</span>}
                        value={formData.UserType || ''}
                        onChange={handleChange}
                        required
                        className="border border-gray"
                      >
                        <option>Select User Role</option>
                        {userTypeList.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.UserType}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol xl={12}>
                      <div className="form-group mt-1">
                        <div className="ms-2">
                          <label className="ms-1 mt-2" htmlFor="state">
                            Branch
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </label>
                        </div>
                        <Select
                          options={branchDetail.map((branch) => ({
                            label: `${branch.OfficeName}-${branch.BranchState}`,
                            value: branch.nid
                          }))}
                          value={formData.Company_id?.split(',').map((id) => ({
                            label: branchDetail?.find((branch) => branch.nid.toString() === id.toString())?.OfficeName,
                            value: id
                          }))}
                          onChange={handleMultiChange}
                          placeholder="Please select Branch"
                          classNamePrefix="custom-select"
                          className="basic-single form-control-sm"
                          isMulti // Enable multi-select functionality
                        />
                      </div>
                    </CCol>
                  </CRow>
                  <hr />
                  <CRow className="">
                    <CCol xs="12" className="d-grid gap-2 d-md-flex justify-content-md-end">
                      {!isEdit ? (
                        <CButton color="primary" className="me-md-2" type="submit">
                          Submit
                        </CButton>
                      ) : (
                        <CButton color="primary" className="me-md-2" type="submit">
                          Update
                        </CButton>
                      )}
                      <CButton color="danger">Cancel</CButton>
                    </CCol>
                  </CRow>
                </>
              }
            />
            {/* <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={!isEdit ? handleSubmit : handleUpdate}
            >
             
            </CForm> */}
          </CModalBody>
        </CModal>
      </div>
    );
  };

  const userTypeMasterModal = () => {
    return (
      <CModal
        alignment="center"
        visible={showModalTypeMaster}
        onClose={() => {
          setShowModalTypeMaster(false);
          setIsEdit(false);
          setFormData({
            LoginId: '',
            UserName: '',
            emailid: '',
            pass: '',
            UserType: '',
            AddStamp: '',
            mobile: '',
            Company_id: '',
            istatus: ''
          });
        }}
        aria-labelledby={isEdit ? 'UpdateForm' : 'VerticallyCenteredExample'}
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add Role </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CommonForm
            validated={validated}
            onSubmit={handleSubmit}
            type="text"
            id="exampleFormControlInput1"
            label={<span>Enter User Role</span>}
            value={formData.UserType}
            onChange={(e) => setFormData({ ...formData, UserType: e.target.value })}
            placeholder="Enter User Role"
            className="form-control"
            isEdit={isEdit}
            btnText="Submit"
            inputs={
              <>
                <CRow className="mt-1">
                  <CCol xs="12">
                    <CFormInput
                      type="text"
                      id="UserType"
                      label={
                        <span>
                          Enter User Role{' '}
                          <span className="ms-1" style={{ color: 'red' }}>
                            *
                          </span>
                        </span>
                      }
                      value={formData.UserType}
                      onChange={(e) => setFormData({ ...formData, UserType: e.target.value })}
                      placeholder="Enter User Role"
                      className="form-control"
                      required
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="auto" className="d-grid gap-2 d-md-flex justify-content-center mt-2  align-items-end">
                    <CButton color="primary" className="" type="submit">
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              </>
            }
          />
        </CModalBody>
      </CModal>
    );
  };

  const handleEdit = (user) => {
    setFormData({
      LoginId: user.Login_ID,
      UserName: user.LoginName,
      emailid: user.Emailid,
      pass: user.Login_Pass,
      UserType: user.User_Type,
      AddStamp: user.AddStamp,
      mobile: user.MobileNo,
      Company_id: user.BranchIds,
      istatus: user.istatus
    });
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
      name: 'LoginName',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
        // Exclude this column from display initially
        responsive: 'stacked'
      }
    },
    {
      name: 'Emailid',
      label: 'Email Id',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'MobileNo',
      label: 'Mobile Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'User_Type',
      label: 'User Role',
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
          const user = userList[tableMeta.rowIndex];
          const badgeStyle = {
            color: user.Status === 'Active' ? '#5cb85c' : '#dc3545',
            fontWeight: 'bold'
          };
          return <div style={badgeStyle}>{user.Status}</div>;
        }
      }
    },

    {
      name: 'AddUser',
      label: 'Add User',
      options: {
        filter: false,
        sort: false
      }
    },

    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.warn('dfdfs', tableMeta);
          const user = userList[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[1]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggle(user)}
                  disabled={permissionRole[1]?.pdelete == '0'}
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
    selectableRows: 'none',
    responsive: 'stacked', // Display headers stacked on mobile devices
    viewColumns: false // Hide view columns toggle
  };

  return (
    <>
      <CCard style={{ marginBottom: '10%' }}>
        <CCardHeader>
          <strong style={{ fontWeight: 'bold' }}>User Details</strong>
        </CCardHeader>

        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex justify-content-md">
              <CButton
                disabled={permissionRole[1]?.pwrite == '0' ? true : false}
                onClick={() => setShowModal(true)}
                color="primary"
                className="me-md-2"
              >
                Add User
              </CButton>
              <CButton
                disabled={permissionRole[1]?.pwrite == '0' ? true : false}
                onClick={() => setShowModalTypeMaster(!showModalTypeMaster)}
                color="primary"
                className="me-md-2"
              >
                Add User Role
              </CButton>
            </CCol>
          </CRow>
          {userMasterModal()}
          {userTypeMasterModal()}
          {/* Table */}
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              // title={'User List'}
              data={userList}
              columns={columns}
              options={{
                ...options,
                rowHeight: 'dense',
                responsive: 'standard' // Adjust responsiveness as needed
                // Additional options can be added here
              }}
              className="custom-mui-datatable"
            />
          </div>
          {/* <div className="mt-3 custom-mui-datatable"></div> */}
        </CCardBody>
      </CCard>
    </>
  );
}

export default UserMaster;
