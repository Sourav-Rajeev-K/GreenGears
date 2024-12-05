import React, { useState } from 'react';
import '../Sidebar/Sidebar.css';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', logo:'dashboard2.png' },
    { name: 'Mileage Calculator', path: '/calculator', logo:'calc2.png' },
    { name: 'Market', path: '/market', logo:'market2.png' },
    { name: 'About', path: '/about', logo:'about2.png' },
  ];

  return (
    <div className="sidebar-container">
      <div className={`sidebar-sidecontainer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">Green Gears</div>
        {menuItems.map((item, index) => (
          <NavLink to={item.path} onClick={()=>setIsOpen(prevState => !prevState)} key={index} className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
            <div><img className='menu-icons' src={`${process.env.PUBLIC_URL}/icons/${item.logo}`} alt={item.name}></img>{item.name}</div>
          </NavLink>
        ))}
      </div>
      <main>
        <div className="header">
          <div className='empty-div'></div>
          <div><img className='logo' src={`${process.env.PUBLIC_URL}/icons/greengearslogo.png`} alt='logo'/></div>
          <div onClick={() => setIsOpen(prevState => !prevState)} className="ham-icon">☰</div>
        </div>
        {children}
      </main>
    </div>
  );
}
