import { useState } from 'react';
import { REACT_LOGIN, REACT_PASS } from 'Variable';

const BASE_URL = 'https://vsl.svgcso.com/fleet.asmx/';

const useApiManager = () => {
  const [formData, setFormData] = useState({});
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const postRequest = async (endpoint, data, siteId) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('APILOgin', REACT_LOGIN);
    urlencoded.append('APIPASS', REACT_PASS);
    siteId && urlencoded.append('JOBID', siteId);
    for (const key in data) {
      urlencoded.append(key, data[key]);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const getRequest = async (endpoint, data, jobId, userRoleId) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('APILOgin', REACT_LOGIN);
    urlencoded.append('APIPASS', REACT_PASS);
    urlencoded.append('id', '');
    jobId && urlencoded.append('JOBID', jobId);
    userRoleId && urlencoded.append('userid', userRoleId);

    for (const key in data) {
      urlencoded.append(key, data[key]);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return { postRequest, formData, setFormData, getRequest };
};

export default useApiManager;
