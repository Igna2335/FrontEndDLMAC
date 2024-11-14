import React from 'react';
import { Menubar } from 'primereact/menubar';
import '../css/Navbar.css'; // Importamos el archivo CSS personalizado

const Navbar = () => {
  const items = [
    { label: 'Usuarios', icon: 'pi pi-users', command: () => window.location.pathname = '/usuarios' },
    { label: 'Productos', icon: 'pi pi-box', command: () => window.location.pathname = '/productos' },
    { label: 'Cajas', icon: 'pi pi-briefcase', command: () => window.location.pathname = '/cajas' },
    { label: 'Bolsas', icon: 'pi pi-shopping-bag', command: () => window.location.pathname = '/bolsas' },
    { label: 'Dashboard', icon: 'pi pi-chart-line', command: () => window.location.href = 'http://localhost:3001/dashboard' }, // Nueva opción para Dashboard
    { label: 'Cerrar sesión', icon: 'pi pi-power-off', command: () => window.location.pathname = '/' } // Opción de cerrar sesión
  ];

  return (
    <div className="navbar-container">
      <Menubar model={items} className="navbar" />
    </div>
  );
};

export default Navbar;
