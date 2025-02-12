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
import POModal from 'views/component/POModal';
import { useSelector } from 'react-redux';
import useApiManager from 'views/component/ApiManager';
import { FaPencilAlt } from 'react-icons/fa';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import { toast } from 'react-toastify';
function POMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [PoDetail, setPoDetail] = useState([]);
  const [ParentDetail, setParentDetail] = useState([]);
  const [branchDetail, setBranchDetail] = useState([]);
  const [ServiceDetail, setService] = useState([]);
  const [materialDetail, setMaterial] = useState([]);
  const [routeDetail, setRouteDetail] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [editData, setisEditData] = useState('');

  const [consignorAndConsignee, setConsignorAndConsignee] = useState([]);
  const permissionRole = useSelector((state) => state.value);
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const { postRequest, formData, setFormData, getRequest } = useApiManager();

  useEffect(() => {
    fetchParentalCompany();
    fetchBranch();
    fetchService();
    fetchMaterial();
    fetchPO();
    fetchConsignorAndConsignee();
    fetchRoute();
  }, []);

  const fetchMaterial = async () => {
    try {
      const result = await getRequest('getAllMaterial', formData);
      if (result.IsSuccess) {
        setMaterial(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const fetchRoute = async () => {
    try {
      const result = await getRequest('getAllRoute', { ...formData, userid: userData[0]?.nid });
      if (result.IsSuccess) {
        setRouteDetail(result.data);
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

  const fetchService = async () => {
    try {
      const result = await getRequest('GetallClient', formData);
      if (result.IsSuccess) {
        setService(result.data);
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

  const fetchParentalCompany = async () => {
    try {
      const result = await getRequest('GetallParentCompany', formData);
      if (result.IsSuccess) {
        // setBillingOfcDetail(result.data);
        setParentDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handlePOSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertPO', {
          ...formData,
          AddUser: userData[0]?.nid,
          LOADocument: '',
          PODocument: '',
          PoExtdate: ''
        });
        fetchPO();
        if (response.data[0].msg == 'PO NUMBER ALREADY DONE') {
          toast.error(response.data[0].msg);
        } else {
          toast.success(response.data[0].msg);
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handlePOMasterUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('UpdatePO', {
          ...formData,
          UpdateUser: userData[0]?.nid,
          id: editData?.nid
        });
        fetchPO();
        setShowModal(false);
        toast.success('PO Updated Successfully.');
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
    setIsEdit(true);
    setFormData({
      POExtensation: user.POExtensation,
      LOANumber: user.LOANumber,
      ConsignorLabel: user.PartyName1,
      ConsigneeLabel: user.PartyName,
      ConsigneeID: user.ConsigneeID,
      ConsigneeID1: user.ConsigneeID1,
      ServiceProviderID: user.ServiceProviderID,
      RouteID: user.RouteID,
      RouteLabel: user.RouteName,
      ConsignorID: user.ConsignorID,
      ClientName: user.ClientName,
      PONumber: user.PONumber,
      LeadKM: user.LeadKM,
      POQty: user.POQty,
      ConversionFactor: user.ConversionFactor,
      QtyInTon: user.QtyInTon,
      PODate: user.PODate,
      ParantalLabel: user.CompanyName,
      PerantCompanyID: user.PerantCompanyID,
      POExpDate: user.POExpDate,
      PoExtdate: user.PoExtdate,
      MaterialLabel: user.MaterialName,
      MaterialId: user.MaterialId,
      BranchLabel: user.OfficeName,
      BranchID: user.BranchID,
      QtyType: user.QtyType,
      LOADocument: user.LOADocument,
      ServiceLabel: user.PerantCompanyName,
      PODocument: user.PODocument
    });
    setisEditData(user);
    setIsEdit(true);
    setShowModal(true);
    // scrollToTop();
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivetPO', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        toast.success('Status Updated Successfully.');
        fetchPO();
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
      name: 'PONumber',
      label: 'PO Number',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'LeadKM',
      label: 'Lead KM',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'POQty',
      label: 'PO Qty',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'ConversionFactor',
      label: 'Conversion Factor',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'QtyInTon',
      label: 'Qty In Ton',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'PerantCompanyName',
      label: 'Parantal Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'MaterialName',
      label: 'Material Name',
      options: {
        filter: true,
        sort: false
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
      name: 'Status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const user = PoDetail[tableMeta.rowIndex];
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
          const user = PoDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2">
              <button
                disabled={permissionRole[14]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[14]?.pdelete == '0'}
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
        <strong>Purchase Order Details</strong>
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
              Add PO
            </CButton>
          </CCol>
        </CRow>
        <POModal
          routeDetail={routeDetail}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          handlePOMasterUpdate={handlePOMasterUpdate}
          handlePOSubmit={handlePOSubmit}
          materialDetail={materialDetail}
          consignorAndConsignee={consignorAndConsignee}
          ServiceDetail={ServiceDetail}
          branchDetail={branchDetail}
          ParentDetail={ParentDetail}
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
            data={PoDetail}
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

export default POMaster;
