import MUIDataTable from 'mui-datatables';
import React, { useEffect, useRef, useState } from 'react';
import { CForm, CCol, CRow, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css';
import useApiManager from 'views/component/ApiManager';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Report() {
  const [showPicker, setShowPicker] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [reportDetail, setReportDetail] = useState([]);
  const [columnsData, setColumns] = useState([]);
  const { postRequest, formData, setFormData } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;

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
        const response = await postRequest('rptConsignment', { ...formData, userid: userData[0]?.nid });
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
      const actualQuantity = parseFloat(data['Loading Quantity']) || 0;
      const receivedQuantity = parseFloat(data['ReceivedQty']) || 0;
      const totalReportCount = data['SNo'] || 0;

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
          <strong>Report Details</strong>
        </CCardHeader>
        <CCardBody>
          <CForm className="row" onSubmit={handleReportSubmit}>
            <CRow className=" ">
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
                <p className="badge">Total Loading Quantity : {totals.totalActualQuantity.toFixed(2)}</p>
              </div>
            ) : null}
          </div>
          <div className="custom-mui-table mt-4">
            <MUIDataTable
              data={reportDetail}
              columns={columnsData}
              options={{
                ...options,
                responsive: 'standard' // Adjust responsiveness as needed
              }}
              className="custom-mui-datatable"
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

export default Report;
