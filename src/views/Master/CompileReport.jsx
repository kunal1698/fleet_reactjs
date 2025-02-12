import MUIDataTable from 'mui-datatables';
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
import 'react-toastify/dist/ReactToastify.css';
import DriverModal from 'views/component/DriverModal';
import 'react-datepicker/dist/react-datepicker.css';

import useApiManager from 'views/component/ApiManager';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { FaPencilAlt } from 'react-icons/fa';
function CompileReport() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reportDetail, setReportDetail] = useState([]);
  const [columnsData, setColumns] = useState([]);
  const { postRequest, formData, setFormData } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  useEffect(() => {
    handleReportSubmit();
  }, []);

  const handleReportSubmit = async () => {
    try {
      const response = await postRequest('rptCompileReport', { ...formData, userid: userData[0]?.nid });
      if (response.data) {
        toast.success(response?.message);
        setValidated(false);
        setFormData({ ...formData, FromDate: '', ToDate: '' });
        const userData = response.data;
        console.warn('userData', userData[0]);
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
  };

  const options = {
    filterType: 'text',
    selectableRows: 'none'
  };

  const totals = reportDetail.reduce(
    (acc, data) => {
      const actualQuantity = parseFloat(data['Loading Quantity']) || 0;
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
          <strong>Compile Details</strong>
        </CCardHeader>
        <CCardBody>
          <div className="custom-mui-table mt-4">
            {reportDetail.length ? (
              <div className="summary-info">
                <p className="badge">Total Count : {reportDetail.length}</p>
                <p className="badge">Total Loading Quantity : {totals.totalActualQuantity.toFixed(2)}</p>
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

export default CompileReport;
