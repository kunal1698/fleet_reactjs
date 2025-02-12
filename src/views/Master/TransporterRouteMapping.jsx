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
import 'react-datepicker/dist/react-datepicker.css';

import useApiManager from 'views/component/ApiManager';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';

function TransporterRouteMapping() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [transportlist, setTransportlist] = useState([]);
  const [routeDetail, setRouteDetail] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [reportDetail, setReportDetail] = useState([]);
  const [transportMappingDetail, setTransportMapping] = useState([]);
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null); // New state for selected branch
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  useEffect(() => {
    fetchTransport();
    fetchBranch();
    fetchTransportMapping();
  }, []);
  const fetchTransportMapping = async (userTrans) => {
    try {
      const result = await getRequest('GetallTransporterRoute', { ...formData, userid: userData[0]?.nid, tranId: formData?.TransID || '' });
      if (result.IsSuccess) {
        setTransportMapping(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  useEffect(() => {
    if (selectedBranch) {
      fetchRoute();
    }
  }, [selectedBranch]);

  const fetchBranch = async () => {
    try {
      const result = await postRequest('getAllBranch', {
        userId: userData[0].nid,
        id: ''
      });
      if (result.IsSuccess) {
        setBranch(result.data);
        console.log('branch', result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching branch:', error);
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
      console.error('Error fetching transport:', error);
    }
  };

  const fetchRoute = async () => {
    try {
      const result = await getRequest('getAllRoute', {
        ...formData,
        userid: userData[0]?.nid,
        branchId: selectedBranch ? selectedBranch.value : ''
      });
      if (result.IsSuccess) {
        const filtered = result.data.filter((route) => route.OfficeName === selectedBranch?.value);
        setFilteredRoutes(filtered);
        setRouteDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const handleDelete = async (user) => {
    try {
      const response = await postRequest('deleteRouteMapping', {
        ...formData,
        id: user.nid
      });
      if (response.data) {
        toast.success(response?.message);
        fetchTransportMapping(user);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting route mapping:', error);
    }
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('insertTransporter_RouteMapping', {
          ...formData,
          AddUser: userData[0]?.nid
        });
        if (response.data) {
          toast.success(response?.message);
          setValidated(false);
          fetchTransportMapping();
          setReportDetail(response.data);
          setFormData({ ...formData, FromDate: '', ToDate: '' });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
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
      name: 'TransporterName',
      label: 'Transporter Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'RouteName',
      label: 'Route Name',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'RateInTon',
      label: 'Rate Per Ton',
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
          const user = transportMappingDetail[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2" style={{ cursor: 'pointer' }}>
              <button
                disabled={permissionRole[13]?.pdelete == '0'}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleDelete(user)}
              >
                <FaTrashAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
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
          <strong>Transporter Route Mapping Details</strong>
        </CCardHeader>
        <CCardBody>
          <CForm className="row" onSubmit={handleReportSubmit}>
            <CCol xl={3} xs="12" sm="6" md="3">
              <div className="form-group">
                <label htmlFor="Branch">Branch</label>
                <ReactSelect
                  required
                  options={branch?.map((branch) => ({
                    label: `${branch.OfficeName}-${branch.BranchState}`,
                    value: branch.OfficeName
                  }))}
                  value={selectedBranch}
                  onChange={(selectedOption) => {
                    setSelectedBranch(selectedOption);
                    setFormData({
                      ...formData,
                      BranchID: selectedOption.value,
                      BranchLabel: selectedOption.label
                    });
                  }}
                  placeholder="Please select Branch"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xl={3} xs="12" sm="6" md="3">
              <div className="form-group">
                <label htmlFor="Route">Select Route</label>
                <ReactSelect
                  required
                  options={filteredRoutes?.map((route) => ({
                    label: route.RouteName,
                    value: route.nid
                  }))}
                  value={{
                    label: formData?.RouteLabel || 'Select Route',
                    value: formData?.RouteLabel
                  }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      RouteID: selectedOption.value,
                      RouteLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Route"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xl={3} xs="12" sm="6" md="3">
              <div className="form-group">
                <label htmlFor="Transporter">Transporter</label>
                <ReactSelect
                  required
                  options={transportlist?.map((transport) => ({
                    label: transport.TransporterName,
                    value: transport.nid
                  }))}
                  value={{
                    label: formData?.TransportLabel || 'Select Transporter',
                    value: formData?.TransportLabel
                  }}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      TransID: selectedOption.value,
                      TransportLabel: selectedOption.label
                    });
                  }}
                  placeholder="Please select Transporter"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xl={2} xs="12" sm="6" md="3" style={{ marginTop: '5px' }}>
              <div className="form-group">
                <label htmlFor="RateInTon">Rate Per Ton</label>
                <CFormInput
                  type="text"
                  id="RateInTon"
                  name="RateInTon"
                  value={formData.RateInTon}
                  onChange={(event) => setFormData({ ...formData, RateInTon: event.target.value })}
                  placeholder="Rate Per TON"
                  required
                />
              </div>
            </CCol>

            <CCol xl={1} xs="12" sm="6" md="3" className="d-flex align-items-center ">
              <div className="d-flex align-items-center" style={{ marginTop: '15px' }}>
                <CButton disabled={!formData.TransID || !formData.RouteID || !formData.RateInTon} color="primary" type="submit">
                  Add
                </CButton>
              </div>
            </CCol>
          </CForm>

          <div className="custom-mui-table mt-4">
            <MUIDataTable
              data={transportMappingDetail}
              columns={columns}
              options={{
                ...options,
                responsive: 'standard'
              }}
              className="custom-mui-datatable"
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

export default TransporterRouteMapping;
