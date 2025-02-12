import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormSelect, CRow } from '@coreui/react';

import MUIDataTable from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import useApiManager from 'views/component/ApiManager';
import { REACT_LOGIN, REACT_PASS } from 'Variable';

function UserRole() {
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [validated, setValidated] = useState(false);
  const [userRoleId, setUserRoleId] = useState('');
  const [userList, setUserList] = useState([]);
  const [userMenuList, setUserMenuList] = useState([]);
  const [userTypeList, setUsertypeList] = useState([]);
  const [userType, setUserType] = useState('');
  const [filteredUserList, setFilteredUserList] = useState([]);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const storedData = JSON.parse(localStorage.getItem('role')) || [];

  const filteredRole = storedData.filter((item) => item.MainMenu == 'Master');
  const filteredUserRole = filteredRole.filter((item) => item.SubMenu == 'User Role');
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [formCheckData, setCheckData] = useState({
    pdelete: checkboxStates,
    pread: checkboxStates,
    pwrite: checkboxStates
  });
  useEffect(() => {
    fetchUserList();
    fetchUserType();
  }, []);

  const fetchUserList = async () => {
    try {
      const result = await getRequest('/getalluser', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        const filtereduser = result.data.filter((item) => item.Status == 'Active');
        setUserList(filtereduser);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const fetchMenuList = async (userId) => {
    try {
      const result = await getRequest('/getAllMenuSubmenubyUSer', formData, false, userId);
      if (result.IsSuccess) {
        setUserMenuList(result.data);
        const initialCheckboxStates = result.data.map((menuItem) => ({
          pread: menuItem?.pread == '1' ? '1' : '0',
          pwrite: menuItem?.pwrite == '1' ? '1' : '0',
          pdelete: menuItem?.pdelete == '1' ? '1' : '0'
        }));
        setCheckboxStates(initialCheckboxStates);
        // dispatch({ type: 'set', userRoleData: result.data });
        localStorage.setItem('role', JSON.stringify(result.data));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCheckboxOnChange = async (e, rowIndex) => {
    const { name, checked } = e.target;
    const updatedCheckboxStates = [...checkboxStates];
    const updateMenuList = [...userMenuList];
    updatedCheckboxStates[rowIndex] = {
      ...updatedCheckboxStates[rowIndex],
      [name]: checked ? '1' : '0'
    };
    setCheckboxStates(updatedCheckboxStates);
    localStorage.setItem('role', JSON.stringify(userMenuList));
    localStorage.setItem('onRoleChange', name);
    console.warn('updatedCheckboxStates', updatedCheckboxStates);
    const updatedFormCheckData = {
      ...formCheckData,
      UserID: formData.LoginName, // Assuming this is how you get userRoleId
      mid: updateMenuList[rowIndex]?.nid,
      pdelete: updatedCheckboxStates[rowIndex]?.pdelete,
      pread: updatedCheckboxStates[rowIndex]?.pread,
      pwrite: updatedCheckboxStates[rowIndex]?.pwrite,
      AddUser: userData[0]?.nid
    };
    try {
      const result = await postRequest('/insertUserRole', updatedFormCheckData);
      if (result.IsSuccess) {
        toast.success(result.data[0]?.EMsg);
        fetchMenuList(formData.LoginName);
      } else {
        console.error(result.message);
        toast.error('Failed to update permission');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Error updating permission');
    }
  };

  const fetchUserType = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        APILOgin: REACT_LOGIN,
        APIPASS: REACT_PASS,
        id: ''
      })
    };
    try {
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx//getalluserType', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        const activeUsers = result.data.filter((user) => user.Status === 'Active');
        setUsertypeList(activeUsers);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const columns = [
    {
      name: 'index',
      label: 'Sr No.',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          return <span>{dataIndex + 1}</span>;
        }
      }
    },

    {
      name: 'MainMenu',
      label: 'Main Menu',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'SubMenu',
      label: 'Sub Menu',
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
          const user = userMenuList[tableMeta.rowIndex];
          console.warn('sd', tableMeta);
          return (
            <CRow className="">
              <div className="d-flex gap-2">
                <div>
                  <input
                    type="checkbox"
                    id={`pread${tableMeta.rowIndex}`}
                    name="pread"
                    className="me-2 mt-2"
                    onChange={(e) => handleCheckboxOnChange(e, tableMeta.rowIndex)}
                    checked={checkboxStates[tableMeta.rowIndex]?.pread === '1'}
                  />
                  <label htmlFor={`pread${tableMeta.rowIndex}`}>Read</label>
                </div>
                <div>
                  <input
                    disabled={checkboxStates[tableMeta.rowIndex]?.pread === '0'}
                    type="checkbox"
                    id={`pwrite${tableMeta.rowIndex}`}
                    name="pwrite"
                    className="me-2 mt-2"
                    onChange={(e) => handleCheckboxOnChange(e, tableMeta.rowIndex)}
                    checked={checkboxStates[tableMeta.rowIndex]?.pwrite === '1'}
                  />
                  <label htmlFor={`pwrite${tableMeta.rowIndex}`}>Write</label>
                </div>
                <div>
                  <input
                    disabled={checkboxStates[tableMeta.rowIndex]?.pread === '0'}
                    type="checkbox"
                    id={`pdelete${tableMeta.rowIndex}`}
                    name="pdelete"
                    className="me-2 mt-2"
                    onChange={(e) => handleCheckboxOnChange(e, tableMeta.rowIndex)}
                    checked={checkboxStates[tableMeta.rowIndex]?.pdelete === '1'}
                  />
                  <label htmlFor={`pdelete${tableMeta.rowIndex}`}>Delete</label>
                </div>
              </div>
            </CRow>
          );
        }
      }
    }
  ];

  const handleUserTypeChange = (e) => {
    const selectedUserType = e.target.value;
    console.log('Selected User Type:', selectedUserType); // Debugging line
    setFormData({ ...formData, UserType: selectedUserType });
    setUserType(selectedUserType);

    // Filter the user list based on the selected UserType
    const filteredList = userList.filter((user) => user.User_Type === selectedUserType);
    console.log('Filtered User List:', filteredList); // Debugging line
    setFilteredUserList(filteredList);

    // Optionally, reset the selected LoginName
    setFormData({ ...formData, LoginName: '' });
  };

  const handleLoginNameChange = (e) => {
    const selectedLoginName = e.target.value;
    setFormData({ ...formData, LoginName: selectedLoginName });
    setUserRoleId(selectedLoginName);
    fetchMenuList(selectedLoginName);
  };
  const options = {
    filterType: 'text',
    selectableRows: 'none',
    responsive: 'stacked', // Display headers stacked on mobile devices
    viewColumns: false // Hide view columns toggle
  };
  console.warn('dfds', formData);
  return (
    <>
      <CCard style={{ marginBottom: '10%' }}>
        <CCardHeader>
          <strong style={{ fontWeight: 'bold' }}>User Role</strong>
        </CCardHeader>
        <CCardBody>
          <CForm className="row g-3 needs-validation" noValidate validated={validated}>
            <CRow className="mt-2">
              <CCol xs="6">
                <CFormSelect
                  id="UserType"
                  placeholder="Select User Type"
                  label={<span>User Type</span>}
                  value={formData.UserType}
                  onChange={handleUserTypeChange}
                  required
                >
                  <option value="">Select User Type</option>
                  {userTypeList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.UserType}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs="6">
                <div>
                  <CFormSelect
                    id="LoginName"
                    name="LoginName"
                    value={formData.LoginName}
                    onChange={handleLoginNameChange}
                    label={<span>Select User Name</span>}
                    required
                  >
                    <option value="">Select User Name</option>

                    {filteredUserList.map((user) => (
                      <option key={user.nid} value={user.nid}>
                        {user.LoginName}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>
          </CForm>
          <div className={`custom-mui-table  mt-4`}>
            <MUIDataTable
              data={userMenuList}
              columns={columns}
              options={{
                ...options,
                rowHeight: 'dense',
                responsive: 'standard'
              }}
              className=""
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

export default UserRole;
