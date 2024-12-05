import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './Market.css';

export default function Market() {
  const { data } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const filteredStates = data?.statePrices?.filter((state) =>
    state.stateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStates = [...(filteredStates || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a.fuel[sortConfig.key]?.retailPrice || 0;
    const bValue = b.fuel[sortConfig.key]?.retailPrice || 0;

    if (sortConfig.direction === 'ascending') return aValue - bValue;
    if (sortConfig.direction === 'descending') return bValue - aValue;

    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key && prevConfig.direction === 'ascending') {
        return { key, direction: 'descending' };
      }
      return { key, direction: 'ascending' };
    });
  };

  const getSortIcons = (key) => (
    <span>
      {sortConfig.key === key && sortConfig.direction === 'ascending' ? '▲' : '△'}
      {sortConfig.key === key && sortConfig.direction === 'descending' ? '▼' : '▽'}
    </span>
  );

  return (
    <div className="market-container">
      <div className="pageHeader">MARKET</div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by state name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="fuel-price-table">
        <table>
          <thead>
            <tr>
              <th>State Name</th>
              <th onClick={() => handleSort('petrol')}>
                Petrol Price (INR) {getSortIcons('petrol')}
              </th>
              <th onClick={() => handleSort('diesel')}>
                Diesel Price (INR) {getSortIcons('diesel')}
              </th>
              <th onClick={() => handleSort('lpg')}>
                LPG Price (INR) {getSortIcons('lpg')}
              </th>
              <th onClick={() => handleSort('cng')}>
                CNG Price (INR) {getSortIcons('cng')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStates.map((state) => (
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
}
