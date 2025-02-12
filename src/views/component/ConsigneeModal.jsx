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
function ConsigneeModal(props) {
  const { validated, showModal, setShowModal, handleInputChange, formData, handleConsignerSubmit, handleConsignneeEdit, isEdit } = props;
  console.warn('dddd', formData);
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
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update Consignee' : 'Add Consignee'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={!isEdit ? handleConsignerSubmit : handleConsignneeEdit}
        >
          <CRow className="mt-3">
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="Consignee"
                name="Consignee" // Corrected name attribute
                label={
                  <span>
                    Consignee
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.Consignee}
                onChange={handleInputChange}
                placeholder="Consignee"
                required
              />
            </CCol>
            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="ConsigneeName"
                name="ConsigneeName" // Corrected name attribute
                label={
                  <span>
                    Consignee Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ConsigneeName}
                onChange={handleInputChange}
                placeholder="Consignee Name"
                required
              />
            </CCol>

            <CCol xs="12" md="4">
              <CFormInput
                type="number"
                id="ConsigneeNumber"
                name="ConsigneeNumber" // Corrected name attribute
                label={
                  <span>
                    Consignee Number{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ConsigneeNumber}
                onChange={handleInputChange}
                placeholder="Consignee Number"
                required
              />
            </CCol>
            <CCol xl={4} className="mt-3" xs="12" md="4">
              <CFormInput
                type="email"
                id="ConsigneeEmail"
                name="ConsigneeEmail" // Corrected name attribute
                label={<span>Consignee Email</span>}
                value={formData.ConsigneeEmail}
                onChange={handleInputChange}
                placeholder="Consignee Email"
                required
              />
            </CCol>
            <CCol className="mt-3" xl={8} xs="12" md="4">
              <CFormInput
                type="text"
                id="ConsigneeAddress"
                name="ConsigneeAddress" // Corrected name attribute
                label={<span>Consignee Address</span>}
                value={formData.ConsigneeAddress}
                onChange={handleInputChange}
                placeholder="Consignee Address"
                required
              />
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

export default ConsigneeModal;
