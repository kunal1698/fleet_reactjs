import React from 'react';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import statesData from '../../State.json';

function BillingOfcModal(props) {
  const {
    validated,
    setFormData,
    showModal,
    handleBillingSubmit,
    handleBillingUpdate,
    districtOptions,
    isEdit,
    setShowModal,
    handleInputChange,
    formData,
    setIsEdit,
    ledgerOption,
    stateOptions,
    handleStateChange,
    handleDistricChange,
    handleClientSubmit,
    handleClientUpdate
  } = props;
  const handleMobileChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      MobileNumber: newValue
    }));
  };

  const handlePanChange = (e) => {
    const { value } = e.target;
    const newValue = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      PAN: newValue
    }));
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
          BillingAddress: '',
          BillingState: '',
          BillingPincode: '',
          BillingEmail: '',
          MobileNumber: '',
          GSTNumber: '',
          Label: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Parental </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={!isEdit ? handleBillingSubmit : handleBillingUpdate}
        >
          <CRow className="mt-3">
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="CompanyName"
                name="CompanyName" // Corrected name attribute
                label={
                  <span>
                    Parental name{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.CompanyName}
                onChange={handleInputChange}
                placeholder="Parental name"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="CompanyAddress"
                name="CompanyAddress" // Corrected name attribute
                label={
                  <span>
                    Parental Address
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.CompanyAddress}
                onChange={handleInputChange}
                placeholder="Parental Address"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
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
                  id="CompanyState"
                  name="CompanyState"
                  options={stateOptions}
                  value={{
                    label: formData?.CompanyState || 'Select Billing State',
                    value: formData?.CompanyState || 'Select Billing State'
                  }}
                  onChange={handleStateChange}
                  placeholder="Select State"
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
                isDisabled={!formData.CompanyState}
                id="CompanyDistrict"
                name="CompanyDistrict"
                options={districtOptions}
                value={{ label: formData?.CompanyDistrict || 'Select Company District', value: formData?.CompanyDistrict }}
                onChange={handleDistricChange}
                placeholder="State"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm" // Reduced height with form-control-sm class
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="CompanyPincode"
                name="CompanyPincode" // Corrected name attribute
                label={
                  <span>
                    pin Code{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.CompanyPincode}
                onChange={handleInputChange}
                placeholder="Pin Code"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="CompanyEmail"
                name="CompanyEmail" // Corrected name attribute
                label={
                  <span>
                    Email{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.CompanyEmail}
                onChange={handleInputChange}
                placeholder="Billing Email"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="MobileNumber"
                name="MobileNumber" // Corrected name attribute
                label={
                  <span>
                    Mobile Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.MobileNumber}
                onChange={handleMobileChange}
                placeholder="Mobile Number"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="PAN"
                name="PAN" // Corrected name attribute
                label={
                  <span>
                    PAN{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PAN}
                onChange={handlePanChange}
                placeholder="PAN"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="GSTNumber"
                name="GSTNumber" // Corrected name attribute
                label={
                  <span>
                    GST Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.GSTNumber}
                onChange={handleInputChange}
                placeholder="GST Number"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">Ledger</label>
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
            </CCol>
            <CCardFooter style={{ backgroundColor: '#f8f9fa' }}>
              <CCol className="d-grid gap-2 mt-3 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  {isEdit ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CCardFooter>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  );
}

export default BillingOfcModal;
