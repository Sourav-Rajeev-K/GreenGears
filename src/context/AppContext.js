import React, { createContext, useState, useEffect, useRef } from 'react';
import Popup from '../components/Popup/Popup';
import './AppContext.css'
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const defaultState = 'Karnataka'
  const [data, setData] = useState(null);
  const [userState, setUserState] = useState(defaultState);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const hasFetchedData = useRef(false);
  const [loading, setLoading] = useState(false);

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setUserState(defaultState);
  };

  const fetchData = async () => {
    setLoading(true);
	  fetchLoc()
    try {
	  const response = await axios.get('https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/states', {
			headers: {
			  'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
			},
		  });
      setData(response.data);
	  
    } catch (error) {
	  /* 	added hard coded data ifs api fails */
	  const response = await fetch(`${process.env.PUBLIC_URL}/fueldata.txt`);  
	  const text = await response.text();
	  setData(JSON.parse(text));
      console.error('Error fetching data:', error);
    }finally {
      setLoading(false);
    }
  };

  const fetchLoc = async () => {
    setLoading(true);
	  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`);
            const locationData = await response.json();
            const state = locationData?.results[0]?.components?.state;
            if(state){
              setUserState(state)
            }
            else{
              showErrorPopup('Error fetching your location')
            }
          } catch (error) {
            setUserState(defaultState)
            console.error('Error fetching location:', error);
          } finally {
            setLoading(false);
          }
        },
        () => {
        showErrorPopup('Location access is required to fetch your state specific data. Please enable location services.')
        }
      );
	  } else {
		showErrorPopup('Your browser does not support geolocation services.')
	  }
  }

  const monitorPermissions = async () => {
    if (!navigator.permissions) return;
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') fetchLoc();
      permission.onchange = () => {
        permission.state === 'granted'
          ? fetchLoc()
          : showErrorPopup(
              'Location access is required to fetch your state specific data. Please enable location services.'
            );
      };
    } catch (error) {
      console.error('Error monitoring permissions:', error);
    }
  };


  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true;
    }
    monitorPermissions();
  }, []);

  return (
    <AppContext.Provider value={{ data, userState, loading }}>
      {children}
      {showPopup && !loading && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
      {loading &&  (
        <div className="loading-overlay">
          <img src="/loading.gif" alt="Loading..." />
        </div>
      )}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
