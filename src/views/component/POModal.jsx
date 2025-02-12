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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useApiManager from './ApiManager';
import ReactSelect from 'react-select';
import { capitalizeFirstLetter } from './Capitalize';
import axios from 'axios';
import { toast } from 'react-toastify';
function POModal(props) {
  const {
    isEdit,
    setIsEdit,
    routeDetail,
    validated,
    handlePOMasterUpdate,
    materialDetail,
    showModal,
    handlePOSubmit,
    setShowModal,
    handleInputChange,
    branchDetail,
    ParentDetail,
    ServiceDetail,
    formData,
    setFormData,
    consignorAndConsignee
  } = props;
  const filterConsignee = consignorAndConsignee.filter((item) => item.PartyType == 'Consignee');
  const filterConsignor = consignorAndConsignee.filter((item) => item.PartyType == 'Consignor');

  const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleFileChangeSubmit = async (file, FileChange) => {
    const formData = new FormData();
    const directory = 'fleetask';
    formData.append('file', FileChange);
    formData.append('filename', file);
    formData.append('directory', directory);
    formData.append('accessKeyId', 'USDXRENI3CQ7AX70LPD7');
    formData.append('secretAccessKey', '6yRewo6kV5cc1z96LIbwwetL3y7r3REWVoodnDdh');
    formData.append('region', 'ap-southeast-1');
    formData.append('endpoint', 'https://s3.ap-southeast-1.wasabisys.com');
    formData.append('bucketName', 'svgjpr');

    try {
      const res = await axios.post('https://uploadimg.fleetask.com/upload', formData);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      console.log('There was an error uploading the file.');
    }
  };

  const handleFile = (e, fieldName) => {
    const file = e.target.files[0];
    const randomFileName = generateRandomString(10);
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'bmp', 'doc', 'txt'];
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type. Please upload files with extensions: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Set state based on the fieldName parameter
    switch (fieldName) {
      case 'LOADocument':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          LOADocument: randomFileName + '.' + fileExtension || ''
        });
        break;
      case 'PODocument':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          PODocument: randomFileName + '.' + fileExtension || ''
        });
        break;
      default:
        toast.error('Invalid field name');
        return;
    }
  };

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
  const handlePOQtyChange = (e) => {
    const poQty = e.target.value;
    const conversionFactor = formData.ConversionFactor;
    const qtyInTon = poQty * conversionFactor;
    setFormData({ ...formData, POQty: poQty, QtyInTon: qtyInTon });
  };

  const handleConversionFactorChange = (e) => {
    const conversionFactor = e.target.value;
    const poQty = formData.POQty;
    const qtyInTon = poQty * conversionFactor;
    setFormData({ ...formData, ConversionFactor: conversionFactor, QtyInTon: qtyInTon });
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
          LOANumber: '',
          ConsignorLabel: '',
          ConsigneeLabel: '',
          ConsigneeID: '',
          ConsigneeID1: '',
          ServiceProviderID: '',
          RouteID: '',
          RouteLabel: '',
          ConsignorID: '',
          ClientName: '',
          PONumber: '',
          LeadKM: '',
          POQty: '',
          ConversionFactor: '',
          QtyInTon: '',
          PODate: '',
          ParantalLabel: '',
          PerantCompanyID: '',
          POExpDate: '',
          PoExtdate: null,
          MaterialLabel: '',
          MaterialId: '',
          BranchLabel: '',
          BranchID: '',
          QtyType: '',
          LOADocument: '',
          ServiceLabel: '',
          PODocument: ''
        });
      }}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} PO</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={isEdit ? handlePOMasterUpdate : handlePOSubmit}
        >
          <CRow className="mt-3">
            <CCol xs="12" sm="6" md="4">
              <CFormInput
                type="text"
                id="LOANumber"
                name="LOANumber"
                label={
                  <span>
                    LOA Number
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.LOANumber}
                onChange={handleInputChange}
                placeholder="LOA Number"
                required
              />
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <CFormInput
                type="text"
                id="PONumber"
                name="PONumber"
                label={
                  <span>
                    PO Number
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.PONumber}
                onChange={handleInputChange}
                placeholder="PO Number"
                required
              />
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="ParantalCompany">
                  Select Parental Company <span style={{ color: 'red' }}>*</span>
                </label>
                <ReactSelect
                  options={ParentDetail?.map((branch) => ({
                    label: branch.CompanyName,
                    value: branch.nid
                  }))}
                  value={{ label: formData?.ParantalLabel || 'Select Parental Company', value: formData?.ParantalLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      PerantCompanyID: selectedOption.value,
                      ParantalLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Parent Company"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="Branch">
                  Select Branch / Site <span style={{ color: 'red' }}>*</span>
                </label>
                <ReactSelect
                  options={branchDetail?.map((branch) => ({
                    label: `${branch.OfficeName}-${branch.BranchState}`,
                    value: branch.nid
                  }))}
                  value={{ label: formData?.BranchLabel || 'Select Branch / Site', value: formData?.BranchLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      BranchID: selectedOption.value,
                      BranchLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Branch"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="ServiceProvider">
                  Select Service Provider <span style={{ color: 'red' }}>*</span>
                </label>
                <ReactSelect
                  options={ServiceDetail?.map((branch) => ({
                    label: branch.ClientName,
                    value: branch.nid
                  }))}
                  value={{ label: formData?.ServiceLabel || 'Select Service Provider', value: formData?.ServiceLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      ServiceProviderID: selectedOption.value,
                      ServiceLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Service Provider"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="Consignor">Consignor</label>
                <ReactSelect
                  options={filterConsignor?.map((consignor) => ({
                    label: capitalizeFirstLetter(consignor.PartyName),
                    value: consignor.nid
                  }))}
                  value={{ label: formData?.ConsignorLabel || 'Select Consignor', value: formData?.ConsignorLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      ConsignorID: selectedOption.value,
                      ConsignorLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Consignor"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="Consignee">Consignee</label>
                <ReactSelect
                  options={filterConsignee?.map((consignee) => ({
                    label: capitalizeFirstLetter(consignee.PartyName),
                    value: consignee.nid
                  }))}
                  value={{ label: formData?.ConsigneeLabel || 'Select Consignee', value: formData?.ConsigneeLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      ConsigneeID: selectedOption.value,
                      ConsigneeLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Consignee"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="Route">
                  Select Route <span style={{ color: 'red' }}>*</span>
                </label>
                <ReactSelect
                  options={routeDetail?.map((route) => ({
                    label: route.RouteName,
                    value: route.nid
                  }))}
                  value={{ label: formData?.RouteLabel || 'Select Route', value: formData?.RouteLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      RouteID: selectedOption.value,
                      RouteLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Route"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="Material">
                  Select Material <span style={{ color: 'red' }}>*</span>
                </label>
                <ReactSelect
                  options={materialDetail?.map((material) => ({
                    label: material.MaterialName,
                    value: material.nid
                  }))}
                  value={{ label: formData?.MaterialLabel || 'Select Material', value: formData?.MaterialLabel }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MaterialId: selectedOption.value,
                      MaterialLabel: selectedOption.label
                    })
                  }
                  placeholder="Please select Material"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <CFormInput
                type="number"
                id="LeadKM"
                name="LeadKM"
                label={
                  <span>
                    Lead KM
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.LeadKM}
                onChange={handleInputChange}
                placeholder="Lead KM"
                required
              />
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group">
                <label htmlFor="QtyType">
                  Select Quantity Unit <span style={{ color: 'red' }}>*</span>
                </label>
                <ReactSelect
                  options={[
                    { label: 'Cubic Meter', value: 'Cubic Meter' },
                    { label: 'Metric TON', value: 'Metric TON' }
                  ]}
                  value={{ label: formData?.QtyType || 'Select Quantity Unit', value: formData?.QtyType }}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      QtyType: selectedOption.value
                    })
                  }
                  placeholder="Select Quantity Unit"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <CFormInput
                type="number"
                id="POQty"
                name="POQty"
                label={
                  <span>
                    PO Quantity
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.POQty}
                onChange={handlePOQtyChange}
                placeholder="PO Quantity"
                required
              />
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <CFormInput
                type="number"
                id="ConversionFactor"
                name="ConversionFactor"
                label={
                  <span>
                    Conversion Factor
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.ConversionFactor}
                onChange={handleConversionFactorChange}
                placeholder="Conversion Factor"
                required
              />
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <CFormInput
                type="number"
                id="QtyInTon"
                name="QtyInTon"
                label={
                  <span>
                    Quantity In Ton
                    <span className="ms-1" style={{ color: 'red' }}>
                      *
                    </span>
                  </span>
                }
                value={formData.QtyInTon}
                onChange={(e) => setFormData({ ...formData, QtyInTon: e.target.value })}
                placeholder="Quantity In Ton"
                required
              />
            </CCol>

            <CCol xs="12" sm="6" md="4">
              <div className="form-group mt-2">
                <label htmlFor="PODate" className="form-label">
                  PO Date
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <DatePicker
                  required
                  id="PODate"
                  name="PODate"
                  className="form-control"
                  selected={formData.PODate}
                  onChange={(date) => handleDateChange(date, 'PODate')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="PO Date"
                />
                <div className="invalid-feedback">PO Date is required.</div>
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group mt-2">
                <label htmlFor="POExpDate" className="form-label">
                  PO Expiry Date
                </label>
                <DatePicker
                  id="POExpDate"
                  name="POExpDate"
                  className="form-control"
                  selected={formData.POExpDate}
                  onChange={(date) => handleDateChange(date, 'POExpDate')}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="PO Expiry Date"
                />
                <div className="invalid-feedback">PO Expiry Date is required.</div>
              </div>
            </CCol>
            <CCol className="mt-2" xs={12} sm={6} md={4} lg={3}>
              <div className="form-group">
                <label htmlFor="TDS">
                  Select PO Extention{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
                <ReactSelect
                  id="POExtention"
                  name="POExtention"
                  options={[
                    { label: 'Yes', value: 'Yes' },
                    { label: 'No', value: 'No' }
                  ]}
                  value={{ label: formData?.POExtensation || 'Select PO Extention', value: formData?.POExtensation }}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      POExtensation: selectedOption.value
                    });
                  }}
                  placeholder="Select TDS Applicable"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
            {formData.POExtensation === 'Yes' && (
              <CCol xs="12" sm="6" md="4">
                <div className="form-group mt-2">
                  <label htmlFor="PoExtdate" className="form-label">
                    PO Extension Date
                  </label>
                  <DatePicker
                    id="PoExtdate"
                    name="PoExtdate"
                    className="form-control"
                    selected={formData.PoExtdate || ''}
                    onChange={(date) => handleDateChange(date, 'PoExtdate')}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="PO Extension Date"
                  />
                  <div className="invalid-feedback">PO Extension Date is required.</div>
                </div>
              </CCol>
            )}
            <CCol xs="12" sm="6" md="4">
              <div className="form-group mt-2">
                <label htmlFor="LOADocument" className="form-label">
                  LOA Document
                </label>
                <CFormInput
                  type="file"
                  id="LOADocument"
                  onChange={(e) => handleFile(e, 'LOADocument')}
                  accept=".pdf,.doc,.docx,.txt,.jpeg"
                />
                {formData.LOADocument && (
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <a
                      href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.LOADocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{ color: 'blue' }}>View Attachment</div>
                    </a>
                  </div>
                )}
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4">
              <div className="form-group mt-2">
                <label htmlFor="PODocument" className="form-label">
                  PO Document
                </label>
                <CFormInput type="file" id="PODocument" onChange={(e) => handleFile(e, 'PODocument')} accept=".pdf,.doc,.docx,.txt,.jpeg" />
                {formData.PODocument && (
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <a
                      href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.PODocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{ color: 'blue' }}>View Attachment</div>
                    </a>
                  </div>
                )}
              </div>
            </CCol>

            <CCol xs="12">
              <CCardFooter style={{ backgroundColor: '#f8f9fa' }}>
                <CCol className="d-grid gap-2 mt-3 d-md-flex justify-content-md-end">
                  <CButton color="primary" type="submit">
                    {isEdit ? 'Update' : 'Submit'}
                  </CButton>
                </CCol>
              </CCardFooter>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  );
}

export default POModal;
