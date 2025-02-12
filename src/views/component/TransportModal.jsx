import React, { useState } from 'react';
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
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
function TransportModal(props) {
  const {
    isVehicle,
    stateOptions,
    fetchPAN,
    ValidateBtn,
    setValidateBtn,
    ValidatePan,
    GSTDetail,
    setValidatePAN,
    setIsGST,
    setIsPAN,
    fetchGST,
    editData,
    handleDistricChange,
    handleTransportSubmit,
    districtOptions,
    handleStateChange,
    handleInputChange,
    setLedgerModal,
    showModal,
    setShowModal,
    isEdit,
    setIsEdit,
    validated,
    formData,
    setFormData,
    handleTransportUpdate,
    handleMobileChange,
    ledgerOption
  } = props;

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
      case 'OtherImg':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          OtherImg: randomFileName + '.' + fileExtension || ''
        });
        break;

      default:
        toast.error('Invalid field name');
        return;
    }
  };

  const handleAadharChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 12);
    setFormData((prevData) => ({
      ...prevData,
      AadharNo: newValue
    }));
  };

  const handlePinChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 6);
    setFormData((prevData) => ({
      ...prevData,
      BillingPincode: newValue
    }));
  };
  console.warn('GSTDetail', formData);

  return (
    <CModal
      className="modal-xl"
      alignment="center"
      visible={showModal}
      onClose={() => {
        setValidateBtn(false);
        setValidatePAN(false);
        setShowModal(false);
        setIsEdit(false);
        setFormData({
          TransporterName: '',
          ContactPerson: '',
          ContactEmail: '',
          ContactNumber: '',
          ContactPersonAddress: '',
          Rate: '',
          BillingAddress: '',
          BillingState: '',
          BillingDistrict: '',
          BillingCity: '',
          BillingPincode: '',
          BillingPAN: '',
          BillingGST: '',
          Label: '',
          LedgerID: ''
        });
      }}
      aria-labelledby={isEdit ? 'UpdateForm' : 'VerticallyCenteredExample'}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit && !isVehicle ? 'Update' : 'Add'} Transporter</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={isEdit && !isVehicle ? handleTransportUpdate : handleTransportSubmit}
        >
          <CRow className="mt-3">
            <CCol xs={12} sm={6} md={4}>
              <CFormInput
                type="text"
                id="BillingGST"
                name="BillingGST"
                label={
                  <span>
                    GST Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.BillingGST}
                onChange={(e) => {
                  handleInputChange(e);
                  setValidateBtn(true);
                }}
                placeholder="GST Number"
                required
              />
            </CCol>
            {(!isEdit || ValidateBtn) && (
              <CCol onClick={() => fetchGST(formData?.BillingGST)} className="mt-4">
                {' '}
                <CButton color="primary" className="mt-1">
                  Validate
                </CButton>
              </CCol>
            )}
            <CCol xs={12} sm={6} md={4}>
              <CFormInput
                type="text"
                id="BillingPAN"
                name="BillingPAN"
                label={
                  <span>
                    PAN Card Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.BillingPAN}
                onChange={(e) => {
                  handleInputChange(e);
                  setValidatePAN(true);
                }}
                placeholder="PAN Card Number"
                required
              />
            </CCol>
            {(!isEdit || ValidatePan) && (
              <CCol className="mt-4">
                {' '}
                <CButton onClick={() => fetchPAN(formData?.BillingPAN)} color="primary" className="mt-1">
                  Validate
                </CButton>
              </CCol>
            )}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="TransporterName"
                name="TransporterName" // Corrected name attribute
                label={
                  <span>
                    Transporter Name{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.TransporterName}
                onChange={handleInputChange}
                placeholder="Transporter Name"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ContactPerson"
                name="ContactPerson" // Corrected name attribute
                label={
                  <span>
                    Contact Person Name{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.ContactPerson}
                onChange={handleInputChange}
                placeholder="Contact Person Name"
                required
              />
            </CCol>

            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="email"
                id="ContactEmail"
                name="ContactEmail" // Corrected name attribute
                label={
                  <span>
                    Contact Person Email{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.ContactEmail}
                onChange={handleInputChange}
                placeholder="Contact Person Email"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ContactNumber"
                name="ContactNumber" // Corrected name attribute
                label={
                  <span>
                    Contact Person Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.ContactNumber}
                onChange={handleMobileChange}
                placeholder="Contact Person Number"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ContactPersonAddress"
                name="ContactPersonAddress" // Corrected name attribute
                label={
                  <span>
                    Contact Person Address{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.ContactPersonAddress}
                onChange={handleInputChange}
                placeholder=" Contact Person Address"
                required
              />
            </CCol>
            {/* <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Rate"
                name="Rate" // Corrected name attribute
                label={
                  <span>
                    Transporter Rate{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData?.Rate}
                onChange={handleInputChange}
                placeholder="Transporter Rate"
                required
              />
            </CCol> */}
            <CCol className="mt-3" xs={12} sm={6} md={4} lg={3}>
              <div className="form-group">
                <label htmlFor="LedgerID">
                  Select Business Nature{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <Select
                  id="LedgerID"
                  name="LedgerID"
                  options={[
                    { label: 'Proprietorship', value: 'Proprietorship' },
                    { label: 'Partnership', value: 'Partnership' },
                    { label: 'Private Limited', value: 'Private Limited' }
                  ]}
                  value={{ label: formData?.BusinessNatureLabel || 'Select Transporter', value: formData?.BusinessNatureLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      BusinessNature: selectedOption.value,
                      BusinessNatureLabel: selectedOption.label
                    })
                  }
                  placeholder="Select Ledger"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
          </CRow>
          <div>
            <strong>Contact Details and KYC</strong>
            <hr style={{ backgroundColor: 'black' }} />
            <CRow className="mt-3">
              <CCol xs={12} sm={6} md={4} lg={3}>
                <CFormInput
                  type="text"
                  id="BillingAddress"
                  name="BillingAddress"
                  label={
                    <span>
                      Address{' '}
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData?.BillingAddress}
                  onChange={handleInputChange}
                  placeholder="Address"
                  required
                />
              </CCol>
              <CCol xs={12} sm={6} md={4} lg={3}>
                <CFormInput
                  type="text"
                  id="BillingCity"
                  name="BillingCity"
                  label={
                    <span>
                      City{' '}
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData?.BillingCity}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </CCol>
              <CCol xs={12} sm={6} md={4} lg={3}>
                <div className="form-group mt-1">
                  <label htmlFor="BillingState">
                    State{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                  <Select
                    id="BillingState"
                    name="BillingState"
                    options={stateOptions}
                    value={{ label: formData?.BillingState || 'Select State', value: formData?.BillingState }}
                    onChange={handleStateChange}
                    placeholder="State"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm"
                  />
                </div>
              </CCol>
              <CCol xs={12} sm={6} md={4} lg={3}>
                <label className="" htmlFor="BillingDistrict">
                  Select District{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <Select
                  isDisabled={!formData.BillingState}
                  id="BillingDistrict"
                  name="BillingDistrict"
                  options={districtOptions}
                  value={{ label: formData?.BillingDistrict || 'Select Billing District', value: formData?.BillingDistrict }}
                  onChange={handleDistricChange}
                  placeholder="District"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </CCol>
              <CCol xs={12} sm={6} md={4} lg={3}>
                <CFormInput
                  type="text"
                  id="BillingPincode"
                  name="BillingPincode"
                  label={
                    <span>
                      Pin Code{' '}
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData?.BillingPincode}
                  onChange={handlePinChange}
                  placeholder="Pin Code"
                  required
                />
              </CCol>

              <CCol className="" xs={12} sm={6} md={4} lg={3}>
                <CFormInput
                  type="text"
                  id="AadharNo"
                  name="AadharNo"
                  label={<span>Aadhar Card Number</span>}
                  value={formData?.AadharNo}
                  onChange={handleAadharChange}
                  placeholder="Aadhar Card Number"
                />
              </CCol>
              <CCol className="" xs={12} sm={6} md={4} lg={3}>
                <div className="form-group">
                  <label htmlFor="LedgerID">Please Select Ledger</label>
                  <Select
                    id="LedgerID"
                    name="LedgerID"
                    options={ledgerOption?.map((ledger) => ({
                      label: ledger.LedgerName,
                      value: ledger.nid
                    }))}
                    value={{ label: formData?.Label || 'Select Ledger', value: formData?.Label }}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        LedgerID: selectedOption.value,
                        Label: selectedOption.label
                      })
                    }
                    placeholder="Select Ledger"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm"
                  />
                  <div onClick={() => setLedgerModal(true)} style={{ display: 'flex', justifyContent: 'end' }}>
                    <a style={{ color: 'blue', cursor: 'pointer' }}>Create New Ledger</a>
                  </div>
                </div>
              </CCol>
              <CCol className="" xs={12} sm={6} md={4} lg={3}>
                <div className="form-group">
                  <label htmlFor="TDS">
                    Select TDS Applicable{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                  <Select
                    id="TDSDeclaration"
                    name="TDSDeclaration"
                    options={[
                      { label: 'Yes', value: 'Yes' },
                      { label: 'No', value: 'No' }
                    ]}
                    value={{ label: formData?.TDSDeclaration || 'Select TDS Applicable', value: formData?.TDSDeclaration }}
                    onChange={(selectedOption) => {
                      setFormData({
                        ...formData,
                        TDSDeclaration: selectedOption.value
                      });
                    }}
                    placeholder="Select TDS Applicable"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm"
                  />
                </div>
              </CCol>
              {formData.TDSDeclaration === 'No' && (
                <CCol className="mt-3" xs={12} sm={6} md={4} lg={3}>
                  <label htmlFor="TDS">
                    TDS Declaration{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                  <CFormInput type="file" id="file" onChange={(e) => handleFile(e, 'OtherImg')} accept=".pdf,.doc,.docx,.txt,.jpeg" />
                  {formData.OtherImg && (
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                      <a
                        href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.OtherImg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div style={{ color: 'blue' }}>View Attachment</div>
                      </a>
                    </div>
                  )}
                </CCol>
              )}
            </CRow>
            <hr style={{ backgroundColor: 'black' }} />
          </div>
          <CRow className="mt-3">
            <CCardFooter style={{ backgroundColor: '#f8f9fa' }}>
              {!isVehicle ? (
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
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
              ) : (
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                  {' '}
                  <CButton color="primary" className="me-md-2" type="submit">
                    Submit
                  </CButton>
                </CCol>
              )}
            </CCardFooter>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  );
}

export default TransportModal;
