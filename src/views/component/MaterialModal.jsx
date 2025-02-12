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
function MaterialModal(props) {
  const {
    validated,
    showModal,
    setFormData,
    setIsEdit,
    setShowModal,
    handleInputChange,
    formData,
    handleMaterialSubmit,
    isEdit,
    handleMasterEdit
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
          MaterialName: '',
          MaterialCode: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update Material' : 'Add Material'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={!isEdit ? handleMaterialSubmit : handleMasterEdit}
        >
          <CRow className="mt-3">
            <CCol xl={6} xs="12" md="4">
              <CFormInput
                type="text"
                id="MaterialName"
                name="MaterialName" // Corrected name attribute
                label={
                  <span>
                    Material Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.MaterialName}
                onChange={handleInputChange}
                placeholder="Material Name"
                required
              />
            </CCol>
            <CCol xl={6} xs="12" md="4">
              <CFormInput
                type="text"
                id="MaterialCode"
                name="MaterialCode" // Corrected name attribute
                label={
                  <span>
                    Material Code
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.MaterialCode}
                onChange={handleInputChange}
                placeholder="Material Code"
                required
              />
            </CCol>
            {/* <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="MaterialGroup"
                name="MaterialGroup" // Corrected name attribute
                label={
                  <span>
                    Material Group
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.MaterialGroup}
                onChange={handleInputChange}
                placeholder="Material Group "
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Width"
                name="Width" // Corrected name attribute
                label={<span>Width</span>}
                value={formData.Width}
                onChange={handleInputChange}
                placeholder="Width"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Height"
                name="Height" // Corrected name attribute
                label={<span>Height</span>}
                value={formData.Height}
                onChange={handleInputChange}
                placeholder="Height"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Length"
                name="Length" // Corrected name attribute
                label={<span>Length</span>}
                value={formData.Length}
                onChange={handleInputChange}
                placeholder="Length"
                required
              />
            </CCol>

            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Weight"
                name="Weight" // Corrected name attribute
                label={<span>Weight</span>}
                value={formData.Weight}
                onChange={handleInputChange}
                placeholder="Weight"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Capacity"
                name="Capacity" // Corrected name attribute
                label={<span>Capacity</span>}
                value={formData.Capacity}
                onChange={handleInputChange}
                placeholder="Capacity"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="WeightLimit"
                name="WeightLimit" // Corrected name attribute
                label={
                  <span>
                    Weight Limit
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.WeightLimit}
                onChange={handleInputChange}
                placeholder="Weight Limit"
                required
              />
            </CCol>
            <CCol xl={12} className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="Description"
                name="Description" // Corrected name attribute
                label={
                  <span>
                    Description
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.Description}
                onChange={handleInputChange}
                placeholder="Description"
                required
              />
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

export default MaterialModal;
