import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppContextProvider from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import About from './pages/About/About';
import Market from './pages/Market/Market';
import Calculator from './pages/Calculator/Calculator';
import Page404 from './pages/Page404/Page404';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <AppContextProvider>
      <div style={{display:'flex',justifyContent:'center'}}>
        <BrowserRouter  basename="/greengears">
          <Sidebar>
            <Routes>
              <Route path='/' exact="true" element={<Navigate to="/dashboard" replace />}/>
              <Route path='/GreenGears' element={<Navigate to="/dashboard" replace />}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/market' element={<Market/>}/>
              <Route path='/calculator' element={<Calculator/>}/>
              <Route path='*' element={<Page404/>}/>
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}

export default App;