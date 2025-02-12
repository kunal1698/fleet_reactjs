import React, { useState } from 'react';
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
import statesData from '../../State.json';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { capitalizeFirstLetter } from './Capitalize';
import useApiManager from './ApiManager';
import axios from 'axios';
function ConsignorAndConsigneeModal(props) {
  const {
    handleConsignmentSubmit,
    setPofetchingData,
    editData,
    handleConsignmentUpdate,
    handleDistricChange,
    transportlist,
    routeList,
    driverOption,
    fetchPoDetailing,
    stationaryDetail,
    VehicleAllDetal,
    pofetchingData,
    consignorAndConsignee,
    PoDetail,
    districtOptions,
    handleStateChange,
    setLedgerModal,
    showModal,
    setShowModal,
    isEdit,
    validated,
    setIsEdit,
    formData,
    setFormData,
    handleInputChange,
    handleMobileChange,
    setDriverModal,
    driverModal
  } = props;
  const stateDataFilter = statesData.states.map((item) => item.state);
  const [PoDetailItem, setPoDetailItem] = useState('');
  const [endDelevieryLocation, setEndDeliveryLocation] = useState('');

  const stateOptions = stateDataFilter.map((state) => ({
    value: state,
    label: state
  }));
  const { postRequest, getRequest } = useApiManager();
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
      case 'Attimg':
        handleFileChangeSubmit(randomFileName, file);
        setFormData({
          ...formData,
          Attimg: randomFileName + '.' + fileExtension || ''
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
  const renderFreightDetail = () => {
    return (
      <div>
        <strong>Freight Details:</strong>
        <hr style={{ backgroundColor: 'black' }} />
        <CRow className="mt-3">
          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group mt-">
              <div className="ms-2">
                <label htmlFor="UnitType">
                  Unit Type
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
              </div>
              <Select
                options={[
                  { label: 'Per Ton Based', value: 'Per Ton Based' },
                  { label: 'Per Trip Based', value: 'Per Trip Based' }
                ]}
                value={{ label: formData?.UnitLabel || 'Select Unit Type', value: formData?.UnitLabel }}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    UnitType: selectedOption.value,
                    UnitLabel: selectedOption.label
                  })
                }
                placeholder="Please select Unit Type"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group mt-">
              <div className="ms-2">
                <label htmlFor="FrieghtType">Freight Type</label>
              </div>
              <Select
                options={[
                  { label: 'Billed', value: 'Billed' },
                  { label: 'To Pay', value: 'To Pay' },
                  { label: 'Paid', value: 'Paid' }
                ]}
                value={{ label: formData?.FrieghtLabel || 'Select Freight Type', value: formData?.FrieghtLabel }}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    FrieghtType: selectedOption.value,
                    FrieghtLabel: selectedOption.label
                  })
                }
                placeholder="Please select Freight Type"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group mt-">
              <div className="ms-2">
                <label htmlFor="AdvanceType">Advance Type</label>
              </div>
              <Select
                options={[
                  { label: 'Fuel', value: 'Fuel' },
                  { label: 'Other', value: 'Other' }
                ]}
                value={{ label: formData?.AdvanceLabel || 'Select Advance Type', value: formData?.AdvanceLabel }}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    AdvanceType: selectedOption.value,
                    AdvanceLabel: selectedOption.label
                  })
                }
                placeholder="Please select Advance Type"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <CFormInput
              type="number"
              id="AdvanceAmount"
              name="AdvanceAmount"
              label={<span>Advance Amount</span>}
              value={formData?.AdvanceAmount}
              onChange={handleInputChange}
              placeholder="Advance Amount"
            />
          </CCol>

          <CCol xs="12" md="6">
            <CFormInput
              multiple
              label="Attach Document"
              type="file"
              id="file"
              onChange={(e) => handleFile(e, 'Attimg')}
              accept=".pdf,.doc,.docx,.txt,.jpeg"
            />
            {formData.Attimg && (
              <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                <a
                  href={`https://s3.ap-southeast-1.wasabisys.com/svgjpr/fleetask/${formData.Attimg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue' }}
                >
                  View Attachment
                </a>
              </div>
            )}
          </CCol>
        </CRow>

        <hr style={{ backgroundColor: 'black' }} />
      </div>
    );
  };

  const renderDeliveryDetail = () => {
    return (
      <div>
        <strong>Delivery Details</strong>
        <hr style={{ backgroundColor: 'black' }} />
        <CRow className="mt-3">
          <CCol xs="12" sm="6" md="4" lg="6">
            <CFormInput
              type="text"
              id="DeliveryPoint"
              name="DeliveryPoint"
              label={<span>Delivery Point</span>}
              value={formData?.DeliveryPoint}
              onChange={handleInputChange}
              placeholder="Delivery Point"
            />
          </CCol>
          <CCol xs="12" sm="6" md="4" lg="6">
            <CFormInput
              type="text"
              id="ChainageNumber"
              name="ChainageNumber"
              label={<span>Chainage Number</span>}
              value={formData?.ChainageNumber}
              onChange={handleInputChange}
              placeholder="Chainage Number"
            />
          </CCol>
        </CRow>

        <hr style={{ backgroundColor: 'black' }} />
      </div>
    );
  };

  const handleLoading = (event) => {
    const { name, value } = event.target;
    const decimalValue = parseFloat(value);

    if (value === '' || (decimalValue >= 0 && decimalValue <= 80 && !isNaN(decimalValue))) {
      setFormData({ ...formData, [name]: value });
    } else {
      // Optionally, you could show an error message here
      console.log('Invalid input. Enter a number between 0 and 80 with up to two decimal places.');
    }
  };
  const renderBasicDetail = () => {
    return (
      <div>
        <strong>Basic Details</strong>
        <hr style={{ backgroundColor: 'black' }} />
        <CRow className="mt-3">
          <CCol xs="12" sm="6" md="4" lg="3">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="CNDate" className="form-label">
                CN Date <span className="ms-1 text-danger">*</span>
              </label>
              <DatePicker
                maxDate={new Date()}
                required
                id="CNDate"
                name="CNDate"
                className="form-control"
                selected={formData.CNDate}
                onChange={(date) => handleDateChange(date, 'CNDate')}
                dateFormat="dd/MM/yyyy"
                placeholderText="CN Date"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group">
              <label htmlFor="BookName">Book Name</label>
              <Select
                options={stationaryDetail?.map((book) => ({
                  label: book.Bookname,
                  value: book.nid
                }))}
                value={{ label: formData?.BookLabel || 'Select Book Name', value: formData?.Label }}
                onChange={(selectedOption) => {
                  setFormData({
                    ...formData,
                    BookName: selectedOption.value,
                    BookLabel: selectedOption.label
                  });
                }}
                placeholder="Please select Book Name"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <CFormInput
              disabled={isEdit}
              type="text"
              id="CNNumber"
              name="CNNumber"
              label={
                <span>
                  CN Number <span className="text-danger">*</span>
                </span>
              }
              value={formData?.CNNumber}
              onChange={handleInputChange}
              placeholder="CN Number"
              required
            />
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <CFormInput
              type="number"
              id="ActualQty"
              name="ActualQty"
              label={
                <span>
                  Loading Quantity <span className="text-danger">*</span>
                </span>
              }
              value={formData?.ActualQty}
              onChange={handleLoading}
              min="0"
              max="80"
              step="0.01"
              pattern="^(?:[0-7]?[0-9]|80)(?:\.\d{1,2})?$" // Regex pattern for decimal numbers between 0 and 80
              title="Enter a number between 0 and 80 with up to two decimal places"
              placeholder="Loading Quantity"
              required
            />
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="EtaDelivery" className="form-label">
                ETA Delivery <span className="ms-1 text-danger">*</span>
              </label>
              <DatePicker
                required
                id="EtaDelivery"
                name="EtaDelivery"
                className="form-control"
                selected={formData.EtaDelivery}
                onChange={(date) => handleDateChange(date, 'EtaDelivery')}
                dateFormat="dd/MM/yyyy"
                placeholderText="ETA Delivery"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group">
              <label htmlFor="Vehicle">
                Vehicle <span className="text-danger">*</span>
              </label>
              <Select
                options={VehicleAllDetal?.map((vehicle) => ({
                  label: vehicle.VehicleNumber,
                  value: vehicle.nid
                }))}
                value={{ label: formData?.VehicleLabel || 'Select Vehicle', value: formData?.VehicleLabel }}
                onChange={(selectedOption) => {
                  setFormData({
                    ...formData,
                    Vehicle: selectedOption.value,
                    VehicleLabel: selectedOption.label
                  });
                }}
                placeholder="Please select Vehicle"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group">
              <label htmlFor="Transporter">Transporter</label>
              <Select
                options={transportlist?.map((transport) => ({
                  label: transport.TransporterName,
                  value: transport.TransID
                }))}
                value={{ label: formData?.TransportLabel || 'Select Transporter', value: formData?.TransportLabel }}
                onChange={(selectedOption) => {
                  setFormData({
                    ...formData,
                    TranspoterID: selectedOption.value,
                    TransportLabel: selectedOption.label
                  });
                }}
                placeholder="Please select Transporter"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <div className="form-group">
              <label htmlFor="Driver">Driver</label>
              <Select
                options={driverOption?.map((driver) => ({
                  label: `${capitalizeFirstLetter(driver.DriverFirstName)} ${capitalizeFirstLetter(driver.DriverLastName)}`,
                  value: driver.nid
                }))}
                value={{ label: formData?.DriverLabel || 'Select Driver', value: formData?.DriverLabel }}
                onChange={(selectedOption) => {
                  setFormData({
                    ...formData,
                    DriverID: selectedOption.value,
                    DriverLabel: selectedOption.label
                  });
                }}
                placeholder="Please select Driver"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
              <div onClick={() => setDriverModal(true)} style={{ textAlign: 'right', marginTop: '8px' }}>
                <a style={{ color: 'blue', cursor: 'pointer' }}>Add New Driver</a>
              </div>
            </div>
          </CCol>

          <CCol xs="12" sm="6" md="4" lg="3">
            <CFormInput
              type="text"
              id="Rermark"
              name="Rermark"
              label={<span>Remark</span>}
              value={formData?.Rermark}
              onChange={handleInputChange}
              placeholder="Remark"
            />
          </CCol>
        </CRow>
        <hr style={{ backgroundColor: 'black' }} />
      </div>
    );
  };
  const renderMaterialcDetail = () => {
    return (
      <div>
        <strong>Material Details </strong>
        <hr style={{ backgroundColor: 'black' }} />
        <CRow className="mt-3">
          <CCol className="mt-3" xs="3" md="4">
            <div className="form-group mt-">
              <div className="ms-2">
                <label htmlFor="state">
                  Load type{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
              </div>
              <Select
                // options={districtOptions}
                value={{ label: formData?.LoadType || 'Select Load Type', value: formData?.LoadType }}
                // onChange={handleDistricChange}
                placeholder="Please select Load type"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm" // Reduced height with form-control-sm class
              />
            </div>
          </CCol>

          <CCol className="mt-3" xs="3" md="4">
            <div className="form-group mt-">
              <div className="ms-2">
                <label htmlFor="state">
                  Material Group{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </label>
              </div>
              <Select
                // options={districtOptions}
                value={{ label: formData?.MaterialGroup || 'Select Material Group', value: formData?.MaterialGroup }}
                // onChange={handleDistricChange}
                placeholder="Please select Material Group"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm" // Reduced height with form-control-sm class
              />
            </div>
          </CCol>
        </CRow>

        <hr style={{ backgroundColor: 'black' }} />
      </div>
    );
  };
  return (
    <CModal
      className="modal-xl"
      alignment="center"
      visible={showModal}
      onClose={() => {
        setPofetchingData('');
        setFormData({
          DriverLabel: '',
          TransportLabel: '',
          TranspoterID: '',
          Distance: '',
          CNDate: '',
          CNNumber: '',
          ActualQty: '',
          EtaDelivery: '',
          Rermark: '',
          DeliveryPoint: '',
          ChainageNumber: '',
          UnitLabel: '',
          UnitType: '',
          FrieghtType: '',
          FrieghtLabel: '',
          AdvanceType: '',
          AdvanceLabel: '',
          AdvanceAmount: ''
        });
        setShowModal(false);
        setIsEdit(false);
      }}
      aria-labelledby={isEdit ? 'UpdateForm' : 'VerticallyCenteredExample'}
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{!isEdit ? 'Create' : 'Update'} Consignment</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={!isEdit ? handleConsignmentSubmit : handleConsignmentUpdate}
        >
          <CRow className="mt-3">
            <CCol xs="12" sm="6" md="4" xl="12">
              <div className="form-group">
                <label htmlFor="state">PO</label>
                <Select
                  options={PoDetail?.map((po) => ({
                    label: po.PONumber,
                    value: po.PONumber
                  }))}
                  value={{ label: formData?.Label || 'Select PO', value: formData?.Label }}
                  onChange={(selectedOption) => {
                    const selectedPo = PoDetail.find((po) => po.PONumber === selectedOption.label);
                    const deliveryPoints = selectedPo?.PointDetails?.split('-');
                    const lastLocation = deliveryPoints ? deliveryPoints[deliveryPoints.length - 1] : '';
                    setPoDetailItem(selectedPo);
                    setFormData({
                      ...formData,
                      PoNumber: selectedOption.value,
                      Label: selectedOption.label,
                      Distance: selectedPo?.LeadKM,
                      DeliveryPoint: lastLocation
                    });
                    fetchPoDetailing(selectedOption.label);
                  }}
                  placeholder="Please select PO"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <strong style={{ marginRight: 'auto', color: 'blue' }}>Qty In Ton: {pofetchingData[0]?.QtyInTon}</strong>
              <strong style={{ margin: '0 auto', color: 'blue' }}>Arrival Qty: {pofetchingData[0]?.ArrivalQty}</strong>
              <strong style={{ marginLeft: 'auto', color: 'blue' }}>Balance Qty: {pofetchingData[0]?.BalanceQty}</strong>
            </div>
            <CCol xs="12" sm="6" md="4" xl="3">
              <div className="form-group">
                <label htmlFor="consignor">Consignor</label>
                <Select
                  isDisabled
                  options={filterConsignor?.map((consignor) => ({
                    label: capitalizeFirstLetter(consignor.PartyName),
                    value: consignor.nid
                  }))}
                  value={{
                    label: ((formData.Label || editData.PONumber1) && pofetchingData[0]?.PartyName1) || 'Select Consignor',
                    value: formData?.Label
                  }}
                  placeholder="Please select Consignor"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" sm="6" md="4" xl="3">
              <div className="form-group">
                <label htmlFor="consignee">Consignee</label>
                <Select
                  isDisabled
                  options={filterConsignee?.map((consignee) => ({
                    label: capitalizeFirstLetter(consignee.PartyName),
                    value: consignee.nid
                  }))}
                  value={{ label: (formData.Label && pofetchingData[0]?.PartyName) || 'Select Consignee', value: formData?.Label }}
                  placeholder="Please select Consignee"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" sm="6" md="4" xl="3">
              <div className="form-group">
                <label htmlFor="branch">
                  Branch / Site <span className="text-danger">*</span>
                </label>
                <Select
                  isDisabled
                  value={{
                    label: (formData.Label && pofetchingData[0]?.OfficeName) || 'Select Branch / Site',
                    value: formData?.BranchOffice
                  }}
                  placeholder="Please select Branch Office"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" sm="6" md="4" xl="3">
              <div className="form-group">
                <label htmlFor="route">
                  Route <span className="text-danger">*</span>
                </label>
                <Select
                  isDisabled
                  options={routeList?.map((route) => ({
                    label: route.RouteName,
                    value: route.nid
                  }))}
                  value={{ label: (formData.Label && pofetchingData[0]?.RouteName) || 'Select Route', value: formData?.RouteLabel }}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      RouteId: selectedOption.value,
                      RouteLabel: selectedOption.label
                    });
                  }}
                  placeholder="Please select Route"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>

            <CCol xs="12" sm="6" md="4" xl="3">
              <CFormInput
                type="text"
                id="Distance"
                name="Distance"
                label={<span>Distance</span>}
                value={formData?.Distance}
                onChange={handleInputChange}
                placeholder="Distance"
              />
            </CCol>

            <CCol xs="12" sm="6" md="4" xl="3">
              <div className="form-group">
                <label htmlFor="material">
                  Material <span className="text-danger">*</span>
                </label>
                <Select
                  isDisabled
                  value={{ label: (formData.Label && pofetchingData[0]?.MaterialName) || 'Select Material', value: formData?.Material }}
                  placeholder="Please select Material"
                  classNamePrefix="custom-select"
                  className="basic-single form-control-sm"
                />
              </div>
            </CCol>
          </CRow>

          {renderBasicDetail()}
          {renderDeliveryDetail()}
          {renderFreightDetail()}

          <CRow className="mt-3">
            <CCardFooter className="bg-light">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                {!isEdit ? (
                  <CButton color="primary" className="me-md-2" type="submit">
                    Submit
                  </CButton>
                ) : (
                  <CButton color="primary" className="me-md-2" type="submit">
                    Update
                  </CButton>
                )}
                <CButton color="danger">Cancel</CButton>
              </CCol>
            </CCardFooter>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  );
}

export default ConsignorAndConsigneeModal;
