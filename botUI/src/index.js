import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Chatbot from './Chatbot';

import Soft from './Soft';
import reportWebVitals from './reportWebVitals';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Soft/>
    <Chatbot /> 
    
  </React.StrictMode>
);

reportWebVitals();
