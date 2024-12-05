import React from 'react';
import './Page404.css';

const NotFoundPage = () => {
  return (
    <div className='notfound-container'>
      <img src={`${process.env.PUBLIC_URL}/icons/404.gif`} alt=''/> Ooops!! Page not found
    </div>
  );
};

export default NotFoundPage;
