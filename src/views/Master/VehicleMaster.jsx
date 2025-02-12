import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import {
  CForm,
  CFormInput,
  CCol,
  CRow,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardFooter
} from '@coreui/react';
import statesData from '../../../src/State.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from 'react-select';
import TransportModal from 'views/component/TransportModal';
import DriverModal from 'views/component/DriverModal';
import useApiManager from 'views/component/ApiManager';
import LedgerModal from 'views/component/LedgerModal';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from 'views/component/Capitalize';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import axios from 'axios';

function VehicleMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isfilled, setIsFilled] = useState(false);
  const [transportModal, setTransportModal] = useState(false);
  const [driverModal, setDriverModal] = useState(false);
  const [VehicleAllDetal, setVehicleAllDetal] = useState([]);
  const [ledgerModal, setLedgerModal] = useState(false);
  const [bankButton, setBankButton] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [driverOption, setDriverOption] = useState([]);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [transportlist, setTransportlist] = useState([]);
  const [VehicleLiveDetail, setVehicleLiveDetail] = useState([]);
  const [editData, setisEditData] = useState('');
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const permissionRole = useSelector((state) => state.value);

  console.warn(formData, 'formData');
  useEffect(() => {
    fetchLedger();
    fetchDriver();
    fetchTransport();
    fetchVehcile();
    setFormData({ ...formData, VehicleRc: '', VehicleInsuranceImg: '' });
  }, []);

  const fetchTransport = async () => {
    try {
      const result = await getRequest('getAllTransporter', formData);
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

  const handleTransportSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertTransporter', { ...formData, AddUser: userData[0]?.nid });
        setShowModal(false);
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const dateString = VehicleLiveDetail.registration_date;
  const year = new Date(dateString).getFullYear();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity()) {
      try {
        const result = await postRequest(
          !isEdit ? '/InsertVehicle' : '/editVehicle',
          !isEdit
            ? {
                ...formData,
                AddUser: userData[0]?.nid,
                Company_ID: userData[0]?.nid,
                Model: VehicleLiveDetail.maker_model,
                VehicleName: VehicleLiveDetail.vehicle_category_description,
                VehicleType: VehicleLiveDetail.vehicle_category,
                RegistrationYear: year,
                Maker: VehicleLiveDetail.maker_description,
                FuelType: VehicleLiveDetail.fuel_type,
                RegistrationDate: VehicleLiveDetail.registration_date,
                VehicleRc: formData.VehicleRc,
                VehicleInsuranceImg: formData.VehicleInsuranceImg
              }
            : {
                ...formData,
                UpdateUser: userData[0]?.nid,
                Company_ID: userData[0]?.nid,
                VehicleName: VehicleLiveDetail.vehicle_category_description || editData.VehicleName,
                Model: VehicleLiveDetail.maker_model || editData.Model,
                VehicleName: VehicleLiveDetail.vehicle_category_description,
                VehicleType: VehicleLiveDetail.vehicle_category || editData.VehicleType,
                RegistrationYear: year || editData.RegistrationYear,
                Maker: VehicleLiveDetail.maker_description || editData.Maker,
                FuelType: VehicleLiveDetail.fuel_type || editData.FuelType,
                RegistrationDate: VehicleLiveDetail.registration_date || editData.RegistrationDate,
                VehicleRc: formData.VehicleRc,
                VehicleInsuranceImg: formData.VehicleInsuranceImg
              }
        );
        fetchVehcile();
        setValidated(false);
        setShowModal(false);
        if (result.EMsg === 'Item Already Alloted to vendor') {
          toast.error(result.data[0].EMsg);
        } else {
          toast.success(result.data[0].EMsg);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleTransportInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const stateDataFilter = statesData?.states?.map((item) => item.state);
  const stateOptions = stateDataFilter?.map((state) => ({
    value: state,
    label: state
  }));

  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      BillingState: selectedOption.value
    });

    const districts = statesData.states.find((state) => state.state === selectedOption.value)?.districts || [];
    setDistrictOptions(
      districts.map((district) => ({
        value: district,
        label: district
      }))
    );
  };

  const handleAutoFill = () => {
    // Example logic to autofill the form fields
    fetchLiveVehicle(VehicleLiveDetail);
    setIsFilled(true);
    // setFormData({
    //   ...formData,
    //   VehicleName: 'AutoFilledVehicleName',
    //   VehicleType: 'AutoFilledVehicleType',
    //   RegistrationYear: '2023', // Example autofill value
    //   Maker: 'AutoFilledMaker',
    //   FuelType: 'Petrol' // Example autofill value
    // });
  };

  const handleMobileChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      ContactNumber: newValue
    }));
  };

  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      BillingDistrict: selectedOption.value
    });
  };
  const fetchLiveVehicle = (VehicleNumber) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2NTU1NzE2MiwianRpIjoiZTFhYzdmNzMtOTQ3Ni00YmVlLTgzNWQtM2Y1OTk3YmZhZTMxIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnN2Z2pwckBzdXJlcGFzcy5pbyIsIm5iZiI6MTY2NTU1NzE2MiwiZXhwIjoxOTgwOTE3MTYyLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsid2FsbGV0Il19fQ.8QXkfAjZsa8QOV7DoRgXC9PnGYOrDlR-xTWiIx66k3A'
    );
    const raw = JSON.stringify({
      id_number: formData.VehicleNumber || VehicleNumber
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch('https://kyc-api.aadhaarkyc.io/api/v1/rc/rc-full', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setVehicleLiveDetail(result.data);
      })
      .catch((error) => console.log('error', error));
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

  const handleFileChangeSubmit = async (file, FileChange) => {
    const formData = new FormData();
    const directory = 'fleetask';
    formData.append('file', FileChange);
    formData.append('filename', file);
    formData.append('directory', directory);
    formData.append('accessKeyId', 'USDXRENI3CQ7AX70LPD7');
    formData.append('secretAccessKey', '6yRewo6kV5cc1z96LIbwwetL3y7r3REWVoodnDdh');
    formData.append('region', 'ap-southeast-1');
    formData.append('endpoint', 'https://s3.ap-southeast-1.wasabisys.com');
    formData.append('bucketName', 'svgjpr');

    try {
      const res = await axios.post('https://uploadimg.fleetask.com/upload', formData);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      console.log('There was an error uploading the file.');
    }
  };

  const handleFile = (e, fieldName) => {
    const file = e.target.files[0];
    const randomFileName = generateRandomString(10);
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'bmp', 'doc', 'txt'];
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type. Please upload files with extensions: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Set state based on the fieldName parameter
    switch (fieldName) {
      case 'VehicleRc':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          VehicleRc: randomFileName + '.' + fileExtension || ''
        });
        break;

      case 'VehicleInsuranceImg':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          VehicleInsuranceImg: randomFileName + '.' + fileExtension || ''
        });
        break;
      default:
        toast.error('Invalid field name');
        return;
    }
  };
  const vechileOption = [
    { label: 'Owned', value: 'Owned' },
    { label: 'Rented', value: 'Rented' },
    { label: 'Client', value: 'Client' },
    { label: 'Market', value: 'Market' }
  ];

  const vehicleModal = () => {
    return (
      <CModal
        className="modal-lg"
        alignment="center"
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setIsFilled(false);
          setisEditData('');
          setIsEdit(false);
          setValidated(false);
          setFormData({
            VehicleName: '',
            Label: '',
            DriverID: '',
            OtherImg: '',
            VehicleRCBack: '',
            VehicleInsuranceImg: '',
            VehicleRCFrant: '',
            VehicleNumber: '',
            transLabel: '',
            vehicleOwenershipLabel: '',
            VehicleOwnership: '',
            TransporterID: '',
            VehicleType: '',
            RegistrationYear: '',
            RegistrationDate: '',
            Model: ''
          });
        }}
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Vehicle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
            <CRow className="mt-3">
              <CCol xl={8} md={6} xs={12}>
                <CFormInput
                  type="text"
                  id="VehicleNumber"
                  name="VehicleNumber"
                  label={
                    <span>
                      Vehicle Number
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData.VehicleNumber}
                  onChange={handleTransportInputChange}
                  placeholder="Vehicle Number"
                  required
                />
                {!VehicleLiveDetail?.maker_model && formData?.VehicleNumber?.length > 10 && (
                  <div className="mt-2" style={{ color: 'red' }}>
                    {!VehicleLiveDetail?.maker_model && 'Please Enter Valid Vehicle No.'}
                  </div>
                )}
              </CCol>
              <CCol xl={4} md={6} xs={12} className="d-flex align-items-end">
                <CButton disabled={!formData?.VehicleNumber?.length} className="w-100" color="primary" onClick={handleAutoFill}>
                  Auto Fill
                </CButton>
              </CCol>
            </CRow>

            {((isEdit && VehicleLiveDetail?.maker_model) || formData.VehicleNumber) && (
              <CRow className="mt-3">
                <CCol md={4} xs={12}>
                  <CFormInput
                    disabled
                    type="text"
                    id="VIN"
                    name="VIN"
                    label={
                      <span>
                        Model
                        <span className="ms-1" style={{ color: 'red' }}>
                          *
                        </span>
                      </span>
                    }
                    value={VehicleLiveDetail.maker_model || editData.Model}
                    placeholder="Model"
                    required
                  />
                </CCol>

                <CCol md={4} xs={12}>
                  <CFormInput
                    disabled
                    type="text"
                    id="VehicleName"
                    name="VehicleName"
                    label={
                      <span>
                        Vehicle Name
                        <span className="ms-1" style={{ color: 'red' }}>
                          *
                        </span>
                      </span>
                    }
                    value={VehicleLiveDetail.vehicle_category_description || editData.VehicleName}
                    placeholder="Vehicle Name"
                    required
                  />
                </CCol>

                <CCol md={4} xs={12}>
                  <CFormInput
                    disabled
                    type="text"
                    id="VehicleType"
                    name="VehicleType"
                    label={
                      <span>
                        Vehicle Type
                        <span className="ms-1" style={{ color: 'red' }}>
                          *
                        </span>
                      </span>
                    }
                    value={VehicleLiveDetail.vehicle_category || editData.VehicleType}
                    placeholder="Vehicle Type"
                    required
                  />
                </CCol>

                <CCol md={4} xs={12}>
                  <CFormInput
                    disabled
                    type="text"
                    id="RegistrationYear"
                    name="RegistrationYear"
                    label={
                      <span>
                        Registration Year
                        <span className="ms-1" style={{ color: 'red' }}>
                          *
                        </span>
                      </span>
                    }
                    value={year || editData.RegistrationYear}
                    placeholder="Registration Year"
                    required
                  />
                </CCol>

                <CCol md={4} xs={12}>
                  <CFormInput
                    disabled
                    type="text"
                    id="Maker"
                    name="Maker"
                    label={
                      <span>
                        Maker
                        <span className="ms-1" style={{ color: 'red' }}>
                          *
                        </span>
                      </span>
                    }
                    value={VehicleLiveDetail.maker_description || editData.Maker}
                    placeholder="Maker"
                    required
                  />
                </CCol>

                <CCol md={4} xs={12}>
                  <CFormInput
                    disabled
                    type="text"
                    id="FuelType"
                    name="FuelType"
                    label={
                      <span>
                        Fuel Type
                        <span className="ms-1" style={{ color: 'red' }}>
                          *
                        </span>
                      </span>
                    }
                    value={VehicleLiveDetail.fuel_type || editData.FuelType}
                    placeholder="Fuel Type"
                    required
                  />
                </CCol>

                <CCol xs={12} md={4}>
                  <div className="mt-2">
                    <label htmlFor="RegistrationDate" className="form-label">
                      Registration Date
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </label>
                    <DatePicker
                      maxDate={new Date()}
                      disabled
                      required
                      id="RegistrationDate"
                      name="RegistrationDate"
                      className="form-control"
                      selected={VehicleLiveDetail.registration_date || editData.RegistrationDate}
                      onChange={(date) => handleDateChange(date, 'RegistrationDate')}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Registration Date"
                    />
                    <div className="invalid-feedback">Registration Date is required.</div>
                  </div>
                </CCol>
              </CRow>
            )}

            <CRow className="mt-3">
              <CCol xs={12} md={6} lg={4}>
                <div className="form-group">
                  <label htmlFor="TransporterID">
                    Transporter
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                  <ReactSelect
                    id="TransporterID"
                    name="TransporterID"
                    options={transportlist?.map((transport) => ({
                      label: capitalizeFirstLetter(transport.TransporterName),
                      value: transport.nid
                    }))}
                    value={{ label: formData.transLabel || 'Select Transporter', value: formData.transLabel }}
                    onChange={(selectedOption) => {
                      setFormData({
                        ...formData,
                        TransporterID: selectedOption.value,
                        transLabel: selectedOption.label
                      });
                    }}
                    placeholder="Select Transporter"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm"
                  />
                  <div onClick={() => setTransportModal(true)} style={{ display: 'flex', justifyContent: 'end' }}>
                    <a style={{ color: 'blue', cursor: 'pointer' }}>Add New Transporter</a>
                  </div>
                </div>
              </CCol>

              <CCol xs={12} md={6} lg={4}>
                <div className="form-group">
                  <label htmlFor="DriverID">Driver</label>
                  <ReactSelect
                    options={driverOption?.map((driver) => ({
                      label: capitalizeFirstLetter(driver.DriverFirstName),
                      value: driver.nid
                    }))}
                    value={{ label: formData?.Label || 'Select Driver', value: formData?.Label }}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        DriverID: selectedOption.value,
                        Label: selectedOption.label
                      })
                    }
                    placeholder="Select Driver"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm"
                  />
                  <div onClick={() => setDriverModal(true)} style={{ display: 'flex', justifyContent: 'end' }}>
                    <a style={{ color: 'blue', cursor: 'pointer' }}>Add New Driver</a>
                  </div>
                </div>
              </CCol>

              <CCol xs={12} md={6} lg={4}>
                <div className="form-group">
                  <label htmlFor="vehicleOwnership">
                    Vehicle Ownership
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                  <ReactSelect
                    id="vehicleOwnership"
                    name="VehicleOwnership"
                    options={vechileOption?.map((vehicle) => ({
                      label: vehicle.value,
                      value: vehicle.value
                    }))}
                    value={{ label: formData.vehicleOwenershipLabel || 'Select Vehicle Ownership', value: formData.vehicleOwenershipLabel }}
                    onChange={(selectedOption) => {
                      setFormData({
                        ...formData,
                        VehicleOwnership: selectedOption.value,
                        vehicleOwenershipLabel: selectedOption.label
                      });
                    }}
                    placeholder="Select Vehicle Ownership"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm"
                  />
                </div>
              </CCol>

              <CCol xs={12} md={6} lg={4}>
                <CFormInput
                  label="Vehicle Insurance Img"
                  type="file"
                  id="VehicleInsuranceImg"
                  onChange={(e) => handleFile(e, 'VehicleInsuranceImg')}
                  accept=".pdf,.doc,.docx,.txt,.jpeg"
                />
                {formData.VehicleInsuranceImg && (
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <a
                      href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.VehicleInsuranceImg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{ color: 'blue' }}>View Attachment</div>
                    </a>
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={6} lg={4}>
                <CFormInput
                  label="Vehicle Rc"
                  type="file"
                  id="VehicleRc"
                  onChange={(e) => handleFile(e, 'VehicleRc')}
                  accept=".pdf,.doc,.docx,.txt,.jpeg"
                />
                {formData.VehicleRc && (
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <a
                      href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.VehicleRc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{ color: 'blue' }}>View Attachment</div>
                    </a>
                  </div>
                )}
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCardFooter style={{ backgroundColor: '#f8f9fa' }}>
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="primary" className="me-md-2" type="submit">
                    {isEdit ? 'Update' : 'Submit'}
                  </CButton>
                  <CButton color="danger">Cancel</CButton>
                </CCol>
              </CCardFooter>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    );
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
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/activeInactivevehicle', requestOptions);
      const result = await response.json();
      if (result.IsSuccess) {
        toast.success('Status Updated Successfully.');
        fetchVehcile();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  console.warn('VehicleLiveDetail', VehicleLiveDetail.maker_model);
  const handleEdit = (user) => {
    setIsEdit(true);
    setFormData({
      VehicleName: user.VehicleName,
      Label: user.DriverFirstName,
      DriverID: user.DriverID,
      OtherImg: user.OtherImg,
      VehicleRc: user.VehicleRc,
      VehicleInsuranceImg: user.VehicleInsuranceImg,
      VehicleRCFrant: user.VehicleRCFrant,
      VehicleNumber: user.VehicleNumber,
      transLabel: user.TransporterName,
      vehicleOwenershipLabel: user.VehicleOwnership,
      VehicleOwnership: user.VehicleOwnership,
      TransporterID: user.TransporterID,
      VehicleType: user.VehicleType,
      RegistrationYear: user.RegistrationYear,
      RegistrationDate: user.RegistrationDate,
      Model: VehicleLiveDetail ? VehicleLiveDetail.maker_model : user.Model,
      Maker: user.Maker,
      FuelType: user.FuelType,
      nid: user.nid
    });
    setVehicleLiveDetail('');
    setisEditData(user);
    setIsEdit(true);
    setShowModal(true);

    // scrollToTop();
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
      name: 'VehicleName',
      label: 'Vehicle Name',
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
      label: 'Transporter Name',
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
      name: 'VehicleOwnership',
      label: 'Vehicle Ownership',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'VehicleType',
      label: 'Vehicle Type',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'RegistrationYear',
      label: 'Registration Year',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Model',
      label: 'Model',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Maker',
      label: 'Maker',
      options: {
        filter: true,
        sort: false
      }
    },

    {
      name: 'FuelType',
      label: 'Fuel Type',
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
          const user = VehicleAllDetal[tableMeta.rowIndex];
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
          const user = VehicleAllDetal[tableMeta.rowIndex];
          return (
            <div className="d-flex gap-2">
              <button
                disabled={permissionRole[3]?.pwrite == '0'}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => handleEdit(user)}
              >
                <FaPencilAlt style={{ fontSize: '20px' }} className="icon me-2" />
              </button>
              <div className="form-check form-switch">
                <input
                  style={{ cursor: 'pointer' }}
                  disabled={permissionRole[3]?.pdelete == '0'}
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
      {' '}
      <CCard style={{ marginBottom: '10%' }}>
        <CCardHeader>
          <strong>Vehicle Details</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="">
            <CCol xs="12" className="d-grid gap-2 d-md-flex">
              <CButton
                disabled={permissionRole[3]?.pwrite == '0'}
                onClick={() => {
                  setShowModal(!showModal);
                  setIsEdit(false);
                }}
                color="primary"
                className="me-md-2"
              >
                Add Vehicle
              </CButton>
            </CCol>
          </CRow>
          {vehicleModal()}
          <TransportModal
            isVehicle
            stateOptions={stateOptions}
            setIsEdit={setIsEdit}
            ledgerOption={ledgerOption}
            handleTransportSubmit={handleTransportSubmit}
            handleDistricChange={handleDistricChange}
            districtOptions={districtOptions}
            formData={formData}
            setFormData={setFormData}
            showModal={transportModal}
            setShowModal={setTransportModal}
            handleInputChange={handleTransportInputChange}
            handleMobileChange={handleMobileChange}
            handleStateChange={handleStateChange}
            isEdit={isEdit}
            validated={validated}
            setLedgerModal={setLedgerModal}
          />
          <LedgerModal
            fetchLedger={fetchLedger}
            handleTransportSubmit={handleTransportSubmit}
            handleDistricChange={handleDistricChange}
            districtOptions={districtOptions}
            bankButton={bankButton}
            setBankButton={setBankButton}
            handleInputChange={handleTransportInputChange}
            handleMobileChange={handleMobileChange}
            handleStateChange={handleStateChange}
            formData={formData}
            setFormData={setFormData}
            ledgerModal={ledgerModal}
            setLedgerModal={setLedgerModal}
            isEdit={isEdit}
            validated={validated}
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
              data={VehicleAllDetal}
              columns={columns}
              options={{
                filterType: 'text',
                selectableRows: 'none',
                responsive: 'standard' // Adjust responsiveness as needed
              }}
              className="custom-mui-datatable"
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

export default VehicleMaster;
