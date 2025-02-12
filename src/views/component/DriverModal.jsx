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
import useApiManager from './ApiManager';
import { toast, ToastContainer } from 'react-toastify';
function DriverModal(props) {
  const {
    validated,
    showModal,
    setShowModal,
    handleInputChange,
    setIsEdit,
    isEdit,
    fetchDriver,
    handleDriverSubmit,
    handleDriverUpdate,
    formData,
    setFormData
  } = props;

  const handleMobileChange = (e) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      DriverMobile: newValue
    }));
  };

  return (
    <>
      {' '}
      <CModal
        className="modal-lg"
        alignment="center"
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEdit(false);
          setFormData({
            DriverFirstName: '',
            DriverLastName: '',
            DriverMobile: ''
          });
        }}
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={isEdit ? handleDriverUpdate : handleDriverSubmit}
          >
            <CRow className="mt-3">
              <CCol xs="12" md="4">
                <CFormInput
                  type="text"
                  id="DriverFirstName"
                  name="DriverFirstName" // Corrected name attribute
                  label={
                    <span>
                      Full Name
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData.DriverFirstName}
                  onChange={(e) => setFormData({ ...formData, DriverFirstName: e.target.value })}
                  placeholder="Full Name"
                  required
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormInput
                  type="text"
                  id="DriverLastName"
                  name="DriverLastName" // Corrected name attribute
                  label={
                    <span>
                      License Number{' '}
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData.DriverLastName}
                  onChange={(e) => setFormData({ ...formData, DriverLastName: e.target.value })}
                  placeholder="License Number"
                  required
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormInput
                  type="number"
                  id="DriverMobile"
                  name="DriverMobile" // Corrected name attribute
                  label={
                    <span>
                      Mobile Number
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData.DriverMobile}
                  onChange={handleMobileChange}
                  placeholder="Mobile Number"
                  required
                />
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
    </>
  );
}

export default DriverModal;
