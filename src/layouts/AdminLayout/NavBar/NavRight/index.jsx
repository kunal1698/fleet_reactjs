import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown, Card } from 'react-bootstrap';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import ChatList from './ChatList';

// assets
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';
import avatar5 from '../../../../assets/images/user/FlitlogoUser.png';
import FlitLogo from '../../../../assets/images/Flitlogo.png';

// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const navigate = useNavigate();
  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'yesterday'
    }
  ];
  const resetSession = () => {
    sessionStorage.removeItem('userData'); // Clear user data from sessionStorage
    window.location.href = '/'; // Redirect to login page or BASE_URL
  };

  console.warn('userData', userData);
  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              {/* <i className="feather icon-bell icon" />
              <span className="badge rounded-pill bg-danger">
                <span />
              </span> */}
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            {/* <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}> */}
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox">
              {/* <i className="icon feather icon-mail" />
              <span className="badge bg-success">
                <span />
              </span> */}
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <span style={{ fontWeight: 'bold' }}> User Type : {userData[0]?.User_Type}</span>
            &nbsp;
            <span style={{ fontWeight: 'bold' }}> User Name : {userData[0]?.LoginName}</span>
            &nbsp;
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img src={FlitLogo} className="img-radius wid-40" alt="User Profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img
                  style={{ borderRadius: '50px', marginRight: '10px' }}
                  id="main-logo"
                  width={'30%'}
                  src={FlitLogo}
                  alt=""
                  className="logo"
                />
                <span>{userData[0]?.LoginName}</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link className="dropdown-item">
                    <i className="feather icon-user"></i> {userData[0]?.User_Type}
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/UpdatePassword" className="dropdown-item">
                    <i className="feather icon-unlock" /> Update Password
                  </Link>
                </ListGroup.Item>

                <ListGroup.Item onClick={resetSession} as="li" bsPrefix=" ">
                  <Link className="dropdown-item">
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
