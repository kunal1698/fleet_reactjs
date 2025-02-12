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
import Select from 'react-select';
import DriverModal from 'views/component/DriverModal';
import MaterialGroupModal from 'views/component/MaterialGroupModal';
import useApiManager from 'views/component/ApiManager';
import { toast, ToastContainer } from 'react-toastify';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function MaterialGroup() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [editData, setisEditData] = useState('');
  const [materialDetail, setMaterial] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchMaterialGroup();
  }, []);

  const fetchMaterialGroup = async () => {
    try {
      const result = await getRequest('getAllMaterialGroup', formData);
      if (result.IsSuccess) {
        setMaterial(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleMaterialSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertMaterialGroup', { ...formData, AddUser: userData[0]?.nid });
        if (response.data[0].EMsg == 'Material Name Already Available') {
          toast.error(response.data[0].EMsg);
        } else {
          toast.success(response.data[0].EMsg);
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleMasterEdit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('editMaterialGroup', { ...formData, AddUser: userData[0]?.nid, id: editData?.nid });
        setShowModal(false);
        fetchMaterialGroup();
        toast.success('Material Group Updated Successfully.');
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
      GopupName: user.GopupName,
      Code: user.Code,
      UnitType: user.UnitType,
      Unit: user.Unit
    });
    setShowModal(true);
    setisEditData(user);
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
      name: 'GopupName',
      label: 'Gopup Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Unit',
      label: 'Unit',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'UnitType',
      label: 'Unit Type',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Code',
      label: 'Code',
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
          const user = materialDetail[tableMeta.rowIndex];
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
          const user = materialDetail[tableMeta.rowIndex];
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
          <strong>Material Group Details</strong>
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
                Add Material Group
              </CButton>
            </CCol>
          </CRow>
          <MaterialGroupModal
            handleInputChange={handleInputChange}
            validated={validated}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            formData={formData}
            handleMaterialSubmit={handleMaterialSubmit}
            handleMasterEdit={handleMasterEdit}
            setFormData={setFormData}
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              // title={'User Client List'}
              data={materialDetail}
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

export default MaterialGroup;
