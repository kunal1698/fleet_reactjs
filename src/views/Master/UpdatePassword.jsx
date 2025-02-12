import React, { useState } from 'react';
import { CForm, CFormInput, CCol, CButton, CCard, CCardBody, CInputGroup, CInputGroupText, CContainer, CCardHeader } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import eyeOff from '../../../src/assets/images/eyeOff.png';
import eyeOn from '../../../src/assets/images/eyeOn.png';

function UpdatePassword() {
  const userDataString = sessionStorage.getItem('userData');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    APILOgin: REACT_LOGIN,
    APIPASS: REACT_PASS,
    AddStamp: '1',
    OldPassword: '',
    Newpass: '',
    ConfirmPassword: '', // Added ConfirmPassword to formData
    loginid: userData?.Login_ID || ''
  });

  const navigate = useNavigate();

  if (!userData) {
    console.warn('User data not found in session storage');
    return null;
  }

  const handleSubmit = async () => {
    const form = document.getElementById('changePasswordForm');
    if (form.checkValidity() === false) {
      setValidated(true); // Enable validation feedback
      return;
    }

    if (formData.OldPassword !== userData[0]?.Login_Pass) {
      toast.error('Your Old Password is Wrong');
      return;
    }

    if (formData.Newpass !== formData.ConfirmPassword) {
      toast.error('New Password and Confirm Password do not match');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('APILOgin', REACT_LOGIN);
    urlencoded.append('APIPASS', REACT_PASS);
    urlencoded.append('loginid', userData[0]?.Login_ID);
    urlencoded.append('Newpass', formData.Newpass);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch('https://vsl.svgcso.com/fleet.asmx/userchangepassword', requestOptions);
      const result = await response.text();
      if (result.data !== null) {
        sessionStorage.removeItem('userData'); // Remove userData from sessionStorage
        toast.success('Password changed successfully');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
      // Handle result
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="bg-body-tertiary d-flex flex-column align-items-center justify-content-center">
      <CContainer>
        <CCard>
          <CCardHeader>
            <strong style={{ fontWeight: 'bold' }}>Update Password</strong>
          </CCardHeader>
          <CCardBody>
            <CForm id="changePasswordForm" className="row g-3 needs-validation" noValidate validated={validated}>
              {/* Old Password Input */}
              <CInputGroup className="mb-3 position-relative">
                <div style={{ position: 'relative', width: '100%' }}>
                  <CFormInput
                    type={showOldPassword ? 'text' : 'password'}
                    id="OldPassword"
                    placeholder="Old Password"
                    value={formData.OldPassword}
                    onChange={(e) => setFormData({ ...formData, OldPassword: e.target.value })}
                    required
                  />
                  <span className="password-toggle-icon-login" onClick={() => setShowOldPassword(!showOldPassword)}>
                    <img src={showOldPassword ? eyeOn : eyeOff} alt="Toggle Old Password Visibility" />
                  </span>
                </div>
              </CInputGroup>

              {/* New Password Input */}
              <CInputGroup className="mb-3 position-relative">
                <div style={{ position: 'relative', width: '100%' }}>
                  <CFormInput
                    type={showNewPassword ? 'text' : 'password'}
                    id="Newpass"
                    placeholder="New Password"
                    value={formData.Newpass}
                    onChange={(e) => setFormData({ ...formData, Newpass: e.target.value })}
                    required
                  />
                  <span className="password-toggle-icon-login" onClick={() => setShowNewPassword(!showNewPassword)}>
                    <img src={showNewPassword ? eyeOn : eyeOff} alt="Toggle New Password Visibility" />
                  </span>
                </div>
              </CInputGroup>

              {/* Confirm Password Input */}
              <CInputGroup className="mb-3 position-relative">
                <div style={{ position: 'relative', width: '100%' }}>
                  <CFormInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="ConfirmPassword"
                    placeholder="Confirm Password"
                    value={formData.ConfirmPassword}
                    onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                    required
                  />
                  <span className="password-toggle-icon-login" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <img src={showConfirmPassword ? eyeOn : eyeOff} alt="Toggle Confirm Password Visibility" />
                  </span>
                </div>
              </CInputGroup>

              {/* Submit Button */}
              <CCol xs="12" className="d-grid gap-2 d-md-flex justify-content-md-center">
                <CButton onClick={handleSubmit} color="primary" className="me-md-2">
                  Submit
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
      <ToastContainer />
    </div>
  );
}

export default UpdatePassword;
