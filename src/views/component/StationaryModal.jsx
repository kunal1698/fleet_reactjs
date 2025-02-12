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
function StationaryModal(props) {
  const {
    validated,
    branchDetail,
    serviceProviderDetail,
    setIsEdit,
    showModal,
    setShowModal,
    setFormData,
    handleInputChange,
    formData,
    isEdit,
    handleStationarySubmit,
    handleStationaryEdit
  } = props;

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '220px' // Adjust the width as needed
    })
  };

  const handleDateChange = (date, field) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-CA');
      console.warn('Selected Date:', formattedDate);
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
        setIsEdit(false);
        setFormData({
          Bookname: '',
          ServiceProviderId: '',
          ServiceProviderLabel: '',
          Booktype: '',
          Nature: '',
          Label: '',
          BranchId: '',
          StationaryCode: '',
          StationaryNumber: '',
          StartingPage: '',
          LastpageNumber: '',
          EffectiveFrom: '',
          ExpiryDate: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Stationary</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={isEdit ? handleStationaryEdit : handleStationarySubmit}
        >
          <CRow className="mt-3">
            <CCol xs="12" md="4">
              <div className="form-group">
                <label htmlFor="Nature">
                  Service Provider{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <ReactSelect
                  id="Nature"
                  name="Nature"
                  options={serviceProviderDetail?.map((service) => ({
                    label: service.ClientName,
                    value: service.nid // Use nid as the value
                  }))}
                  value={{
                    label: formData?.ServiceProviderLabel || 'Select Service Provider',
                    value: formData?.ServiceProviderId || ''
                  }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      ServiceProviderId: selectedOption.value,
                      ServiceProviderLabel: selectedOption.label
                    })
                  }
                  placeholder="Select Service Provider"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" md="4">
              <div className="form-group">
                <label htmlFor="Branch">
                  Select Branch{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <ReactSelect
                  options={branchDetail?.map((branch) => ({
                    label: `${branch.OfficeName}-${branch.BranchState}`,
                    value: branch.nid // Use nid as the value
                  }))}
                  value={{
                    label: formData?.BranchLabel || 'Select Branch',
                    value: formData?.BranchId || ''
                  }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      BranchId: selectedOption.value,
                      BranchLabel: selectedOption.label
                    })
                  }
                  placeholder="Select Branch"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" md="4">
              <div className="form-group">
                <label htmlFor="Booktype">
                  Book Type{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <ReactSelect
                  id="Booktype"
                  name="Booktype"
                  options={[
                    { label: 'Consignment', value: 'Consignment' },
                    { label: 'Lorry Arrival', value: 'Lorry Arrival' },
                    { label: 'Order', value: 'Order' },
                    { label: 'Invoice', value: 'Invoice' },
                    { label: 'Payment Receipt', value: 'Payment Receipt' },
                    { label: 'Transaction', value: 'Transaction' }
                  ]}
                  value={{
                    label: formData?.Booktype || 'Select Book Type',
                    value: formData?.Booktype || ''
                  }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      Booktype: selectedOption.value
                    })
                  }
                  placeholder="Select Book Type"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" md="4">
              <CFormInput
                type="text"
                id="Bookname"
                name="Bookname"
                label={
                  <span>
                    Book Name{' '}
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.Bookname}
                onChange={handleInputChange}
                placeholder="Book Name"
                required
              />
            </CCol>

            <CCol xs="12" md="4">
              <div className="form-group">
                <label htmlFor="Nature">
                  Nature{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <ReactSelect
                  id="Nature"
                  name="Nature"
                  options={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Book Series', value: 'bookSeries' },
                    { label: 'Manual', value: 'manual' }
                  ]}
                  value={{
                    label: formData?.Nature || 'Select Nature',
                    value: formData?.Nature || ''
                  }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      Nature: selectedOption.value
                    })
                  }
                  placeholder="Select Nature"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" md="4">
              <div className="form-group">
                <label htmlFor="EffectiveFrom">
                  Effective From{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <DatePicker
                  required
                  id="EffectiveFrom"
                  name="EffectiveFrom"
                  className="form-control"
                  selected={formData.EffectiveFrom}
                  onChange={(date) => handleDateChange(date, 'EffectiveFrom')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Effective From"
                />
                <div className="invalid-feedback">Effective From is required</div>
              </div>
            </CCol>

            <CCol xs="12" md="4">
              <div className="form-group">
                <label htmlFor="ExpiryDate">
                  Expiry Date{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <DatePicker
                  required
                  id="ExpiryDate"
                  name="ExpiryDate"
                  className="form-control"
                  selected={formData.ExpiryDate}
                  onChange={(date) => handleDateChange(date, 'ExpiryDate')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Expiry Date"
                />
                <div className="invalid-feedback">Expiry Date is required</div>
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

export default StationaryModal;
