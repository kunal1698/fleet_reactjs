import MUIDataTable from 'mui-datatables';
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
import 'react-toastify/dist/ReactToastify.css';
import DriverModal from 'views/component/DriverModal';
import 'react-datepicker/dist/react-datepicker.css';

import useApiManager from 'views/component/ApiManager';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
function LorryArrivalReport() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reportDetail, setReportDetail] = useState([]);
  const [columnsData, setColumns] = useState([]);
  const { postRequest, formData, setFormData } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [showPicker, setShowPicker] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
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

  const handleRangeClick = (range) => {
    setSelectionRange({
      startDate: range[0],
      endDate: range[1],
      key: 'selection'
    });
    setFormData({
      ...formData,
      FromDate: format(range[0], 'yyyy-MM-dd'),
      ToDate: format(range[1], 'yyyy-MM-dd')
    });
    setShowPicker(true); // Keep picker open after range selection
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      try {
        const response = await postRequest('rptLorryArrival', { ...formData, userid: userData[0]?.nid });
        if (response.data) {
          toast.success(response?.message);
          setFormData({ ...formData, FromDate: '', ToDate: '' });
          const userData = response.data;
          const headers =
            userData.length > 0
              ? Object.keys(userData[0]).map((key) => ({
                  name: key,
                  label: key
                }))
              : [];
          setReportDetail(userData);
          setColumns(
            headers.map((header) => ({
              name: header.name,
              label: header.label
            }))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  const options = {
    filterType: 'text',
    selectableRows: 'none'
  };

  const totals = reportDetail.reduce(
    (acc, data) => {
      const actualQuantity = parseFloat(data['Actual Quantity']) || 0;
      const receivedQuantity = parseFloat(data['Received Quantity (MT)']) || 0;
      const totalReportCount = data['SNo'] || 0;

      console.warn('data', data);
      acc.totalActualQuantity += actualQuantity;
      acc.totalReceivedQuantity += receivedQuantity;
      acc.totalReportCount += totalReportCount;

      return acc;
    },
    { totalActualQuantity: 0, totalReceivedQuantity: 0 }
  );

  return (
    <>
      <CCard style={{ marginBottom: '10%' }}>
        <CCardHeader>
          <strong>Lorry Arrival Details</strong>
        </CCardHeader>
        <CCardBody>
          <CForm className="row " onSubmit={handleReportSubmit}>
            <CRow className="g-3 align-items-end">
              <CCol className="d-flex ">
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
                  <CButton style={{ height: '4.4vh' }} color="primary" type="submit">
                    Submit
                  </CButton>
                </CCol>
              </CCol>
            </CRow>
          </CForm>

          <div className="custom-mui-table mt-4">
            {reportDetail.length ? (
              <div className="summary-info">
                <p className="badge">Total Count : {reportDetail.length}</p>

                <p className="badge">Total Received Quantity : {totals.totalReceivedQuantity.toFixed(2)}</p>
              </div>
            ) : null}
            <MUIDataTable
              // title={'User Client List'}
              data={reportDetail}
              columns={columnsData}
              options={{
                ...options,
                responsive: 'standard' // Adjust responsiveness as needed
                // Additional options can be added here
              }}
              className="custom-mui-datatable"
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

export default LorryArrivalReport;
