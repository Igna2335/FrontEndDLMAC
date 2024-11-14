import React from 'react';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css'; // Asegúrate de crear este archivo CSS

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-content">
        <h1>Bienvenido al Panel de Control de DLMAC</h1>
        <p>Selecciona una opción en el menú para continuar.</p>
      </div>
    </div>
  );
};

export default Dashboard;
