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
function MaterialGroupModal(props) {
  const {
    validated,
    showModal,
    setShowModal,
    handleInputChange,
    setFormData,
    formData,
    isEdit,
    setIsEdit,
    handleMaterialSubmit,
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
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Material Group</CModalTitle>
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
                id="GopupName"
                name="GopupName" // Corrected name attribute
                label={
                  <span>
                    Group Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.GopupName}
                onChange={handleInputChange}
                placeholder="Group Name"
                required
              />
            </CCol>
            <CCol xl={6} xs="12" md="4">
              <CFormInput
                type="text"
                id="Code"
                name="Code" // Corrected name attribute
                label={
                  <span>
                    Code{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.Code}
                onChange={handleInputChange}
                placeholder="Code"
                required
              />
            </CCol>

            <CCol className="mt-3" xl={6} xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">
                    Unit{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  id="Unit"
                  name="Unit"
                  options={[
                    { label: 'Tonnes', value: 'Tonnes' },
                    { label: 'Quintal', value: 'Quintal' },
                    { label: 'Kilograms', value: 'Kilograms' },
                    { label: 'Grammes', value: 'Grammes' }
                  ]}
                  value={{ label: formData?.Unit || 'Select Unit Type', value: formData?.Unit || 'Select Unit Type' }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Unit: e.value
                    })
                  }
                  placeholder="Unit Type"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm" // Reduced height with form-control-sm class
                />
              </div>
            </CCol>
            <CCol xl={6} className="mt-3" xs="12" md="4">
              <div className="form-group">
                <div className="ms-2">
                  <label htmlFor="State">
                    Unit Type{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  id="UnitType"
                  name="UnitType"
                  options={[
                    { label: 'Count', value: 'Count' },
                    { label: 'Weight', value: 'Weight' },
                    { label: 'Volume', value: 'Volume' },
                    { label: 'Length', value: 'Length' },
                    { label: 'Area', value: 'Area' }
                  ]}
                  value={{ label: formData?.UnitType || 'Select Unit Type', value: formData?.UnitType || 'Select Unit Type' }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      UnitType: e.value
                    })
                  }
                  placeholder="Unit Type"
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

export default MaterialGroupModal;
