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

function ClientModal(props) {
  const {
    validated,
    handleStateChange,
    handleDistricChange,
    setFormData,
    showModal,
    districtOptions,
    stateOptions,
    setShowModal,
    handleInputChange,
    formData,
    isEdit,
    setIsEdit,
    ledgerOption,
    handleClientSubmit,
    handleClientUpdate
  } = props;

  return (
    <CModal
      className="modal-lg"
      alignment="center"
      visible={showModal}
      onClose={() => {
        setShowModal(false);
        setIsEdit(false);
        setFormData({
          ClientName: '',
          ClintAddress: '',
          ClintState: '',
          ClintPincode: '',
          ClintEmail: '',
          MobileNumber: '',
          PAN: '',
          ClintDistrict: '',
          GSTNumber: '',
          Label: '',
          LedgerID: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Service Provider</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={!isEdit ? handleClientSubmit : handleClientUpdate}
        >
          <CRow className="mt-3">
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="ClientName"
                name="ClientName" // Corrected name attribute
                label={
                  <span>
                    Service Provider Name{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ClientName}
                onChange={handleInputChange}
                placeholder="Service Provider Name"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="ClintAddress"
                name="ClintAddress" // Corrected name attribute
                label={
                  <span>
                    Address
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ClintAddress}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">
                    State
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  required
                  id="ClintState"
                  name="ClintState"
                  options={stateOptions}
                  value={{ label: formData?.ClintState || 'Select State', value: formData?.ClintState || 'Select State' }}
                  onChange={handleStateChange}
                  placeholder="Select State"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol>
            <CCol className="mt-3" xs="4">
              <label className="mb-2" htmlFor="District">
                Select District
                <span className="ms-1" style={{ color: 'red' }}>
                  *
                </span>
              </label>
              <ReactSelect
                isDisabled={!formData.ClintState}
                id="ClintDistrict"
                name="ClintDistrict"
                options={districtOptions}
                value={{ label: formData?.ClintDistrict || 'Select Billing District', value: formData?.ClintDistrict }}
                onChange={handleDistricChange}
                placeholder="State"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm" // Reduced height with form-control-sm class
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ClintPincode"
                name="ClintPincode" // Corrected name attribute
                label={
                  <span>
                    Pin Code{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ClintPincode}
                onChange={handleInputChange}
                placeholder="Pin Code"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ClintEmail"
                name="ClintEmail" // Corrected name attribute
                label={
                  <span>
                    Email{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ClintEmail}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="number"
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                  <label htmlFor="State">
                    Ledger
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
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
            {/* <CCol className="mt-3" xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">
                    Type
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  id="ClintType"
                  name="ClintType"
                  options={[
                    { label: 'Customer', value: 'customer' },
                    { label: 'Consignor', value: 'consignor' },
                    { label: 'Consignee', value: 'consignee' },
                    { label: 'Consignor & Consignee', value: 'consignor & consignee' }
                  ]}
                  value={{ label: formData?.ClintType || 'Select Type ', value: formData?.State || 'Select Type ' }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      ClintType: selectedOption.value // Store nid in LedgerID
                    })
                  }
                  placeholder="Select Type "
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol> */}
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

export default ClientModal;
