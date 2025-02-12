import React, { useEffect } from 'react';
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
import ReactSelect from 'react-select';

function DCModal(props) {
  const {
    validated,
    iseEditData,
    handleSubmit,
    showModal,
    handleDriverSubmit,
    setShowModal,
    setFormData,
    handleInputChange,
    formData,
    setIsEdit,
    isEdit,
    VehicleAllDetal
  } = props;

  const handleDateChange = (date, field) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-CA');

      setFormData({
        ...formData,
        [field]: formattedDate
      });
    } else {
      setFormData({
        ...formData,
        [field]: ''
      });
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
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} DC Received</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
          <CRow className="mt-3">
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                disabled
                type="text"
                id="CNNumber "
                name="CNNumber" // Corrected name attribute
                label={<span>CN Number</span>}
                value={formData.CNNumber}
                onChange={handleInputChange}
                placeholder="CN Number"
              />
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ReceiverName"
                name="ReceiverName" // Corrected name attribute
                label={
                  <span>
                    Receiver Name
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ReceiverName}
                onChange={handleInputChange}
                placeholder="Receiver Name"
                required
              />
            </CCol>{' '}
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="number"
                id="ReceiverMobile "
                name="ReceiverMobile" // Corrected name attribute
                label={
                  <span>
                    Receiver Mobile
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ReceiverMobile}
                onChange={handleInputChange}
                placeholder="Receiver Mobile"
                required
              />
            </CCol>
            <CCol className="mt-3" xs="12" sm="6" md="4">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="CNDate" className="form-label">
                  Receiving Date <span className="ms-1 text-danger">*</span>
                </label>
                <DatePicker
                  required
                  maxDate={new Date()}
                  id="ReceivedDate"
                  name="ReceivedDate"
                  className="form-control"
                  selected={formData.ReceivedDate}
                  onChange={(date) => handleDateChange(date, 'ReceivedDate')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="CN Date"
                />
              </div>
            </CCol>
            <CCol className="mt-3" xs="12" sm="6" md="4">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor="CNDate" className="form-label">
                  Receiving Update Date <span className="ms-1 text-danger">*</span>
                </label>
                <DatePicker
                  required
                  maxDate={new Date()}
                  id="ReceivingUpdateDate"
                  name="ReceivingUpdateDate"
                  className="form-control"
                  selected={formData.ReceivingUpdateDate}
                  onChange={(date) => handleDateChange(date, 'ReceivingUpdateDate')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="CN Date"
                />
              </div>
            </CCol>
            <CCol className="mt-3" xs="12" sm="6" md="4">
              <div className="form-group mt-">
                <div className="ms-2">
                  <label htmlFor="UnitType">
                    Receiving Status
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </label>
                </div>
                <ReactSelect
                  options={[{ label: 'Received', value: 'Received' }]}
                  value={{ label: formData?.UnitLabel || 'Received', value: formData?.UnitLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      DCRecivingStatus: selectedOption.value,
                      UnitLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Unit Type"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol className="mt-3" xs="12" md="4">
              <CFormInput
                type="text"
                id="ReceivingRemark "
                name="ReceivingRemark" // Corrected name attribute
                label={<span>Receiving Remark</span>}
                value={formData.ReceivingRemark}
                onChange={handleInputChange}
                placeholder="Receiving Remark"
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
  );
}

export default DCModal;
