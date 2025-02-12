import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import RouteMasterModal from 'views/component/RouteMasterModal';
import useApiManager from 'views/component/ApiManager';
import GoogleMapComponent from 'views/component/GoogleMapComponent';
import { useSelector } from 'react-redux';
function RouteMaster() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const [branchDetail, setBranchDetail] = useState([]);
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const { getRequest, formData } = useApiManager();
  const permissionRole = useSelector((state) => state.value);

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(routeData?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRoutes = routeData?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const getRouteData = async () => {
    const response = await getRequest('/getAllRoute', { ...formData, userId: userData[0]?.nid });
    setRouteData(response.data);
  };

  useEffect(() => {
    getRouteData();
  }, [showModal]);

  useEffect(() => {
    fetchBranch();
  }, []);

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

  const calculateRoute = (locations) => {
    if (locations.length < 2) return;

    const waypoints = locations.slice(1, -1).map((location) => ({
      location,
      stopover: true
    }));

    const origin = locations[0];
    const destination = locations[locations.length - 1];

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const handleRouteClick = (route) => {
    const latitudes = route.PointLat.split(',').map(Number);
    const longitudes = route.PointLong.split(',').map(Number);
    const locations = latitudes.map((lat, index) => ({
      lat,
      lng: longitudes[index],
      name: route.PointLocation.split(',')[index]
    }));
    setSelectedRoute({ ...route, locations });
    calculateRoute(locations);
  };
  const defaultCenter = { lat: 26.9163565, lng: 75.793392 };
  const defaultLocations = [{ lat: 26.9163565, lng: 75.793392 }];

  const locations = selectedRoute?.locations || defaultLocations;
  const center = selectedRoute?.locations?.[0] || defaultCenter;
  return (
    <CCard style={{ marginBottom: '10%' }}>
      <CCardHeader>
        <strong>Route Details</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs="12" className="d-grid gap-2 d-md-flex">
            <CButton
              disabled={permissionRole[9]?.pwrite == '0'}
              onClick={() => setShowModal(!showModal)}
              color="primary"
              className="me-md-2"
            >
              Add Route
            </CButton>
          </CCol>
        </CRow>
        <RouteMasterModal branchDetail={branchDetail} validated={validated} showModal={showModal} setShowModal={setShowModal} />
        <CRow className="mt-4">
          <CCol xs="12" md="5" className="mb-3 mb-md-0">
            {currentRoutes?.map((route, index) => (
              <div key={index} className="mb-3">
                <CCard onClick={() => handleRouteClick(route)} className="cursor-pointer">
                  <CCardBody style={{ padding: '20px 20px', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ color: '#606060', fontSize: '10px', lineHeight: 1, marginBottom: '2px' }}>Route Name:</p>
                        <strong style={{ display: 'block', marginBottom: '5px' }}>{route.RouteName}</strong>
                      </div>
                      <div>
                        <p style={{ color: '#606060', fontSize: '10px', lineHeight: 1, marginBottom: '2px' }}>Branch Name:</p>
                        <strong style={{ display: 'block', marginBottom: '5px' }}>{route.OfficeName}</strong>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '30px',
                        fontSize: '14px',
                        justifyContent: 'space-between',
                        marginTop: '20px'
                        // flexWrap: 'wrap'
                      }}
                    >
                      <div>
                        <p style={{ color: '#606060', fontSize: '10px', lineHeight: 1, marginBottom: '2px' }}>Starting Point:</p>
                        <p style={{ display: 'block', fontSize: '14px' }}>{route.PointDetails.split(',')[0]}</p>
                      </div>
                      <div>
                        <p style={{ color: '#606060', fontSize: '10px', lineHeight: 1, marginBottom: '2px' }}>Total Km:</p>
                        <p style={{ display: 'block', fontSize: '14px' }}>{route.DistanceKM} km</p>
                      </div>
                      <div>
                        <p style={{ color: '#606060', fontSize: '10px', lineHeight: 1, marginBottom: '2px' }}>End Point:</p>
                        <p style={{ display: 'block', fontSize: '14px' }}>{route.PointDetails.split(',').slice(-1)[0]}</p>
                      </div>
                      <div>
                        <p style={{ color: '#606060', fontSize: '10px', lineHeight: 1, marginBottom: '2px' }}>Created User:</p>
                        <p style={{ display: 'block', fontSize: '14px' }}>{route.AddUser}</p>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            ))}
            <div className="pagination-controls" style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  border: '1px solid #D3D3D3',
                  background: 'transparent',
                  padding: '10px',
                  borderRadius: '50%',
                  height: '30px',
                  width: '30px',
                  cursor: 'pointer',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    border: '1px solid #D3D3D3',
                    background: index + 1 === currentPage ? '#007bff' : '#fff',
                    color: index + 1 === currentPage ? '#fff' : '#000',
                    padding: '5px 10px',
                    borderRadius: '50%',
                    height: '30px',
                    width: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className={index + 1 === currentPage ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
              <button
                style={{
                  border: '1px solid #D3D3D3',
                  background: 'transparent',
                  padding: '10px',
                  borderRadius: '50%',
                  height: '30px',
                  width: '30px',
                  cursor: 'pointer',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          </CCol>
          <CCol xs="12" md="7">
            <div style={{ height: '100%', width: '100%' }}>
              <GoogleMapComponent center={{ lat: locations[0].lat, lng: locations[0].lng }} locations={locations} directions={directions} />
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
}

export default RouteMaster;
