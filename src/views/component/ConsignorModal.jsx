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
import Select from 'react-select';

import ReactSelect from 'react-select';
function ConsignorModal(props) {
  const {
    validated,
    setBranchName,
    branchDetail,
    showModal,
    setFormData,
    setShowModal,
    handleInputChange,
    formData,
    handleConsignerSubmit,
    isEdit,
    setIsEdit,
    handleConsignerEdit
  } = props;

  const handleMobileChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      PartyNumber: newValue
    }));
  };

  const handleMultiChange = (selectedOptions) => {
    const selectedBranches = selectedOptions.map((option) => option.value).join(',');
    setFormData({
      ...formData,
      BranchIDs: selectedBranches,
      Label: selectedOptions.map((option) => option.label).join(', ')
    });
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
          PartyType: '',
          PartyName: '',
          PartyNumber: '',
          PartyEmail: '',
          PartyAddress: '',
          BranchIDs: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update Consignor / Consignee' : 'Add Consignor / Consignee'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={!isEdit ? handleConsignerSubmit : handleConsignerEdit}
        >
          <CRow className="mt-3">
            <CCol xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">
                    Type{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  id="PartyType"
                  name="PartyType"
                  options={[
                    { label: 'Consignor', value: 'Consignor' },
                    { label: 'Consignee', value: 'Consignee' }
                  ]}
                  value={{ label: formData?.PartyType || 'Select Type', value: formData?.PartyType || 'Select Party' }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      PartyType: e.value
                    })
                  }
                  placeholder="State"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol>

            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="PartyName"
                name="PartyName" // Corrected name attribute
                label={
                  <span>
                    Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PartyName}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            </CCol>

            <CCol xs="12" md="4">
              <CFormInput
                type="number"
                id="PartyNumber"
                name="PartyNumber" // Corrected name attribute
                label={
                  <span>
                    Mobile Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PartyNumber}
                onChange={handleMobileChange}
                placeholder="Mobile Number"
                required
              />
            </CCol>
            <CCol xl={4} className="mt-3" xs="12" md="4">
              <CFormInput
                type="email"
                id="PartyEmail"
                name="PartyEmail" // Corrected name attribute
                label={
                  <span>
                    Email{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PartyEmail}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
            </CCol>
            <CCol xl={4} className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="PartyAddress"
                name="PartyAddress" // Corrected name attribute
                label={
                  <span>
                    Address{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PartyAddress}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
            </CCol>
            <CCol xl={12}>
              <div className="form-group mt-1">
                <div className="ms-2">
                  <label className="ms-1 mt-2" htmlFor="state">
                    Branch
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <Select
                  options={branchDetail.map((branch) => ({
                    label: branch.OfficeName,
                    value: branch.nid.toString()
                  }))}
                  value={formData.BranchIDs?.split(',').map((id) => ({
                    label: branchDetail?.find((branch) => branch.nid.toString() === id.toString())?.OfficeName,
                    value: id
                  }))}
                  onChange={handleMultiChange}
                  placeholder="Please select Branch"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                  isMulti // Enable multi-select functionality
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

export default ConsignorModal;
