import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="pageHeader">ABOUT</div>
      <div className="about-content">
        <p>
          Welcome to <strong>Green Gears</strong>, your ultimate solution for tracking and optimizing vehicle performance. 
          Our mission is to empower you with the tools and insights to drive smarter, save fuel, and reduce your carbon footprint.
        </p>
        <h2>Our Mission</h2>
        <p>
          At Green Gears, we believe in driving change—literally. By providing intuitive tools and actionable insights, 
          we aim to inspire a community of eco-conscious drivers. Together, we can make a difference for the environment 
          and future generations.
        </p>
        <h2>Get Started</h2>
        <p>
          Ready to optimize your journey? Navigate through our app using the sidebar menu, and discover how Green Gears can help you 
          drive smarter today!
        </p>
      </div>
    </div>
  );
}
