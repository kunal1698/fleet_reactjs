import React, { useEffect, useRef, useState } from 'react';
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
// react-bootstrap
import { Row, Col, Card, Table, ListGroup } from 'react-bootstrap';

// third party

import OrderCard from '../../components/Widgets/Statistic/OrderCard';

import useApiManager from 'views/component/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { renderPemissions } from 'views/Redux/CounterSlice';
import ReactSelect from 'react-select';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DashAnalytics = () => {
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const [dashboardDetail, setDashboardDetail] = useState([]);
  const [dashboardDetailFilter, setDashboardDetailFilter] = useState({});
  const [ParentalDetail, setParentalDetail] = useState([]);
  const [serviceDetail, setServiceDetail] = useState([]);
  const [branchDetail, setBranchDetail] = useState([]);
  const [PoDetail, setPoDetail] = useState([]);
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const dispatch = useDispatch();
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchMenuList();
    fetchDashboard();
    fetchParental();
    fetchServiceProvider();
    fetchBranch();
    fetchPO();
    fetchDashboard();
  }, []);

  useEffect(() => {
    setFormData({ Pid: 'All', ServiceId: 'All', BranchId: 'All', PO: 'All' });
  }, []);

  useEffect(() => {
    formData && fetchDashboardDetails();
  }, [formData]);

  // const dashboardDetailFilter = [
  //   { title: 'Card 1', value: 10 },
  //   { title: 'Card 2', value: 20 },
  //   { title: 'Card 3', value: 30 },
  //   { title: 'Card 4', value: 40 },
  //   { title: 'Card 5', value: 50 }
  // ];

  const fetchDashboardDetails = async () => {
    try {
      const result = await getRequest('rpt_DashboardShow', {
        ...formData,
        userId: userData[0]?.nid
      });
      if (result.IsSuccess) {
        setDashboardDetailFilter(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchPO = async () => {
    try {
      const result = await getRequest('GetallPO', { ...formData, userId: userData[0]?.nid });
      if (result.IsSuccess) {
        setPoDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

  const fetchServiceProvider = async () => {
    try {
      const result = await getRequest('GetallClient', formData);
      if (result.IsSuccess) {
        setServiceDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchParental = async () => {
    try {
      const result = await getRequest('GetallParentCompany', formData);
      if (result.IsSuccess) {
        setParentalDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchMenuList = async () => {
    try {
      const result = await getRequest('/getAllMenuSubmenubyUSer', formData, false, userData[0]?.nid);
      if (result.IsSuccess) {
        localStorage.setItem('permission', JSON.stringify(result.data));
        dispatch(renderPemissions(result.data));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const fetchDashboard = async () => {
    try {
      const result = await getRequest('getDashboard', formData);
      if (result.IsSuccess) {
        setDashboardDetail(result.data);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const data = dashboardDetailFilter[0] || {};

  // Convert data to an array of objects for card rendering
  const formattedData = Object.keys(data).map((key) => ({
    title: key,
    value: data[key]
  }));

  const formatAsRupees = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Extract and format both values
  const formatBothValues = (value) => {
    const [value1, value2] = value.split('/').map((val) => parseFloat(val.trim()));
    return {
      formattedValue1: formatAsRupees(value1),
      formattedValue2: formatAsRupees(value2)
    };
  };

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setSelectionRange({
      startDate,
      endDate,
      key: 'selection'
    });
    setFormData({
      ...formData,
      FromDate: format(startDate, 'yyyy-MM-dd'),
      ToDate: format(endDate, 'yyyy-MM-dd')
    });
    if (startDate && endDate) {
      setShowPicker(true);
    }
  };

  const formatDate = (date) => format(date, 'MMM dd, yyyy');
  const customRanges = {
    Today: [new Date(), new Date()],
    Yesterday: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1))],
    'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],
    'Last 30 Days': [new Date(new Date().setDate(new Date().getDate() - 29)), new Date()],
    'This Month': [new Date(new Date().setDate(1)), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
    'Last Month': [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    ]
  };
  return (
    <React.Fragment>
      <CForm className="row">
        <CCol xl={12} className="d-flex ">
          <div className="date-range-picker-container mb-2" ref={pickerRef}>
            <button
              style={{ whiteSpace: 'nowrap', minWidth: '220px' }}
              className="date-range-button"
              type="button"
              onClick={() => setShowPicker(!showPicker)}
            >
              {`${
                selectionRange.startDate && selectionRange.endDate
                  ? `${formatDate(selectionRange.startDate)} -> ${formatDate(selectionRange.endDate)}`
                  : 'Select Range'
              }`}
            </button>
            {showPicker && (
              <div className="date-range-picker">
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  direction="horizontal"
                />
              </div>
            )}
          </div>
          <CCol className="ms-4">
            <CButton style={{ height: '4.4vh' }} color="primary">
              Filter
            </CButton>
          </CCol>
        </CCol>
        <CCol xl={3} xs="12" sm="6" md="4" lg="3" className="mt-3">
          <div className="form-group">
            <label htmlFor="Transporter">Parental Company</label>
            <ReactSelect
              required
              options={[
                { label: 'All', value: 'All' },
                ...(ParentalDetail?.map((Parental) => ({
                  label: Parental.CompanyName,
                  value: Parental.nid
                })) || [])
              ]}
              value={{
                label: formData?.ParentalLabel || 'All',
                value: formData?.ParentalLabel || 'All'
              }}
              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  Pid: selectedOption.value || 'All',
                  ParentalLabel: selectedOption.label
                });
              }}
              placeholder="Please select Transporter"
              classNamePrefix="custom-select"
              className="basic-single form-control-sm"
            />
          </div>
        </CCol>
        <CCol xl={3} xs="12" sm="6" md="4" className="mt-3">
          <div className="form-group">
            <label htmlFor="Route">Service Provider</label>
            <ReactSelect
              required
              options={[
                { label: 'All', value: 'All' },
                ...(serviceDetail?.map((route) => ({
                  label: route.ClientName,
                  value: route.nid
                })) || [])
              ]}
              value={{
                label: formData?.ServiceLabel || 'All',
                value: formData?.ServiceLabel || 'All'
              }}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  ServiceId: selectedOption.value || 'All',
                  ServiceLabel: selectedOption.label
                })
              }
              placeholder="Please select Route"
              classNamePrefix="custom-select"
              className="basic-single form-control-sm"
            />
          </div>
        </CCol>
        <CCol xl={3} xs="12" sm="6" md="4" className="mt-3">
          <div className="form-group">
            <label htmlFor="Route">Branch - State</label>
            <ReactSelect
              required
              options={[
                { label: 'All', value: 'All' },
                ...(branchDetail?.map((branch) => ({
                  label: `${branch.OfficeName}-${branch.BranchState}`,
                  value: branch.nid
                })) || [])
              ]}
              value={{
                label: formData?.BranchLabel || 'All',
                value: formData?.BranchLabel || 'All'
              }}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  BranchId: selectedOption.value || 'All',
                  BranchLabel: selectedOption.label
                })
              }
              placeholder="Please select Branch - State"
              classNamePrefix="custom-select"
              className="basic-single form-control-sm"
            />
          </div>
        </CCol>
        <CCol xs="12" sm="6" md="4" xl={3} className="mt-3">
          <div className="form-group">
            <label htmlFor="state">Purchase Order</label>
            <ReactSelect
              options={[
                { label: 'All', value: 'All' },
                ...(PoDetail?.map((po) => ({
                  label: po.PONumber,
                  value: po.PONumber
                })) || [])
              ]}
              value={{
                label: formData?.Label || 'All',
                value: formData?.Label || 'All'
              }}
              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  PO: selectedOption.value || 'All',
                  Label: selectedOption.label
                });
              }}
              placeholder="Please select PO"
              classNamePrefix="custom-select"
              className="basic-single form-control-sm"
            />
          </div>
        </CCol>
      </CForm>
      <Row className="mt-3">
        {/* order cards */}

        {formattedData.map((item, index) => {
          console.warn('ffff', index);
          const { formattedValue1, formattedValue2 } = formatBothValues(item.value);
          return (
            <Col key={index} md={6} xl={3}>
              <OrderCard
                params={{
                  title: item.title,
                  class: `bg-c-${index === 0 ? 'blue' : index === 6 || index === 10 || index === 9 || index === 3 ? 'green' : index === 1 || index === 5 || index === 8 ? 'yellow' : 'red'}`,
                  icon: 'feather icon-info',
                  primaryText: `${formattedValue1}/${formattedValue2}`
                }}
              />
            </Col>
          );
        })}
        {/* <Col md={12} xl={6}>
          <Card>
            <Card.Header>
              <h5>Unique Visitor</h5>
            </Card.Header>
            <Card.Body className="ps-4 pt-4 pb-0">
              <Chart {...uniqueVisitorChart} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Row>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Consignments</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0">{dashboardDetail[0]?.TotalConsigment}</h2>
                      <span className="text-c-green">
                        {dashboardDetail[0]?.TotalConsigment}%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle f-10 mx-2 text-success" />0
                      </h3>
                      <span className="ms-3">New</span>
                    </Col>
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle text-primary f-10 mx-2" />0
                      </h3>
                      <span className="ms-3">Return</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="bg-primary text-white">
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Vehicles</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0 text-white">{dashboardDetail[0]?.vehicle}</h2>
                      <span className="text-white">
                        0%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart1} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-success" />0
                      </h3>
                      <span className="ms-3">New</span>
                    </Col>
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-white" />0
                      </h3>
                      <span className="ms-3">Return</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col> */}
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
