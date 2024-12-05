import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import '../Dashboard/Dashboard.css';

const Dashboard = () => {
  const { data, userState } = useContext(AppContext);
  const [selectedState, setSelectedState] = useState(userState || '');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSelectedState(query);
    const filteredStates = data?.statePrices.filter((state) =>
      state.stateName.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredStates || []);
  };

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    setSuggestions([]);
  };

  useEffect(() => {
    setSelectedState(userState);
    setSuggestions([]);
  }, [userState]); 

  const filteredStates = data?.statePrices || [];

  return (
    <div className="dashboard-container">
      <div className="pageHeader">DASHBOARD</div>
      <div className="search-container">
        <label htmlFor="state-search">Search State: </label>
        <input
          id="state-search"
          type="text"
          placeholder="Type state name..."
          value={selectedState}
          onChange={handleSearchChange}
        />

        {selectedState && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((state) => (
              <li
                key={state.stateId || state.stateName}
                onClick={() => handleStateSelect(state.stateName)} // Handle click to select state
              >
                {state.stateName}
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="state-cards">
        {filteredStates?.filter((state) => state.stateName === selectedState)
          .map((state) => (
            <div style={{display:"flex"}}>
              <div className="state-card" key={`${state.stateId}-petrol`}>
                <div style={{display:"flex",justifyContent:'space-between'}}>
                  <div>
                    <h3>{state.stateName}</h3>
                    <p><strong>Petrol: </strong>{state.fuel.petrol.retailPrice} INR</p>
                    <p><strong>Unit: </strong>{state.fuel.petrol.retailUnit}</p>
                  </div>
                  <img src="/icons/petrol.png" alt="petrol" />
                </div>
                <div className="updated-date">Updated on:{new Date(state.applicableOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</div>
              </div>

              <div className="state-card" key={`${state.stateId}-diesel`}>
                <div style={{display:"flex",justifyContent:'space-between'}}>
                  <div>
                    <h3>{state.stateName}</h3>
                    <p><strong>Diesel: </strong>{state.fuel.diesel.retailPrice} INR</p>
                    <p><strong>Unit: </strong>{state.fuel.diesel.retailUnit}</p>
                  </div>
                  <img src="/icons/diesel.png" alt="diesel" />
                </div>
                <div className="updated-date">Updated on: {new Date(state.applicableOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</div>
              </div>

              <div className="state-card" key={`${state.stateId}-lpg`}>
                <div style={{display:"flex",justifyContent:'space-between'}}>
                  <div>
                    <h3>{state.stateName}</h3>
                    <p><strong>LPG: </strong>{state.fuel.lpg.retailPrice} INR</p>
                    <p><strong>Unit: </strong>{state.fuel.lpg.retailUnit}</p>
                  </div>
                  <img src="/icons/lpg.png" alt="lpg" />
                </div>
                <div className="updated-date">Updated on: {new Date(state.applicableOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</div>
              </div>

              {state.fuel.cng &&<div className="state-card" key={`${state.stateId}-cng`}>
                <div style={{display:"flex",justifyContent:'space-between'}}>
                  <div>
                    <h3>{state.stateName}</h3>
                    <p><strong>CNG: </strong>{state.fuel.cng.retailPrice} INR</p>
                    <p><strong>Unit: </strong>{state.fuel.cng?.retailUnit}</p>
                  </div>
                  <img src="/icons/cng.png" alt="cng" />
                </div>
                <div className="updated-date">Updated on: {new Date(state.applicableOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</div>
              </div>}
            </div>
          ))}
      </section>

      <section className="fuel-price-table">
        <table>
          <thead>
            <tr>
              <th>State Name</th>
              <th>Petrol Price (INR)</th>
              <th>Diesel Price (INR)</th>
              <th>LPG Price (INR)</th>
              <th>CNG Price (INR)</th>
            </tr>
          </thead>
          <tbody>
            {filteredStates.map((state) => (
              <tr key={state.stateId}>
                <td>{state.stateName}</td>
                <td>{state.fuel.petrol.retailPrice} INR</td>
                <td>{state.fuel.diesel.retailPrice} INR</td>
                <td>{state.fuel.lpg.retailPrice} INR</td>
                <td>{state.fuel.cng ? `${state.fuel.cng.retailPrice} INR` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
