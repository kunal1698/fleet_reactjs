import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // assuming you use react-toastify for notifications
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import 'react-toastify/dist/ReactToastify.css';
import useApiManager from 'views/component/ApiManager';
import { useRouter } from 'hooks/useRouter';
import eyeOff from '../../../assets/images/eyeOff.png';
import eyeOn from '../../../assets/images/eyeOn.png';

const JWTLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { postRequest, formData, setFormData, getRequest } = useApiManager();
  const router = useRouter();

  const handleButtonClick = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    form.classList.add('was-validated');

    if (form.checkValidity()) {
      try {
        const response = await postRequest('getuserlogin', formData);
        sessionStorage.setItem('userData', JSON.stringify(response.data));
        if (response.data !== null) {
          navigate('/dashboard/');
        } else {
          toast.error('Invalid Credentials');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <form noValidate className="needs-validation" onSubmit={handleButtonClick}>
        <div className="form-group mb-3">
          <input
            className="form-control"
            label="Email Address / Username"
            id="loginid"
            name="loginid"
            value={formData.loginid}
            placeholder="Username"
            type="text"
            onChange={handleInputChange}
            required
          />
          <div className="invalid-feedback">Username is required.</div>
        </div>
        <div className="form-group mb-4 password-input-container">
          <div className="input-with-icon">
            <input
              className="form-control"
              label="Password"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              type={showPassword ? 'text' : 'password'}
              onChange={handleInputChange}
              required
            />
            {formData.password && (
              <span className="password-toggle-icon-login" onClick={togglePasswordVisibility}>
                <img src={showPassword ? eyeOn : eyeOff} alt="Toggle Password Visibility" />
              </span>
            )}
          </div>
        </div>
        <Row>
          <Col mt={2}>
            <Button className="btn-block mb-4" color="primary" size="large" type="submit" variant="primary">
              Log in
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default JWTLogin;
