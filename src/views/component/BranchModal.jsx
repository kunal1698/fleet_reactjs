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
import ReactSelect from 'react-select';
import axios from 'axios';

function BranchModal(props) {
  const {
    validated,
    handleToggle,
    districtOptions,
    showModal,
    handleStateChange,
    stateOptions,
    handleDistricChange,
    setShowModal,
    handleInputChange,
    formData,
    handleBranchSubmit,
    setFormData,
    ledgerOption,
    isEdit,
    setIsEdit,
    handleBranchUpdate
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
      case 'Attachment':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          Attachment: randomFileName + '.' + fileExtension || ''
        });
        break;

      default:
        toast.error('Invalid field name');
        return;
    }
  };

  return (
    <CModal
      className="modal-lg"
      alignment="center"
      visible={showModal}
      onClose={() => {
        setShowModal(false);
        setIsEdit(false);
        setFormData({
          OfficeName: '',
          OfficeLocation: '',
          ContactName: '',
          ContactEmail: '',
          ContactMobile: '',
          ContactAddress: '',
          BranchState: '',
          BranchDistrict: '',
          BranchCity: '',
          BranchPincode: '',
          PANNo: '',
          GSTNo: '',
          GSTNature: '',
          Label: '',
          LedgerID: '',
          Attachment: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} New Branch / Site</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={isEdit ? handleBranchUpdate : handleBranchSubmit}
        >
          <CRow className="mt-3">
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="OfficeName"
                name="OfficeName" // Corrected name attribute
                label={
                  <span>
                    Branch / Site Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.OfficeName}
                onChange={handleInputChange}
                placeholder=" Branch / Site Name"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="OfficeLocation"
                name="OfficeLocation" // Corrected name attribute
                label={
                  <span>
                    Location
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.OfficeLocation}
                onChange={handleInputChange}
                placeholder="Location"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="ContactName"
                name="ContactName" // Corrected name attribute
                label={
                  <span>
                    Contact Person Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ContactName}
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
                    Email
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ContactEmail}
                onChange={handleInputChange}
                placeholder="Email id"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="tel"
                id="ContactMobile"
                name="ContactMobile" // Corrected name attribute
                label={
                  <span>
                    Mobile Number
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                maxLength={10} // Set maxLength to 10 to limit input to 10 digits
                pattern="[0-9]{10}"
                value={formData.ContactMobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ContactAddress"
                name="ContactAddress" // Corrected name attribute
                label={
                  <span>
                    Address
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ContactAddress}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="GSTNo"
                name="GSTNo" // Corrected name attribute
                label={
                  <span>
                    GST Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.GSTNo}
                onChange={handleInputChange}
                placeholder="GST Number"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <div className="form-group">
                <label htmlFor="State">GST Nature</label>
                <ReactSelect
                  id="GSTNature"
                  name="GSTNature"
                  options={[
                    { label: 'Exempted', value: 'Exempted' },
                    { label: 'FCM', value: 'FCM' },
                    { label: 'RCM', value: 'RCM' }
                  ]}
                  value={{ label: formData?.GSTNature || 'Select GST Nature', value: formData?.GSTNature || 'Select State' }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GSTNature: e.value
                    })
                  }
                  placeholder="State"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol>

            <CCol className="mt-3" xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">
                    State{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  id="BranchState"
                  name="BranchState"
                  options={stateOptions}
                  value={{ label: formData?.BranchState || 'Select State', value: formData?.BranchState || 'Select State' }}
                  onChange={handleStateChange}
                  placeholder="State"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol>

            <CCol className="mt-3" xs="4">
              <label className="mb-2" htmlFor="District">
                Select District{' '}
                <span className="ms-1" style={{ color: 'red' }}>
                  *
                </span>
              </label>
              <ReactSelect
                isDisabled={!formData.BranchState}
                id="BranchDistrict"
                name="BranchDistrict"
                options={districtOptions}
                value={{ label: formData?.BranchDistrict || 'Select Company District', value: formData?.BranchDistrict }}
                onChange={handleDistricChange}
                placeholder="State"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm" // Reduced height with form-control-sm class
              />
            </CCol>

            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="BranchCity"
                name="BranchCity" // Corrected name attribute
                label={
                  <span>
                    City{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.BranchCity}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </CCol>

            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="BranchPincode"
                name="BranchPincode"
                label={
                  <span>
                    PinCode{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.BranchPincode}
                onChange={handleInputChange}
                placeholder="Pin Code"
                required
                maxLength={6} // Limit input to 6 characters
                pattern="[0-9]{6}" // Enforce exactly 6 digits (numeric characters)
                inputMode="numeric" // Provide a hint to the browser for numeric input
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="PANNo"
                name="PANNo" // Corrected name attribute
                label={
                  <span>
                    PAN{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PANNo}
                onChange={handleInputChange}
                placeholder="PAN"
                required
                maxLength={10}
              />
            </CCol>
            {/* <CCol className="mt-3" xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">Select Ledger</label>
                </div>
                <ReactSelect
                  options={ledgerOption?.map((ledger) => ({
                    label: ledger.LedgerName,
                    value: ledger.nid // Use nid as the value
                  }))}
                  value={{ label: formData?.Label || 'Select Ledger', value: formData?.Label }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      LedgerID: selectedOption.value, // Store nid in LedgerID
                      Label: selectedOption.label
                    })
                  }
                  placeholder="Please select ledger"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol> */}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                label="Attach Document"
                type="file"
                id="file"
                onChange={(e) => handleFile(e, 'Attachment')}
                accept=".pdf,.doc,.docx,.txt,.jpeg"
              />
              {formData.Attachment && (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <a
                    href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.Attachment}`} // Assuming 'value' contains the URL to the PDF attachment
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

export default BranchModal;
