import React from 'react';
import axios from 'axios';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';

function LorryArrivalModal(props) {
  const {
    validated,
    iseEditData,
    showModal,
    handleDriverSubmit,
    setShowModal,
    setFormData,
    handleInputChange,
    formData,
    handleLorrySubmit,
    setIsEdit,
    isEdit,
    VehicleAllDetal
  } = props;
  console.warn('iseEditData');
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
      case 'NTPCChallanDoc':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          NTPCChallanDoc: randomFileName + '.' + fileExtension || ''
        });
        break;

      case 'KataDoc':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          KataDoc: randomFileName + '.' + fileExtension || ''
        });
        break;
      case 'BuiltyDoc':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          BuiltyDoc: randomFileName + '.' + fileExtension || ''
        });
        break;
      case 'VehicleDoc':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          VehicleDoc: randomFileName + '.' + fileExtension || ''
        });
        break;
      case 'GpsLocationDoc':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          GpsLocationDoc: randomFileName + '.' + fileExtension || ''
        });
        break;
      default:
        toast.error('Invalid field name');
        return;
    }
  };

  const handleReceived = (event) => {
    const { name, value } = event.target;
    const decimalValue = parseFloat(value);

    if (value === '' || (decimalValue >= 0 && decimalValue <= 80 && !isNaN(decimalValue))) {
      setFormData({ ...formData, [name]: value });
    } else {
      // Optionally, you could show an error message here
      console.log('Invalid input. Enter a number between 0 and 80 with up to two decimal places.');
    }
  };
  return (
    <CModal
      className="modal-lg"
      alignment="center"
      visible={showModal}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Lorry Arrival</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleLorrySubmit}>
          <CRow className="mt-3">
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                disabled
                type="text"
                id="TransporterName"
                name="TransporterName" // Corrected name attribute
                label={
                  <span>
                    Transporter Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.TransporterName}
                onChange={handleInputChange}
                placeholder="Transporter Name"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                disabled
                type="text"
                id="DriverFirstName"
                name="DriverFirstName" // Corrected name attribute
                label={
                  <span>
                    Driver Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.DriverFirstName}
                onChange={handleInputChange}
                placeholder="Driver Name"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                disabled
                type="number"
                id="DriverMobile "
                name="DriverMobile" // Corrected name attribute
                label={
                  <span>
                    Driver Number
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.DriverMobile}
                onChange={handleInputChange}
                placeholder="Driver Number"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">Vehicle</label>
                </div>
                <Select
                  isDisabled
                  options={VehicleAllDetal?.map((ledger) => ({
                    label: ledger.VehicleNumber,
                    value: ledger.nid // Use nid as the value
                  }))}
                  value={{ label: formData?.VehicleLabel || 'Select Vehicle', value: formData?.VehicleLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      Vehicle: selectedOption.value, // Store nid in LedgerID
                      VehicleLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select ledger"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="UnloadingAddress "
                name="UnloadingAddress" // Corrected name attribute
                label={
                  <span>
                    Unloading Address
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.UnloadingAddress}
                onChange={handleInputChange}
                placeholder="Unloading Address"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="WeightSlipNo"
                name="WeightSlipNo" // Corrected name attribute
                label={
                  <span>
                    Weight Slip Number
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.WeightSlipNo}
                onChange={handleInputChange}
                placeholder="Weight Slip Number"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="4">
              <div style={{ display: 'flex', flexDirection: 'column' }} className="date-picker-wrapper">
                <label htmlFor="CNDate" className="form-label">
                  Arrival Date{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>{' '}
                </label>
                <MobileDateTimePicker
                  disableFuture
                  className="custom-date-picker"
                  ampm={false}
                  onChange={(date) => setFormData({ ...formData, ArrivalDate: dayjs(date).format('YYYY-MM-DDTHH:mm:ss') })}
                  sx={{ padding: '0' }}
                />
              </div>
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="number"
                id="RecQty"
                name="RecQty"
                label={
                  <span>
                    Received Quantity (MT)
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.RecQty}
                onChange={handleReceived}
                placeholder="Received Quantity"
                required
                min="0"
                max="80"
                step="0.01"
                pattern="^(?:[0-7]?[0-9]|80)(?:\.\d{1,2})?$" // Regex pattern for decimal numbers between 0 and 80
                title="Enter a number between 0 and 80 with up to two decimal places"
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Remark "
                name="Remark" // Corrected name attribute
                label={<span>Remark</span>}
                value={formData.Remark}
                onChange={handleInputChange}
                placeholder="Remark"
              />
            </CCol>
            <CCol className="mt-3" xs="4">
              <CFormInput
                label={
                  <span>
                    NTPC Challan Photo
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                type="file"
                id="file"
                onChange={(e) => handleFile(e, 'NTPCChallanDoc')}
                accept=".pdf,.doc,.docx,.txt,.jpeg"
              />
              {formData.NTPCChallanDoc && (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <a
                    href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.NTPCChallanDoc}`} // Assuming 'value' contains the URL to the PDF attachment
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ color: 'blue' }}> View Attachment</div>
                  </a>
                </div>
              )}
            </CCol>
            <CCol className="mt-3" xs="4">
              <CFormInput
                label={
                  <span>
                    Kaanta Parchi
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                type="file"
                id="file"
                onChange={(e) => handleFile(e, 'KataDoc')}
                accept=".pdf,.doc,.docx,.txt,.jpeg"
              />
              {formData.KataDoc && (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <a
                    href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.KataDoc}`} // Assuming 'value' contains the URL to the PDF attachment
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ color: 'blue' }}> View Attachment</div>
                  </a>
                </div>
              )}
            </CCol>{' '}
            <CCol className="mt-3" xs="4">
              <CFormInput
                label={
                  <span>
                    Bilty Image
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                type="file"
                id="file"
                onChange={(e) => handleFile(e, 'BuiltyDoc')}
                accept=".pdf,.doc,.docx,.txt,.jpeg"
              />
              {formData.BuiltyDoc && (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <a
                    href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.BuiltyDoc}`} // Assuming 'value' contains the URL to the PDF attachment
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ color: 'blue' }}> View Attachment</div>
                  </a>
                </div>
              )}
            </CCol>{' '}
            <CCol className="mt-3" xs="4">
              <CFormInput
                label={
                  <span>
                    Vehicle Image
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                type="file"
                id="file"
                onChange={(e) => handleFile(e, 'VehicleDoc')}
                accept=".pdf,.doc,.docx,.txt,.jpeg"
              />
              {formData.VehicleDoc && (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <a
                    href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.VehicleDoc}`} // Assuming 'value' contains the URL to the PDF attachment
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ color: 'blue' }}> View Attachment</div>
                  </a>
                </div>
              )}
            </CCol>
            <CCol className="mt-3" xs="4">
              <CFormInput
                label={<span style={{ whiteSpace: 'nowrap' }}>GPS Location Image</span>}
                type="file"
                id="file"
                onChange={(e) => handleFile(e, 'GpsLocationDoc')}
                accept=".pdf,.doc,.docx,.txt,.jpeg"
              />
              {formData.GpsLocationDoc && (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <a
                    href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.GpsLocationDoc}`} // Assuming 'value' contains the URL to the PDF attachment
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ color: 'blue' }}> View Attachment</div>
                  </a>
                </div>
              )}
            </CCol>
            <CCardFooter style={{ backgroundColor: '#f8f9fa' }}>
              <CCol className="d-grid gap-2 mt-3 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  {isEdit ? 'Update' : 'submit'}
                </CButton>
              </CCol>
            </CCardFooter>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  );
}

export default LorryArrivalModal;
