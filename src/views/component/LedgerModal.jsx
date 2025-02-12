import React, { useEffect, useState } from 'react';
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
import useApiManager from './ApiManager';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function LedgerModal(props) {
  const {
    ledgerModal,
    isEdit,
    bankButton,
    setBankButton,
    setLedgerModal,
    formData,
    setFormData,
    validated,
    handleInputChange,
    handleMobileChange,
    handleStateChange,
    ledgerOption,
    fetchTransport,
    fetchLedger
  } = props;

  const { postRequest, getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [branchDetail, setBranchDetail] = useState([]);

  useEffect(() => {
    fetchBranch();
  }, []);
  const fetchBranch = async () => {
    try {
      const result = await getRequest('getAllBranch', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setBranchDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleLedgerSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('InsertLedger', { ...formData, AddUser: userData[0]?.nid });
        setLedgerModal(false);
        fetchTransport();
        fetchLedger();
        toast.success(response.data[0]?.EMsg);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  const handleDistricChange = (selectedOption) => {
    setFormData({
      ...formData,
      UnderGroup: selectedOption.value
    });
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
  console.warn('dddf', formData);
  return (
    <>
      {' '}
      <CModal
        className="modal-lg"
        alignment="center"
        visible={ledgerModal}
        onClose={() => {
          setLedgerModal(false);
          setBankButton(false);
        }}
        aria-labelledby={isEdit ? 'UpdateForm' : 'VerticallyCenteredExample'}
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add Ledger</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleLedgerSubmit}>
            <CRow className="mt-3">
              <CCol xs="12" md="4">
                <CFormInput
                  type="text"
                  id="LedgerName"
                  name="LedgerName" // Corrected name attribute
                  label={
                    <span>
                      Ledger Name
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData.LedgerName}
                  onChange={(e) => setFormData({ ...formData, LedgerName: e.target.value })}
                  placeholder="Ledger Name"
                  required
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormInput
                  type="text"
                  id="LedgerCode"
                  name="LedgerCode" // Corrected name attribute
                  label={
                    <span>
                      Ledger Code
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </span>
                  }
                  value={formData.LedgerCode}
                  onChange={handleInputChange}
                  placeholder="Ledger Code"
                  required
                />
              </CCol>
              <CCol xs="12" md="4">
                <div className="form-group mt-1">
                  <div className="ms-2">
                    <label htmlFor="state">
                      Under Group
                      <span className="ms-1" style={{ color: 'red' }}>
                        *
                      </span>
                    </label>
                  </div>
                  <Select
                    options={[
                      { label: 'Sundary Debtors', value: 'Sundary Debtors' },
                      { label: 'Sundary Creditor', value: 'Sundary Creditor' },
                      { label: 'Branch/Divison', value: 'Branch/Divison' },
                      { label: 'Duties&/Taxes', value: 'Duties&/Taxes' },
                      { label: 'Direct Expenses', value: 'Direct Expenses' },
                      { label: 'Indirect Expenses', value: 'Indirect Expenses' }
                    ]}
                    value={{ label: formData.UnderGroup || 'Select Under Group', value: formData.UnderGroup }}
                    onChange={handleDistricChange}
                    placeholder="Select Under Group"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm" // Reduced height with form-control-sm class
                  />
                </div>
              </CCol>
              <CCol className="mt-2" xs="12" md="4">
                <CFormInput
                  type="text"
                  id="TallyAccountName"
                  name="TallyAccountName" // Corrected name attribute
                  label={<span>Tally Account Name</span>}
                  value={formData.TallyAccountName}
                  onChange={handleInputChange}
                  placeholder="Tally Account Name"
                  required
                />
              </CCol>
              <CCol className="mt-2" xs="12" md="4">
                <CFormInput
                  type="number"
                  id="OpeningBlance"
                  name="OpeningBlance" // Corrected name attribute
                  label={<span>Opening Balance</span>}
                  value={formData.OpeningBlance}
                  onChange={handleInputChange}
                  placeholder="Opening Balance"
                  required
                />
              </CCol>
              <CCol xs="4">
                <div className="mt-2">
                  <label htmlFor="Opening Balance Date" className="form-label">
                    Opening Balance Date
                  </label>
                  <DatePicker
                    maxDate={new Date()}
                    required
                    id="OpeningBlanceDate"
                    name="OpeningBlanceDate"
                    className="form-control"
                    selected={formData.OpeningBlanceDate}
                    onChange={(date) => handleDateChange(date, 'OpeningBlanceDate')}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Opening Balance Date"
                  />
                  <div className="invalid-feedback">Invoice Date is required.</div>
                </div>
              </CCol>

              <CCol xl={12} xs="12" md="4">
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
                    options={branchDetail?.map((branch) => ({
                      label: branch.OfficeName,
                      value: branch.nid // Use nid as the value
                    }))}
                    value={{ label: formData?.Label || 'Select Branch', value: formData?.Label }}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        BranchID: selectedOption.value, // Store nid in LedgerID
                        Label: selectedOption.label
                      })
                    }
                    placeholder="Please select Branch"
                    classNamePrefix="custom-select"
                    className="basic-single form-control-sm" // Reduced height with form-control-sm class
                  />
                </div>
              </CCol>
              <strong className="mt-4">Bank Account Details</strong>
              <div>
                <hr className="mt-2" style={{ backgroundColor: 'black' }} />
                {!bankButton && (
                  <div onClick={() => setBankButton(true)} className="d-flex justify-content-center align-items-center">
                    <CButton color="primary" className="me-md-2">
                      Add Bank Account
                    </CButton>
                  </div>
                )}
                {bankButton && (
                  <CRow>
                    <CCol xs="12" md="4">
                      <CFormInput
                        type="text"
                        id="BankName"
                        name="BankName" // Corrected name attribute
                        label={
                          <span>
                            Bank Name
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        value={formData.BankName}
                        onChange={handleInputChange}
                        placeholder="Bank Name"
                        required
                      />
                    </CCol>
                    <CCol xs="12" md="4">
                      <CFormInput
                        type="number"
                        id="AccountNumber"
                        name="AccountNumber" // Corrected name attribute
                        label={
                          <span>
                            Account Number
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        value={formData.AccountNumber}
                        onChange={handleInputChange}
                        placeholder="Account Number"
                        required
                      />
                    </CCol>
                    <CCol xs="12" md="4">
                      <CFormInput
                        type="text"
                        id="IFSCCode"
                        name="IFSCCode" // Corrected name attribute
                        label={
                          <span>
                            IFSC Code
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        value={formData.IFSCCode}
                        onChange={handleInputChange}
                        placeholder="IFSC Code"
                        required
                      />
                    </CCol>
                    <CCol className="mt-2" xs="12" md="4">
                      <CFormInput
                        type="text"
                        id="BranchName"
                        name="BranchName" // Corrected name attribute
                        label={
                          <span>
                            Branch name
                            <span className="ms-1" style={{ color: 'red' }}>
                              *
                            </span>
                          </span>
                        }
                        value={formData.BranchName}
                        onChange={handleInputChange}
                        placeholder="Branch Name"
                        required
                      />
                    </CCol>
                    <CCol className="mt-2" xs="12" md="4">
                      <CFormInput
                        type="text"
                        id="Bstatus"
                        name="Bstatus" // Corrected name attribute
                        label={<span>Account Status</span>}
                        value={formData.Bstatus}
                        onChange={handleInputChange}
                        placeholder="Account Status"
                        required
                      />
                    </CCol>
                    <CCol xs="4">
                      <div className="mt-2">
                        <label htmlFor="Opening Balance Date" className="form-label">
                          Opening Date
                        </label>
                        <DatePicker
                          maxDate={new Date()}
                          required
                          id="OpendingDate"
                          name="OpendingDate"
                          className="form-control"
                          selected={formData.OpendingDate}
                          onChange={(date) => handleDateChange(date, 'OpendingDate')}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Opening Date"
                        />
                        <div className="invalid-feedback">Invoice Date is required.</div>
                      </div>
                    </CCol>
                  </CRow>
                )}
                <hr className="mt-3" style={{ backgroundColor: 'black' }} />
              </div>
              <CCardFooter style={{ backgroundColor: '#f8f9fa' }}>
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="primary" type="submit">
                    Submit
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

export default LedgerModal;
