import React from 'react';
import ReactDOM from 'react-dom';
// Los estilos base van antes que la app para que los de cada componente los puedan sobrescribir.
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);