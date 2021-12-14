import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './Rover.css';
import RoverComponent from './RoverComponent';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <RoverComponent />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
