import React, { useState, useEffect } from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CCol, CRow, CFormInput } from '@coreui/react';
import Button from 'react-bootstrap/Button';
import GoogleMapComponent from './GoogleMapComponent';
import Autocomplete from 'react-google-autocomplete';
import { FaTimes } from 'react-icons/fa'; // Import the cross icon
import './styles.css';
import useApiManager from './ApiManager';
import { REACT_LOGIN, REACT_PASS } from 'Variable';
import ReactSelect from 'react-select';
import { useBeforeUnload } from 'react-router-dom';
import { toast } from 'react-toastify';

const RouteMasterModal = (props) => {
  const { showModal, setShowModal, isEdit, branchDetail } = props;
  const [directions, setDirections] = useState(null);
  const [locations, setLocations] = useState([]);
  const [distance, setDistance] = useState(0);
  const [distances, setDistances] = useState([]);
  const [distancesFromFirst, setDistancesFromFirst] = useState([]);
  const [routeName, setRouteName] = useState('');
  const [branch, setBranch] = useState('');
  const { getRequest } = useApiManager();
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const center = { lat: 26.92144, lng: 75.73812 };

  const calculateRoute = () => {
    if (locations.length < 2) return;

    const waypoints = locations?.slice(1, -1)?.map((location) => ({
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
          const totalDistance = result.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0);
          setDistance(totalDistance / 1000);

          // Calculate distances between consecutive locations
          const newDistances = result.routes[0].legs.map((leg) => leg.distance.value / 1000);
          setDistances(newDistances);
          const newDistancesFromFirst = result.routes[0].legs.map((leg, index) => {
            return result.routes[0].legs.slice(0, index + 1).reduce((sum, leg) => sum + leg.distance.value, 0) / 1000;
          });
          setDistancesFromFirst(newDistancesFromFirst);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const handlePlaceSelected = (place, index) => {
    if (place.geometry && place.geometry.location) {
      const addressComponents = place.address_components;
      const sublocality = addressComponents.find((component) => component.types.includes('sublocality'))?.long_name || '';
      const locality = addressComponents.find((component) => component.types.includes('locality'))?.long_name || '';
      const firstWordOfName = place.name.split(' ').slice(0, 2).join('-');

      const locationString = `${firstWordOfName}-${sublocality}-${locality}`;

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: locationString
      };

      setLocations((prevLocations) => {
        const newLocations = [...prevLocations];
        newLocations[index] = location;
        return newLocations;
      });
    } else {
      console.error('Invalid place object:', place);
    }
  };

  const handleRemoveLocation = (index) => {
    if (index === 0) return;
    setLocations((prevLocations) => {
      const newLocations = prevLocations.filter((_, i) => i !== index);
      return newLocations;
    });
  };

  useEffect(() => {
    setLocations([{}]);
  }, []);

  useEffect(() => {
    if (locations.length > 1) {
      calculateRoute();
    } else {
      setDirections(null);
      setDistances([]);
      setDistancesFromFirst([]);
    }
  }, [locations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('APILOgin', REACT_LOGIN);
    urlencoded.append('APIPASS', REACT_PASS);
    urlencoded.append('route', routeName);
    urlencoded.append('distancekm', distance);
    urlencoded.append('Branch', branch.Branch);
    urlencoded.append('routelocation', locations.map((loc) => loc.name).join(','));
    urlencoded.append('routelat', locations.map((loc) => loc.lat).join(','));
    urlencoded.append('routelong', locations.map((loc) => loc.lng).join(','));
    urlencoded.append('routedetails', locations.map((loc) => loc.name).join(','));
    urlencoded.append('routekm', distancesFromFirst.join(','));
    urlencoded.append('Adduser', userData[0]?.nid);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };
    try {
      const response = await fetch(`https://vsl.svgcso.com/fleet.asmx/insertRoute`, requestOptions);
      const result = await response.json();

      if (result.IsSuccess) {
        setShowModal(false);
        toast.success('Route Created Successfully');
      }

      return result;
    } catch (error) {
      console.log(error, 'majajsja');
    }
  };

  return (
    <CModal className="modal-xl modal" alignment="center" visible={showModal} onClose={() => setShowModal(false)}>
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{isEdit ? 'Update' : 'Add'} Route</CModalTitle>
      </CModalHeader>
      <CModalBody className="mt-3">
        <CRow>
          <CCol xl={6} xs="12" sm="6" md="4">
            <div className="form-group">
              <label htmlFor="Branch">
                Select Branch / Site <span style={{ color: 'red' }}>*</span>
              </label>
              <ReactSelect
                options={branchDetail?.map((branch) => ({
                  label: `${branch.OfficeName}-${branch.BranchState}`,
                  value: branch.nid
                }))}
                value={{ label: branch?.BranchLabel || 'Select Branch / Site', value: branch?.BranchLabel }}
                onChange={(selectedOption) =>
                  setBranch({
                    Branch: selectedOption.value,
                    BranchLabel: selectedOption.label
                  })
                }
                placeholder="Please select Branch"
                classNamePrefix="custom-select"
                className="basic-single form-control-sm"
              />
            </div>
          </CCol>
          <CCol xl={6} xs="12" md="6">
            <CFormInput
              onChange={(e) => setRouteName(e.target.value)}
              type="text"
              id="RouteName"
              name="RouteName"
              label="Route Name"
              placeholder="Route Name"
              required
            />
          </CCol>
          <CCol xs="12" md="6">
            <div className="mt-4">
              <div className="d-flex justify-content-between">
                <span>
                  Starting Point{' '}
                  <span className="ms-1" style={{ color: 'red' }}>
                    *
                  </span>
                </span>
                <div className="total-distance">Total Distance: {distance.toFixed(2)} km</div>
              </div>
              {locations?.map((location, index) => (
                <div key={index} className="route-input-container">
                  <div className="d-flex justify-content-between">
                    <div>
                      {' '}
                      {index > 0 && <label>Route {index}</label>}
                      <span> {index > 0 && <FaTimes className="remove-icon" onClick={() => handleRemoveLocation(index)} />}</span>
                    </div>
                    <div>{index === 0 ? 0 : distances[index - 1]?.toFixed(2)} km</div>
                  </div>
                  <Autocomplete
                    className="autocomplete-container"
                    apiKey="AIzaSyDxhvfjHor2xF0lwqZx49NsenOl5TTwlBA"
                    onPlaceSelected={(place) => handlePlaceSelected(place, index)}
                    options={{
                      types: ['geocode', 'establishment'],
                      fields: ['address_components', 'geometry', 'icon', 'name', 'formatted_address']
                    }}
                  />
                </div>
              ))}
              <button className="btn-add" onClick={() => setLocations([...locations, {}])}>
                Add new Route
              </button>
            </div>
            <div className="d-flex justify-content-end">
              <Button className="btn-submit" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </CCol>
          <CCol className="mt-3" xs="12" md="6">
            <GoogleMapComponent center={center} locations={locations} directions={directions} />
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  );
};

export default RouteMasterModal;
