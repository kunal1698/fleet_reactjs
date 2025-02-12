import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

// project-import
import renderRoutes, { routes } from './routes';
import useApiManager from 'views/component/ApiManager';
import { useDispatch } from 'react-redux';
import { renderPemissions } from 'views/Redux/CounterSlice';
import { ToastContainer } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP ||============================== //

const App = () => {
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchMenuList();
  }, []);

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
  return (
    <HashRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ToastContainer />
        <div style={{ minHeight: '100vh', position: 'relative' }}>{renderRoutes(routes)}</div>
      </LocalizationProvider>
    </HashRouter>
  );
};

export default App;
