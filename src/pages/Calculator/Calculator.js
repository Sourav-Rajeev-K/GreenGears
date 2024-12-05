import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './Calculator.css';

export default function Calculator() {
  const { data, userState } = useContext(AppContext);
  const [selectedState, setSelectedState] = useState('');
  const [fuelType,setFuelType] = useState('petrol')
  const [calcData, setCalcData]= useState({
    fuelPrice:'',
    distance:'',
    fuelUsed:'',
    fuelAmount:'',
    inputMethod:'total',
    startOdometer:'',
    endOdometer:'',
    expectedMileage:'',
    fuelInputMethod: 'money'
  })
  const [resultData, setResultData] = useState ({
    mileage:'',
    errorMessage:'',
    feedbackMessage:''
  })

  const compareMileage = (calculatedMileage) => {
    if (!calcData.expectedMileage) {
      setResultData((prev)=>({...prev,feedbackMessage:''}))
      return;
    }

    const expected = Number(calcData.expectedMileage);
    if (calculatedMileage > expected) {
      setResultData((prev)=>({...prev,feedbackMessage:'Your vehicle is in excellent condition! Great job maintaining it!'}))
      // setFeedbackMessage('Your vehicle is in excellent condition! Great job maintaining it!');
    } else if (calculatedMileage < expected) {
      setResultData((prev)=>({...prev,
        feedbackMessage:'Your vehicle might need some attention. Consider these tips to improve mileage:\n' +
          '- Check tire pressure\n' +
          '- Avoid unnecessary idling\n' +
          '- Perform regular maintenance like oil changes'}))
      // setFeedbackMessage(
      //   'Your vehicle might need some attention. Consider these tips to improve mileage:\n' +
      //     '- Check tire pressure\n' +
      //     '- Avoid unnecessary idling\n' +
      //     '- Perform regular maintenance like oil changes'
      // );
    } else {
      setResultData((prev)=>({...prev,feedbackMessage:'Your vehicle is performing as expected. Keep up the good work!'}))
      // setFeedbackMessage('Your vehicle is performing as expected. Keep up the good work!');
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    const state = data?.statePrices.find((state) => state.stateId === stateId);
    if (state) {
      setCalcData((prev)=>({...prev,fuelPrice:state.fuel[fuelType]?.retailPrice || ''}))
    }
  };

  const handleFuelTypeChange = (e) => {
    const selectedFuel = e.target.value;
    setFuelType(selectedFuel)
    if (selectedState) {
      const state = data?.statePrices.find((state) => state.stateId === selectedState);
      if (state) {
        setCalcData((prev) => ({...prev,fuelPrice:state.fuel[selectedFuel]?.retailPrice || ''}))
      }
    }
  };

  const handleFuelInputMethodChange = (e) => {
    setCalcData((prev) => ({...prev,fuelInputMethod:e.target.value}))
  };

  const resetStateSelection = () => {
    setSelectedState('');
    setCalcData((prev) => ({...prev,fuelPrice:''}))
  };

  useEffect(() => {
    if (userState && data?.statePrices) {
      const matchedState = data.statePrices.find(
        (state) => state.stateName === userState
      );
      if (matchedState) {
        setSelectedState(matchedState.stateId);
        setCalcData((prev) => ({...prev,fuelPrice:matchedState.fuel[fuelType]?.retailPrice || ''}))
      }
    }
  }, [userState, data, fuelType]);

  useEffect(() => {
    if ((selectedState && !calcData.fuelPrice) || (calcData.fuelInputMethod === 'liters' && !calcData.fuelUsed) || (calcData.fuelInputMethod === 'money' && !calcData.fuelAmount) || (!calcData.distance && calcData.inputMethod === 'total')) {
      setResultData((prev)=>({...prev,resultData:'',errorMessage:'Please fill out all fields!',feedbackMessage:''}))
      return;
    }

    if (calcData.inputMethod === 'odometer') {
      if (!calcData.startOdometer || !calcData.endOdometer) {
        setResultData((prev=>({...prev,errorMessage:'Please enter both starting and ending odometer readings!',mileage:'',feedbackMessage:''})))
        return;
      }

      if (Number(calcData.startOdometer) >= Number(calcData.endOdometer)) {
        setResultData((prev)=>({errorMessage:'Starting odometer reading must be less than the ending reading!',mileage:'',feedbackMessage:''}))
        return;
      }
    }

    const calculatedDistance =
      (calcData.inputMethod === 'odometer')
        ? Number(calcData.endOdometer) - Number(calcData.startOdometer)
        : Number(calcData.distance);

    let fuelUsedInLiters = calcData.fuelUsed;
    if (calcData.fuelInputMethod === 'money') {
      fuelUsedInLiters = calcData.fuelAmount / calcData.fuelPrice;
    }
    const calculatedMileage = calculatedDistance / fuelUsedInLiters;
    setResultData((prev)=>({...prev,errorMessage:'',mileage:calculatedMileage.toFixed(2)}))
    compareMileage(calculatedMileage);
  }, [calcData]);

  return (
    <div style={{ padding: '40px' }}>
      <div className="pageHeader">MILEAGE CALCULATOR</div>
      <div className="calculator-container">
        <div className="form-group">
          <label>Select State:</label>
          <div className="state-selection">
            <select value={selectedState} onChange={handleStateChange}>
              <option value="">Select a State</option>
              {data?.statePrices.map((state) => (
                <option key={state.stateId} value={state.stateId}>
                  {state.stateName}
                </option>
              ))}
            </select>
            <button onClick={resetStateSelection} className="reset-button">
              Reset
            </button>
          </div>
        </div>

        {calcData.fuelInputMethod !== 'liters' && <div className="fuel-type">
          <label>Select Fuel Type:</label>
          <div className='distance-options'>
            <div>
              <input
                type="radio"
                value="petrol"
                checked={fuelType === 'petrol'}
                onChange={handleFuelTypeChange}
              />
              <label>Petrol</label>
            </div>
            <div>
              <input
                type="radio"
                value="diesel"
                checked={fuelType === 'diesel'}
                onChange={handleFuelTypeChange}
              />
              <label>Diesel</label>
            </div>
          </div>
        </div>}

        {calcData.fuelInputMethod !== 'liters' && <div className="form-group">
          <label>Fuel Price (INR):</label>
          <input
            type="number"
            value={calcData.fuelPrice}
            onChange={(e) => setCalcData((prev) => ({...prev,fuelPrice:e.target.value}))}
            placeholder="Enter fuel price"
            onWheel={(e) => e.target.blur()}
            disabled={!!selectedState}
          />
        </div>}

        <div className="fuel-type">
          <label>Fuel Used:</label>
          <div className='distance-options'>
            <div>
              <input
                type="radio"
                value="money"
                checked={calcData.fuelInputMethod === 'money'}
                onChange={handleFuelInputMethodChange}
              />
              <label>Amount Spent (INR)</label>
            </div>
            <div>
              <input
                type="radio"
                value="liters"
                checked={calcData.fuelInputMethod === 'liters'}
                onChange={handleFuelInputMethodChange}
              />
              <label>Total Fuel Used (liters)</label>
            </div>
          </div>
        </div>

        {calcData.fuelInputMethod === 'liters' ? (
          <div className="form-group">
            <label>Fuel Used (liters):</label>
            <input
              type="number"
              value={calcData.fuelUsed}
              onChange={(e) => setCalcData((prev) => ({...prev,fuelUsed:e.target.value}))}
              placeholder="Enter fuel used"
              onWheel={(e) => e.target.blur()}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Fuel Amount Spent (INR):</label>
            <input
              type="number"
              value={calcData.fuelAmount}
              onChange={(e) => setCalcData((prev) => ({...prev,fuelAmount:e.target.value}))}
              placeholder="Enter amount spent"
              onWheel={(e) => e.target.blur()}
            />
          </div>
        )}

        <div className="fuel-type">
          <label>Distance:</label>
          <div className='distance-options'>
            <div>
              <input
                type="radio"
                value="total"
                checked={calcData.inputMethod === 'total'}
                onChange={() => setCalcData((prev) => ({...prev,inputMethod:'total'}))}
              />
              <label>Total Distance Traveled</label>
            </div>
            <div>
              <input
                type="radio"
                value="odometer"
                checked={calcData.inputMethod === 'odometer'}
                onChange={() => setCalcData((prev) => ({...prev,inputMethod:'odometer'}))}
              />
              <label>Odometer Readings</label>
            </div>
          </div>
        </div>

        {calcData.inputMethod === 'total' ? (
          <div className="form-group">
            <label>Distance (km):</label>
            <input
              type="number"
              value={calcData.distance}
              onChange={(e) => setCalcData((prev) => ({...prev,distance:e.target.value}))}
              placeholder="Enter distance"
              onWheel={(e) => e.target.blur()}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Odometer Readings (km):</label>
            <div>
              <input
                type="number"
                value={calcData.startOdometer}
                onChange={(e) => setCalcData((prev) => ({...prev,startOdometer:e.target.value}))}
                placeholder="Starting Odometer"
                onWheel={(e) => e.target.blur()}
              />
              <input
                type="number"
                value={calcData.endOdometer}
                onChange={(e) => setCalcData((prev) => ({...prev,endOdometer:e.target.value}))}
                placeholder="Ending Odometer"
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>
        )}

        {resultData.errorMessage ? (
          <div className="error-message">{resultData.errorMessage}</div>
        ) : (
          resultData.mileage && (
            <div className="result">
              <div className="result-mileage">Calculated Mileage: {resultData.mileage} km/l</div>
              <div className="form-group">
                <label>Expected Mileage (km/l):</label>
                <input
                  type="number"
                  value={calcData.expectedMileage}
                  onChange={(e) => setCalcData((prev) => ({...prev,expectedMileage:e.target.value}))}
                  placeholder="Enter expected mileage"
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              {resultData.feedbackMessage && <div className="result-feedback">{resultData.feedbackMessage}</div>}
            </div>
          )
        )}
      </div>
    </div>
  );
}
